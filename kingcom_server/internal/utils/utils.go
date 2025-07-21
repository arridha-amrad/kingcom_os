package utils

import (
	"kingcom_server/internal/config"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/oauth2"
)

type IUtils interface {
	GenerateRandomBytes(size int) (string, error)
	HashWithSHA256(randomStr string) string
	GenerateToken(userId, jti uuid.UUID) (string, error)
	ValidateToken(tokenString string) (*jwt.MapClaims, error)
	HashPassword(password string) (string, error)
	VerifyPassword(hashedPassword, password string) error
	CreateGoogleOauth2Config() *oauth2.Config
	GetTokenFromRefreshToken(config *oauth2.Config) *oauth2.Token
	SendEmailWithGmail(subject, body, address string) error
	ToSlug(input string) string
}

type utility struct {
	jwtSecretKey string
	appUri       string
	google       *config.GoogleOAuth2Config
}

func NewUtilities(jwtSecretKey, appUri string, google config.GoogleOAuth2Config) IUtils {
	return &utility{
		jwtSecretKey: jwtSecretKey,
		appUri:       appUri,
		google:       &google,
	}
}
