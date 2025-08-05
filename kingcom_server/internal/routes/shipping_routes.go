package routes

import (
	"kingcom_server/internal/controllers"
)

type ShippingRoutesParams struct {
	*RoutesParams
	Controller controllers.IShippingController
}

func SetShippingRoutes(params ShippingRoutesParams) {
	ctrl := params.Controller
	md := params.Middleware.Validation
	r := params.Route.Group("/shipping")
	{
		r.GET("/get-provinces", ctrl.GetProvinces)
		r.GET("/get-cities/:provinceID", ctrl.GetCities)
		r.GET("/get-districts/:cityID", ctrl.GetDistricts)
		r.POST("/calc-cost", md.CalcCost, ctrl.CalcCost)
	}
}
