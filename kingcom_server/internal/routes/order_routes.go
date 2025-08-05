package routes

import "kingcom_server/internal/controllers"

type OrderRoutesParams struct {
	*RoutesParams
	Controller controllers.IOrderController
}

func SetOrderRoutes(params OrderRoutesParams) {
	mdwValidation := params.Middleware.Validation
	mdwAuth := params.Middleware.Auth
	controller := params.Controller
	r := params.Route.Group("/orders")
	{
		r.GET("", mdwAuth.Handler, controller.GetMany)
		r.POST("", mdwAuth.Handler, mdwValidation.CreateOrder, controller.Create)
	}
}
