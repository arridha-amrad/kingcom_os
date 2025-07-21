package auth

import (
	"kingcom_server/internal/constants"
	"kingcom_server/internal/dto"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (ctrl *authController) ResetPassword(c *gin.Context) {
	value, exist := c.Get(constants.VALIDATED_BODY)
	if !exist {
		c.JSON(http.StatusBadRequest, gin.H{"error": "validated body not exists"})
		return
	}

	body, ok := value.(dto.ResetPassword)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid type for validated body"})
		return
	}

	data, err := ctrl.redisService.GetPasswordResetToken(ctrl.utils.HashWithSHA256(body.Token))
	if err != nil {
		log.Println("token not found in redis")
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	userId, err := uuid.Parse(data.UserId)
	if err != nil {
		log.Println("failed to parse to uuid")
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if _, err := ctrl.userService.GetUserById(c.Request.Context(), userId); err != nil {
		log.Println("user not found")
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	newPassword, err := ctrl.passwordService.Hash(body.Password)
	if err != nil {
		log.Println("failed to hash the password")
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if err := ctrl.authService.UpdateUserPassword(c.Request.Context(), userId, newPassword); err != nil {
		log.Println("failure on update user password")
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	if err := ctrl.redisService.DeletePasswordResetToken(ctrl.utils.HashWithSHA256(body.Token)); err != nil {
		log.Println("failed to delete pwd reset token from redis")
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Reset password is successful"})

}
