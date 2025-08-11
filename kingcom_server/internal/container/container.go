package container

import (
	"kingcom_server/internal/config"
	"kingcom_server/internal/controllers"
	"kingcom_server/internal/controllers/auth"
	"kingcom_server/internal/controllers/product"
	"kingcom_server/internal/controllers/user"
	"kingcom_server/internal/middleware"
	"kingcom_server/internal/repositories"
	"kingcom_server/internal/services"
	"kingcom_server/internal/transaction"
	"kingcom_server/internal/utils"

	"github.com/go-playground/validator/v10"
	"github.com/redis/go-redis/v9"
	"gorm.io/gorm"
)

type Container struct {
	Controllers *Controllers
	Middlewares *Middlewares
	*config.Config
	utils.IUtils
}

func NewContainer(db *gorm.DB, rdb *redis.Client, validate *validator.Validate, config *config.Config) *Container {
	// Repositories
	userRepo := repositories.NewUserRepository(db)
	redisRepo := repositories.NewRedisRepository(rdb)
	txManager := transaction.NewTransactionManager(db)
	productRepo := repositories.NewProductRepository(db)
	productImagesRepo := repositories.NewProductImageRepository(db)
	cartRepo := repositories.NewCartRepository(db)
	orderRepo := repositories.NewOrderRepository(db)

	// Utilities
	utilities := utils.NewUtilities(config.JWtSecretKey, config.AppUri, config.GoogleOAuth2)

	// Services
	redisService := services.NewRedisService(redisRepo)
	jwtService := services.NewJwtService(config.JWtSecretKey, redisService)
	authService := services.NewAuthService(redisService, utilities, jwtService, txManager, userRepo)
	userService := services.NewUserService(userRepo)
	emailService := services.NewEmailService(config.AppUri, utilities)
	passwordService := services.NewPasswordService()
	productService := services.NewProductService(productImagesRepo, productRepo, txManager, utilities)
	cartService := services.NewCartService(cartRepo, txManager)
	orderService := services.NewOrderService(orderRepo, cartRepo, productRepo, txManager)

	// Controllers
	userCtrl := user.NewUserController(userService)
	authCtrl := auth.NewAuthController(
		passwordService,
		authService,
		userService,
		emailService,
		redisService,
		utilities,
	)
	productCtrl := product.NewProductController(productService, userService, cartService)
	shippingCtrl := controllers.NewShippingController(
		redisService,
		config.RajaOngkirApiKey,
		utilities,
	)
	orderCtrl := controllers.NewOrderController(orderService)

	// Middleware
	validationMiddleware := middleware.NewValidationMiddleware(validate)
	authMiddleware := middleware.NewAuthMiddleware(jwtService, userService)

	return &Container{
		Controllers: &Controllers{
			Auth:     authCtrl,
			User:     userCtrl,
			Product:  productCtrl,
			Shipping: shippingCtrl,
			Order:    orderCtrl,
		},
		Middlewares: &Middlewares{
			Validation: validationMiddleware,
			Auth:       authMiddleware,
		},
		Config: config,
		IUtils: utilities,
	}
}

type Middlewares struct {
	Validation middleware.IValidationMiddleware
	Auth       middleware.IAuthMiddleware
}

type Controllers struct {
	Auth     auth.IAuthController
	User     user.IUserController
	Product  product.IProductController
	Shipping controllers.IShippingController
	Order    controllers.IOrderController
}
