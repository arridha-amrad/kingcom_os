package user

import (
	"kingcom_server/internal/services"

	"github.com/gin-gonic/gin"
)

type IUserController interface {
	GetUserById(c *gin.Context)
	GetAll(c *gin.Context)
}

type userController struct {
	userService services.IUserService
}

func NewUserController(userService services.IUserService) IUserController {
	return &userController{userService: userService}
}
