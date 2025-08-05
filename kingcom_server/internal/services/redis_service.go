package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"kingcom_server/internal/constants"
	"kingcom_server/internal/repositories"
	"log"
	"time"
)

type redisService struct {
	redisRepository repositories.IRedisRepository
}

type IRedisService interface {
	// access token
	GetAccessToken(jti string) (AccessTokenData, error)
	SaveAccessToken(params AccessTokenData) error
	DeleteAccessToken(jti string) error
	// refresh token
	GetRefreshToken(hashedToken string) (RefreshTokenData, error)
	SaveRefreshToken(params RefreshTokenData) error
	DeleteRefreshToken(hashedToken string) error
	// verification token
	SaveVerificationToken(params VerificationData) error
	DeleteVerificationToken(hashedToken string) error
	GetVerificationToken(hashedToken string) (VerificationData, error)
	// password reset
	SavePasswordResetToken(params PasswordResetData) error
	DeletePasswordResetToken(hashedToken string) error
	GetPasswordResetToken(hashedToken string) (PasswordResetData, error)
	// raja ongkir
	SaveProvinces(data RajaOngkirResponse) error
	GetProvinces() (RajaOngkirResponse, error)
}

func NewRedisService(redisRepository repositories.IRedisRepository) IRedisService {
	return &redisService{
		redisRepository: redisRepository,
	}
}

func (s *redisService) GetProvinces() (RajaOngkirResponse, error) {
	key := constants.RAJA_ONGKIR_PROVINCES
	raw, err := s.redisRepository.Get(key)
	if err != nil {
		log.Println(err.Error())
		return RajaOngkirResponse{}, fmt.Errorf("failed to get provinces from redis: %w", err)
	}
	if len(raw) == 0 {
		return RajaOngkirResponse{}, nil
	}
	var provinces RajaOngkirResponse
	if err := json.Unmarshal([]byte(raw), &provinces); err != nil {
		return RajaOngkirResponse{}, fmt.Errorf("failed to unmarshal provinces data: %w", err)
	}
	return provinces, nil
}

func (s *redisService) SaveProvinces(data RajaOngkirResponse) error {
	key := constants.RAJA_ONGKIR_PROVINCES
	jsonData, err := json.Marshal(data)
	if err != nil {
		return fmt.Errorf("failed to marshal provinces data: %w", err)
	}
	err = s.redisRepository.Set(key, string(jsonData), RajaOngkirTTL)
	if err != nil {
		return fmt.Errorf("failed to save provinces in redis: %w", err)
	}
	return nil
}

func (s *redisService) SavePasswordResetToken(params PasswordResetData) error {
	key := setPasswordResetKey(params.HashedToken)
	err := s.redisRepository.HSet(key, map[string]any{
		"token":  params.HashedToken,
		"userId": params.UserId,
	}, PasswordResetTokenTTL)
	return err
}

func (s *redisService) DeletePasswordResetToken(hashedToken string) error {
	key := setPasswordResetKey(hashedToken)
	return s.redisRepository.Delete(key)
}

func (s *redisService) GetPasswordResetToken(hashedToken string) (PasswordResetData, error) {
	key := setPasswordResetKey(hashedToken)
	data, err := s.redisRepository.HGetAll(key)
	if err != nil {
		return PasswordResetData{}, err
	}
	token, ok := data["token"]
	if !ok {
		return PasswordResetData{}, errors.New("token not found")
	}
	userId, ok := data["userId"]
	if !ok {
		return PasswordResetData{}, errors.New("userId not found")
	}
	return PasswordResetData{
		HashedToken: token,
		UserId:      userId,
	}, nil
}

func (s *redisService) SaveVerificationToken(params VerificationData) error {
	key := setVerificationKey(params.HashedToken)
	err := s.redisRepository.HSet(key, map[string]any{
		"code":   params.Code,
		"userId": params.UserId,
	}, VerificationTokenTTL)
	return err
}

func (s *redisService) DeleteAccessToken(jti string) error {
	key := setAccessTokenKey(jti)
	err := s.redisRepository.Delete(key)
	return err
}

