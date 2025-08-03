package routes

import (
	"kingcom_server/internal/container"
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(c *container.Container) *gin.Engine {
	router := gin.Default()
	router.SetTrustedProxies([]string{"127.0.0.1"})
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))
	v1 := router.Group("/api/v1")
	routeParams := &RoutesParams{Route: v1, Middleware: c.Middlewares}
	{
		v1.GET("", func(ctx *gin.Context) {
			ctx.JSON(http.StatusOK, gin.H{"message": "Welcome to KINGCOM_SERVER_API"})
		})
		SetUserRoutes(UserRoutes{
			RoutesParams: routeParams,
			Controller:   c.Controllers.User,
		})
		SetAuthRoutes(AuthRoutesParams{
			RoutesParams: routeParams,
			Controller:   c.Controllers.Auth,
		})
		SetProductRoutes(ProductRoutesParams{
			RoutesParams: routeParams,
			Controller:   c.Controllers.Product,
		})
		SetShippingRoutes(ShippingRoutesParams{
			RoutesParams:     routeParams,
			RajaOngkirApiKey: c.RajaOngkirApiKey,
			Utils:            c.IUtils,
		})
	}
	return router
}

type RoutesParams struct {
	Route      *gin.RouterGroup
	Middleware *container.Middlewares
}
