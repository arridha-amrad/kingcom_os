package product

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (ctrl *productController) GetDetail(c *gin.Context) {
	slug := c.Param("slug")
	product, err := ctrl.productService.FetchProductBySlug(c.Request.Context(), slug)
	if err != nil {
		log.Println("failed to fetch product by slug")
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"product": product})
}
