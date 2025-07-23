package product

import (
	"kingcom_server/internal/services"

	"github.com/gin-gonic/gin"
)

type productController struct {
	productService services.IProductService
	userService    services.IUserService
	cartService    services.ICartService
}

type IProductController interface {
	Create(c *gin.Context)
	GetMany(c *gin.Context)
	GetDetail(c *gin.Context)
	AddToCart(c *gin.Context)
}

func NewProductController(
	prodService services.IProductService,
	userService services.IUserService,
	cartService services.ICartService,
) IProductController {
	return &productController{
		productService: prodService,
		userService:    userService,
		cartService:    cartService,
	}
}
