package product

import (
	"kingcom_server/internal/constants"
	"kingcom_server/internal/services"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (ctrl *productController) GetCart(c *gin.Context) {
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
	cart, err := ctrl.cartService.GetUserCart(c.Request.Context(), userId)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user cart"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"cart": cart})

}
