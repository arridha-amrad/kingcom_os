package auth

import (
	"kingcom_server/internal/services"
	"kingcom_server/internal/utils"

	"github.com/gin-gonic/gin"
)

type IAuthController interface {
	Register(c *gin.Context)
	Logout(c *gin.Context)
	RefreshToken(c *gin.Context)
	GetAuth(c *gin.Context)
	Login(c *gin.Context)
	VerifyNewAccount(c *gin.Context)
	ForgotPassword(c *gin.Context)
	ResetPassword(c *gin.Context)
	ResendVerification(c *gin.Context)
}

type authController struct {
	userService     services.IUserService
	authService     services.IAuthService
	emailService    services.IEmailService
	passwordService services.IPasswordService
	redisService    services.IRedisService
	utils           utils.IUtils
}

func NewAuthController(
	passwordService services.IPasswordService,
	authService services.IAuthService,
	userService services.IUserService,
	emailService services.IEmailService,
	redisService services.IRedisService,
	utils utils.IUtils,
) IAuthController {
	return &authController{
		userService:     userService,
		redisService:    redisService,
		passwordService: passwordService,
		emailService:    emailService,
		authService:     authService,
		utils:           utils,
	}
}
