package routes

import (
	"kingcom_server/internal/controllers/product"
)

type ProductRoutesParams struct {
	*RoutesParams
	Controller product.IProductController
}

func SetProductRoutes(params ProductRoutesParams) {
	mdwValidation := params.Middleware.Validation
	mdwAuth := params.Middleware.Auth
	controller := params.Controller
	r := params.Route.Group("/products")
	{
		r.GET("", controller.GetMany)
		r.GET(":slug", controller.GetDetail)
		r.POST("", mdwValidation.CreateProduct, mdwAuth.Handler, controller.Create)
		r.POST("/cart", mdwValidation.AddToCart, mdwAuth.Handler, controller.AddToCart)
	}
}
