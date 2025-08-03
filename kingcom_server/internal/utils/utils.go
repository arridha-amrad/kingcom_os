package utils

import (
	"kingcom_server/internal/config"
	"log"

	"github.com/gin-gonic/gin"
	"golang.org/x/oauth2"
)

type IUtils interface {
	GenerateRandomBytes(size int) (string, error)
	HashWithSHA256(randomStr string) string
	CreateGoogleOauth2Config() *oauth2.Config
	GetTokenFromRefreshToken(config *oauth2.Config) *oauth2.Token
	SendEmailWithGmail(subject, body, address string) error
	ToSlug(input string) string
	RespondWithError(c *gin.Context, statusCode int, err error, message string)
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

func (u *utility) RespondWithError(c *gin.Context, statusCode int, err error, message string) {
	log.Println(err.Error())
	c.JSON(statusCode, gin.H{"error": message})
}
