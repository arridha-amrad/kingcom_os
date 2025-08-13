package controllers

import (
	"kingcom_server/internal/constants"
	"kingcom_server/internal/dto"
	"kingcom_server/internal/services"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type orderController struct {
	orderService services.IOrderService
	authService  services.IAuthService
	userService  services.IUserService
}

type IOrderController interface {
	GetMany(ctx *gin.Context)
	Create(c *gin.Context)
	Checkout(c *gin.Context)
}

func NewOrderController(
	orderService services.IOrderService,
	authService services.IAuthService,
	userService services.IUserService,
) IOrderController {
	return &orderController{
		orderService: orderService,
		authService:  authService,
		userService:  userService,
	}
}

func (ctrl *orderController) Checkout(c *gin.Context) {
	value, exist := c.Get(constants.VALIDATED_BODY)
	if !exist {
		c.JSON(http.StatusBadRequest, gin.H{"error": "validated body not exists"})
		return
	}
	body, ok := value.(dto.CheckoutRequest)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid type for validated body"})
		return
	}
	order, err := ctrl.orderService.GetOrderById(body.OrderId)
	if err != nil {
		if strings.Contains(err.Error(), "not found") {
			c.JSON(http.StatusNotFound, gin.H{"error": "order not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to query order by id"})
		return
	}
	payload, err := ctrl.authService.GetAccessTokenPayload(c)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusUnauthorized, gin.H{"error": "failed to get access token payload"})
		return
	}
	user, err := ctrl.userService.GetUserById(c.Request.Context(), payload.UserId)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	snapRes, err := ctrl.orderService.GetMidtransTransactionToken(
		order.ID.String(),
		order.Total,
		user.Name,
		user.Email,
		order.Shipping.Address,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"token": snapRes.Token,
		"url":   snapRes.RedirectURL,
	})
}

func (ctrl *orderController) GetMany(c *gin.Context) {
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
	orders, err := ctrl.orderService.GetOrders(userId)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get orders"})
		return
	}
	c.JSON(
		http.StatusOK,
		gin.H{"orders": orders},
	)
}

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
	if err := ctrl.orderService.PlaceOrder(
		c.Request.Context(),
		userId,
		body.Total,
		body.Shipping,
		body.Items,
	); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{
		"message": "Order placed successfully",
	})
}