func (s *redisService) GetRefreshToken(hashedToken string) (RefreshTokenData, error) {
	key := setRefreshTokenKey(hashedToken)
	data, err := s.redisRepository.HGetAll(key)
	if err != nil {
		return RefreshTokenData{}, err
	}

	strUserId, ok := data["userId"]
	if !ok {
		return RefreshTokenData{}, errors.New("userId not found")
	}

	strJti, ok := data["jti"]
	if !ok {
		return RefreshTokenData{}, errors.New("jti not found")
	}

	return RefreshTokenData{
		UserId:      strUserId,
		Jti:         strJti,
		HashedToken: hashedToken,
	}, nil
}

func (s *redisService) DeleteRefreshToken(hashedToken string) error {
	key := setRefreshTokenKey(hashedToken)
	return s.redisRepository.Delete(key)
}

func (s *redisService) DeleteVerificationToken(hashedToken string) error {
	key := setVerificationKey(hashedToken)
	if err := s.redisRepository.Delete(key); err != nil {
		return err
	}
	return nil
}

func (s *redisService) GetVerificationToken(hashedToken string) (VerificationData, error) {
	key := setVerificationKey(hashedToken)
	data, err := s.redisRepository.HGetAll(key)
	if err != nil {
		return VerificationData{}, err
	}

	strCode, ok := data["code"]
	if !ok {
		return VerificationData{}, errors.New("code not found")
	}

	strUserId, ok := data["userId"]
	if !ok {
		return VerificationData{}, errors.New("userId not found")
	}

	return VerificationData{
		Code:   strCode,
		UserId: strUserId,
	}, nil
}

func (s *redisService) SaveRefreshToken(params RefreshTokenData) error {
	key := setRefreshTokenKey(params.HashedToken)
	err := s.redisRepository.HSet(key, map[string]any{
		"userId": params.UserId,
		"jti":    params.Jti,
		"raw":    params.RawToken,
	}, RefreshTokenTTL)
	return err
}

func (s *redisService) SaveAccessToken(params AccessTokenData) error {
	key := setAccessTokenKey(params.Jti)
	err := s.redisRepository.HSet(key, map[string]any{
		"userId":      params.UserId,
		"accessToken": params.AccessToken,
	}, AccessTokenTTL)
	return err
}

func (s *redisService) GetAccessToken(jti string) (AccessTokenData, error) {
	key := setAccessTokenKey(jti)
	data, err := s.redisRepository.HGetAll(key)
	if err != nil || len(data) == 0 {
		return AccessTokenData{}, fmt.Errorf("record not found for key : %s", key)
	}
	accessToken, ok := data["accessToken"]
	userId, ok2 := data["userId"]
	if !ok || !ok2 {
		return AccessTokenData{}, errors.New("malformed data")
	}
	return AccessTokenData{
		AccessToken: accessToken,
		UserId:      userId,
		Jti:         jti,
	}, nil
}

// helpers

func setPasswordResetKey(hashedToken string) string {
	return fmt.Sprintf("resetPassword:%s", hashedToken)
}

func setAccessTokenKey(jti string) string {
	return fmt.Sprintf("accessToken:%s", jti)
}

func setRefreshTokenKey(hashedToken string) string {
	return fmt.Sprintf("refreshToken:%s", hashedToken)
}

func setVerificationKey(hashedToken string) string {
	return fmt.Sprintf("accountVerification:%s", hashedToken)
}

type RefreshTokenData struct {
	HashedToken string
	RawToken    string
	UserId      string
	Jti         string
}

type AccessTokenData struct {
	AccessToken string
	UserId      string
	Jti         string
}

type VerificationData struct {
	Code        string
	UserId      string
	HashedToken string
}

type PasswordResetData struct {
	HashedToken string
	UserId      string
}

var (
	AccessTokenTTL        = 1 * time.Hour
	RefreshTokenTTL       = 24 * 7 * time.Hour
	VerificationTokenTTL  = 30 * time.Minute
	PasswordResetTokenTTL = 30 * time.Minute
	RajaOngkirTTL         = 1 * time.Hour
)

type RajaOngkirResponse struct {
	MetaResponse
	Data []struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	} `json:"data"`
}

type MetaResponse struct {
	Meta struct {
		Message string `json:"message"`
		Code    int    `json:"code"`
		Status  string `json:"status"`
	} `json:"meta"`
}
