package controllers

import (
	"kingcom_server/internal/constants"
	"kingcom_server/internal/dto"
	"kingcom_server/internal/services"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type orderController struct {
	orderService services.IOrderService
}

type IOrderController interface {
	GetMany(ctx *gin.Context)
	Create(c *gin.Context)
}

func NewOrderController(
	service services.IOrderService,
) IOrderController {
	return &orderController{
		orderService: service,
	}
}

func (ctrl *orderController) GetMany(ctx *gin.Context) {}

func (ctrl *orderController) Create(c *gin.Context) {
	value, exist := c.Get(constants.VALIDATED_BODY)
	if !exist {
		c.JSON(http.StatusBadRequest, gin.H{"error": "validated body not exists"})
		return
	}
	body, ok := value.(dto.CreateOrderRequest)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid type for validated body"})
		return
	}

	accTokenPayload, exist := c.Get(constants.ACCESS_TOKEN_PAYLOAD)
	if !exist {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "validated body not exists"})
		return
	}
	tokenPayload, ok := accTokenPayload.(services.JWTPayload)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token payload"})
		return
	}
	userId, err := uuid.Parse(tokenPayload.UserId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse to uuid"})
		return
	}
	log.Println(userId)
	log.Printf("%+v", body)
	// if err := ctrl.orderService.PlaceOrder(
	// 	c.Request.Context(),
	// 	userId,
	// 	body.Total,
	// 	body.Shipping,
	// 	body.Items,
	// ); err != nil {
	// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	// 	return
	// }
	c.JSON(http.StatusCreated, gin.H{
		"message": "Order placed successfully",
	})
}
