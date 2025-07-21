package auth

import (
	"kingcom_server/internal/constants"
	"kingcom_server/internal/dto"
	"kingcom_server/internal/services"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (ctrl *authController) VerifyNewAccount(c *gin.Context) {
	value, exist := c.Get(constants.VALIDATED_BODY)
	if !exist {
		c.JSON(http.StatusBadRequest, gin.H{"error": "unValidated request body"})
		return
	}

	body, ok := value.(dto.VerifyNewAccount)
	if !ok {
		c.JSON(
			http.StatusInternalServerError,
			gin.H{"error": "invalid type for validatedBody"},
		)
		return
	}

	strUserId, err := ctrl.authService.VerifyVerificationToken(
		services.VerificationTokenData{
			RawToken: body.Token,
			Code:     body.Code,
		})
	if err != nil {
		log.Println("Verify account token and code failure")
		c.JSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
		return
	}

	userId, err := uuid.Parse(strUserId)
	if err != nil {
		c.JSON(
			http.StatusInternalServerError,
			gin.H{"error": err.Error()},
		)
		return
	}

	user, err := ctrl.userService.GetUserById(c.Request.Context(), userId)
	if err != nil {
		c.JSON(
			http.StatusNotFound,
			gin.H{"error": err.Error()},
		)
		return
	}

	if user.IsVerified {
		c.JSON(
			http.StatusBadRequest,
			gin.H{"error": "User account has already been verified"},
		)
		return
	}

	if err := ctrl.authService.VerifyNewAccount(c.Request.Context(), userId); err != nil {
		log.Println("failed to verify new account")
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	authToken, err := ctrl.authService.CreateAuthTokens(services.CreateAuthTokenParams{
		UserId:     user.ID,
		JwtVersion: user.JwtVersion,
	})
	if err != nil {
		log.Println("failed to create auth token")
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if err := ctrl.redisService.DeleteVerificationToken(ctrl.utils.HashWithSHA256(body.Token)); err != nil {
		log.Println("Failed to delete verification token")
	}

	c.SetCookie(constants.COOKIE_REFRESH_TOKEN, authToken.RefreshToken, 3600*24*365, "/", "", os.Getenv("GO_ENV") == "production", true)

	c.JSON(http.StatusOK, gin.H{
		"user":          user,
		"token":         authToken.AccessToken,
		"refresh_token": authToken.RefreshToken,
	})

}
