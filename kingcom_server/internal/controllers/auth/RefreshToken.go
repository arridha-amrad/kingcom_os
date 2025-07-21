package auth

import (
	"kingcom_server/internal/constants"
	"kingcom_server/internal/services"
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (ctrl *authController) RefreshToken(c *gin.Context) {

	rawRefreshToken, err := ctrl.authService.GetRefreshTokenFromRequest(c)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "refresh token is missing"})
		return
	}

	data, err := ctrl.redisService.GetRefreshToken(ctrl.utils.HashWithSHA256(rawRefreshToken))
	if err != nil {
		log.Println(err.Error(), "failed to get data from redis")
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	userId, err := uuid.Parse(data.UserId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	oldJti, err := uuid.Parse(data.Jti)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	user, err := ctrl.userService.GetUserById(c.Request.Context(), userId)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	authToken, err := ctrl.authService.CreateAuthTokens(services.CreateAuthTokenParams{
		UserId:      userId,
		JwtVersion:  user.JwtVersion,
		OldRefToken: &rawRefreshToken,
		OldTokenJti: &oldJti,
	})
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create auth tokens"})
		return
	}

	c.SetCookie(constants.COOKIE_REFRESH_TOKEN, authToken.RefreshToken, 3600*24*365, "/", "", os.Getenv("GO_ENV") == "production", true)

	c.JSON(http.StatusOK, gin.H{
		"token":         authToken.AccessToken,
		"refresh_token": authToken.RefreshToken,
	})
}
