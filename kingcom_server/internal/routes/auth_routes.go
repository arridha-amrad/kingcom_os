package routes

import (
	"kingcom_server/internal/controllers/auth"
)

type AuthRoutesParams struct {
	*RoutesParams
	Controller auth.IAuthController
}

func SetAuthRoutes(params AuthRoutesParams) {
	mdwValidation := params.Middleware.Validation
	mdwAuth := params.Middleware.Auth
	authController := params.Controller
	authRoutes := params.Route.Group("/auth")
	{
		authRoutes.GET("", mdwAuth.Handler, authController.GetAuth)
		authRoutes.POST("", mdwValidation.Login, authController.Login)
		authRoutes.POST("/refresh-token", authController.RefreshToken)
		authRoutes.POST("/reset-password", mdwValidation.ResetPassword, authController.ResetPassword)
		authRoutes.POST("/forgot-password", mdwValidation.ForgotPassword, authController.ForgotPassword)
		authRoutes.POST("/logout", mdwAuth.Handler, authController.Logout)
		authRoutes.POST("/register", mdwValidation.Register, authController.Register)
		authRoutes.POST("/resend-verification", mdwValidation.ResendVerification, authController.ResendVerification)
		authRoutes.POST("/verify", mdwValidation.VerifyNewAccount, authController.VerifyNewAccount)
	}
}
