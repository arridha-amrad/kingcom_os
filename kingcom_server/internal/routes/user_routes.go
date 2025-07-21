package routes

import (
	"kingcom_server/internal/controllers/user"
)

type UserRoutes struct {
	*RoutesParams
	Controller user.IUserController
}

func SetUserRoutes(params UserRoutes) {
	ctrl := params.Controller

	v1Users := params.Route.Group("/users")
	{
		v1Users.GET("", ctrl.GetAll)
		v1Users.GET("/:id", ctrl.GetUserById)
	}
}
