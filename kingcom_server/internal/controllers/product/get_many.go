package product

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (ctrl *productController) GetMany(c *gin.Context) {
	products, err := ctrl.productService.FetchProducts(c.Request.Context())
	if err != nil {
		log.Println("failed to fetch products")
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"products": products})
}
