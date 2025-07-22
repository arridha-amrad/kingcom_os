package product

import (
	"fmt"
	"kingcom_server/internal/constants"
	"kingcom_server/internal/dto"
	"kingcom_server/internal/models"
	"kingcom_server/internal/services"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (ctrl *productController) Create(c *gin.Context) {
	value, exist := c.Get(constants.VALIDATED_BODY)
	if !exist {
		c.JSON(http.StatusBadRequest, gin.H{"error": "validated body not exists"})
		return
	}
	body, ok := value.(dto.CreateProduct)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid type for validated body"})
		return
	}

	infoBody := fmt.Sprintf("%+v", body)
	log.Println(infoBody)

	payload, exist := c.Get(constants.ACCESS_TOKEN_PAYLOAD)
	if !exist {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "validated body not exists"})
		return
	}
	tokenPayload, ok := payload.(services.JWTPayload)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token payload"})
		return
	}
	userId, err := uuid.Parse(tokenPayload.UserId)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to parse to uuid"})
		return
	}
	user, err := ctrl.userService.GetUserById(c.Request.Context(), userId)
	if err != nil {
		log.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": "user not found"})
		return
	}
	if user.Role != models.RoleAdmin {
		log.Println("You are not admin")
		c.JSON(http.StatusForbidden, gin.H{"error": "you are not admin"})
		return
	}
	if err := ctrl.productService.StoreNewProduct(c.Request.Context(), services.StoreNewProductParams(body)); err != nil {
		log.Println("Failed to store the product")
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "New product created successfully"})

}
