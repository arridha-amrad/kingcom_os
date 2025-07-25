package product

import (
	"kingcom_server/internal/constants"
	"kingcom_server/internal/dto"
	"kingcom_server/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (ctrl *productController) AddToCart(c *gin.Context) {
	value, exist := c.Get(constants.ACCESS_TOKEN_PAYLOAD)
	if !exist {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "validated body not exists"})
		return
	}

	tokenPayload, ok := value.(services.JWTPayload)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token payload"})
		return
	}

	userId, err := uuid.Parse(tokenPayload.UserId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse to uuid"})
		return
	}

	value, exist = c.Get(constants.VALIDATED_BODY)
	if !exist {
		c.JSON(http.StatusBadRequest, gin.H{"error": "validated body not exists"})
		return
	}
	body, ok := value.(dto.AddToCart)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid type for validated body"})
		return
	}

	ctrl.cartService.Store(c.Request.Context(), services.StoreParams{
		Quantity:  body.Quantity,
		ProductID: body.ProductID,
		UserID:    userId,
	})

	c.JSON(http.StatusCreated, gin.H{
		"message": "Added to cart",
	})
}
