package services

import (
	"context"
	"errors"
	"kingcom_server/internal/constants"
	"kingcom_server/internal/dto"
	"kingcom_server/internal/models"
	"kingcom_server/internal/repositories"
	"kingcom_server/internal/transaction"
	"kingcom_server/internal/utils"
	"log"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type authService struct {
	redisService IRedisService
	utils        utils.IUtils
	jwtService   IJwtService
	txManager    transaction.ITransactionManager
	userRepo     repositories.IUserRepository
}

type IAuthService interface {
	CreateAuthTokens(
		params CreateAuthTokenParams,
	) (CreateAuthTokensResult, error)
	CreateVerificationToken(
		userId uuid.UUID,
	) (VerificationTokenData, error)
	VerifyVerificationToken(
		params VerificationTokenData,
	) (string, error)
	GeneratePairToken() (TokenPair, error)
	SaveRegistrationData(
		ctx context.Context,
		params repositories.CreateOneParams,
	) (*models.User, error)
	UpdateUserPassword(
		ctx context.Context,
		userId uuid.UUID,
		newPassword string,
	) error
	VerifyNewAccount(
		ctx context.Context,
		userId uuid.UUID,
	) error
	GetRefreshTokenFromRequest(
		c *gin.Context,
	) (string, error)
	GetAccessTokenPayload(
		c *gin.Context,
	) (AccessTokenPayload, error)
}

func NewAuthService(
	redisService IRedisService,
	utils utils.IUtils,
	jwtService IJwtService,
	txManager transaction.ITransactionManager,
	userRepo repositories.IUserRepository,
) IAuthService {
	return &authService{
		redisService: redisService,
		utils:        utils,
		jwtService:   jwtService,
		txManager:    txManager,
		userRepo:     userRepo,
	}
}

func (s *authService) GetAccessTokenPayload(
	c *gin.Context,
) (AccessTokenPayload, error) {
	accTokenPayload, exist := c.Get(constants.ACCESS_TOKEN_PAYLOAD)
	if !exist {
		return AccessTokenPayload{}, errors.New("validated body not exists")
	}
	tokenPayload, ok := accTokenPayload.(JWTPayload)
	if !ok {
		return AccessTokenPayload{}, errors.New("invalid token payload")
	}
	userId, err := uuid.Parse(tokenPayload.UserId)
	if err != nil {
		return AccessTokenPayload{}, errors.New("failed to parse to uuid")
	}
	jti, err := uuid.Parse(tokenPayload.Jti)
	if err != nil {
		return AccessTokenPayload{}, errors.New("failed to parse to uuid")
	}
	return AccessTokenPayload{
		UserId:     userId,
		Jti:        jti,
		JwtVersion: tokenPayload.JwtVersion,
	}, nil
}

func (s *authService) GetRefreshTokenFromRequest(
	c *gin.Context,
) (string, error) {
	rawRefreshToken, err := c.Cookie(constants.COOKIE_REFRESH_TOKEN)
	// if refresh token not exists in cookie
	if err != nil {
		// find refresh token in request body
		var input dto.RefreshTokenInput
		if err := c.ShouldBindJSON(&input); err != nil {
			return "", err
		}
		rawRefreshToken = input.RefreshToken
	}
	return rawRefreshToken, nil
}

func (s *authService) VerifyNewAccount(
	ctx context.Context,
	userId uuid.UUID,
) error {
	err := s.txManager.Do(ctx, func(tx *gorm.DB) error {
		if _, err := s.userRepo.UpdateOne(tx, userId, repositories.UpdateParams{
			IsVerified: true,
		}); err != nil {
			return err
		}
		return nil
	})
	return err
}

func (s *authService) UpdateUserPassword(
	ctx context.Context,
	userId uuid.UUID,
	newPassword string,
) error {
	randomBytes, err := s.utils.GenerateRandomBytes(constants.JWT_VERSION_LENGTH)
	if err != nil {
		return err
	}
	if err := s.txManager.Do(ctx, func(tx *gorm.DB) error {
		if _, err := s.userRepo.UpdateOne(tx, userId, repositories.UpdateParams{
			Password:   newPassword,
			JwtVersion: randomBytes,
		}); err != nil {
			return err
		}
		return nil
	}); err != nil {
		return err
	}
	return nil
}

func (s *authService) SaveRegistrationData(
	ctx context.Context,
	params repositories.CreateOneParams,
) (*models.User, error) {
	user, err := s.userRepo.GetOne(
		repositories.GetOneParams{
			Username: &params.Username,
		})
	if err != nil {
		if !strings.Contains(err.Error(), "not found") {
			return nil, err
		}
	}
	if user != nil {
		return nil, errors.New("username has been registered")
	}
	user, err = s.userRepo.GetOne(
		repositories.GetOneParams{
			Email: &params.Email,
		})
	if err != nil {
		if !strings.Contains(err.Error(), "not found") {
			return nil, err
		}
	}
	if user != nil {
		return nil, errors.New("email has been registered")
	}
	var newUser *models.User
	err = s.txManager.Do(ctx, func(tx *gorm.DB) error {
		user, err := s.userRepo.CreateOne(tx, params)
		if err != nil {
			return err
		}
		newUser = user
		return nil
	})
	if err != nil {
		return nil, err
	}
	return newUser, nil
}

func (s *authService) CreateAuthTokens(
	params CreateAuthTokenParams,
) (CreateAuthTokensResult, error) {
	// delete old refresh token record from redis (refresh token behavior)
	if params.OldRefToken != nil {
		if err := s.redisService.DeleteRefreshToken(s.utils.HashWithSHA256(*params.OldRefToken)); err != nil {
			log.Printf("failed to delete refresh token: %s", err.Error())
			return CreateAuthTokensResult{}, err
		}
	}
	// delete old access token record from redis (refresh token behavior)
	if params.OldTokenJti != nil {
		if err := s.redisService.DeleteAccessToken(params.OldTokenJti.String()); err != nil {
			return CreateAuthTokensResult{}, err
		}
	}
	newJti := uuid.New()
	refTokenPair, err := s.GeneratePairToken()
	if err != nil {
		return CreateAuthTokensResult{}, err
	}
	if err := s.redisService.SaveRefreshToken(RefreshTokenData{
		HashedToken: refTokenPair.Hashed,
		RawToken:    refTokenPair.Raw,
		UserId:      params.UserId.String(),
		Jti:         newJti.String(),
	}); err != nil {
		log.Println("failed to store refresh token in redis")
		return CreateAuthTokensResult{}, err
	}
	accessToken, err := s.jwtService.Create(JWTPayload{
		UserId:     params.UserId.String(),
		Jti:        newJti.String(),
		JwtVersion: params.JwtVersion,
	})
	if err != nil {
		return CreateAuthTokensResult{}, err
	}
	if err := s.redisService.SaveAccessToken(AccessTokenData{
		AccessToken: accessToken,
		UserId:      params.UserId.String(),
		Jti:         newJti.String(),
	}); err != nil {
		log.Println("failed to store access token in redis")
		return CreateAuthTokensResult{}, err
	}
	return CreateAuthTokensResult{
		RefreshToken: refTokenPair.Raw,
		AccessToken:  accessToken,
	}, nil

}

func (s *authService) CreateVerificationToken(
	userId uuid.UUID,
) (VerificationTokenData, error) {
	tokenPair, err := s.GeneratePairToken()
	if err != nil {
		return VerificationTokenData{}, err
	}
	code, err := s.utils.GenerateRandomBytes(4)
	if err != nil {
		return VerificationTokenData{}, err
	}
	if err := s.redisService.SaveVerificationToken(VerificationData{
		Code:        code,
		UserId:      userId.String(),
		HashedToken: tokenPair.Hashed,
	}); err != nil {
		return VerificationTokenData{}, err
	}
	return VerificationTokenData{
		RawToken: tokenPair.Raw,
		Code:     code,
	}, nil
}

func (s *authService) VerifyVerificationToken(
	params VerificationTokenData,
) (string, error) {
	data, err := s.redisService.GetVerificationToken(
		s.utils.HashWithSHA256(params.RawToken),
	)
	if err != nil {
		return "", err
	}
	if data.Code != params.Code {
		return "", errors.New("invalid code")
	}
	return data.UserId, nil
}

// Helpers
func (s *authService) GeneratePairToken() (TokenPair, error) {
	rawToken, err := s.utils.GenerateRandomBytes(32)
	if err != nil {
		return TokenPair{}, errors.New("failure on generating random bytes")
	}

	hashedToken := s.utils.HashWithSHA256(rawToken)
	return TokenPair{
		Raw:    rawToken,
		Hashed: hashedToken,
	}, nil
}

type CreateAuthTokenParams struct {
	UserId      uuid.UUID
	JwtVersion  string
	OldRefToken *string
	OldTokenJti *uuid.UUID
}

type CreateAuthTokensResult struct {
	RefreshToken string
	AccessToken  string
}

type VerificationTokenData struct {
	RawToken string
	Code     string
}

type TokenPair struct {
	Hashed string
	Raw    string
}

type AccessTokenPayload struct {
	UserId     uuid.UUID
	Jti        uuid.UUID
	JwtVersion string
}
