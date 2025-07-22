package repositories

import (
	"errors"
	"kingcom_server/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SaveParams struct {
	Url       string
	ProductId uuid.UUID
}

type productImageRepository struct {
	db *gorm.DB
}

type IProductImageRepository interface {
	SaveMany(tx *gorm.DB, productId uuid.UUID, urls []string) (*[]models.ProductImage, error)
}

func NewProductImageRepository(db *gorm.DB) IProductImageRepository {
	return &productImageRepository{
		db: db,
	}
}

func (r *productImageRepository) SaveMany(tx *gorm.DB, productId uuid.UUID, urls []string) (*[]models.ProductImage, error) {
	if len(urls) == 0 {
		return nil, errors.New("params must be a slice of url and product_id")
	}
	images := make([]models.ProductImage, 0, len(urls))
	for _, url := range urls {
		images = append(images, models.ProductImage{
			Url:       url,
			ProductID: productId,
		})
	}
	if err := tx.Create(&images).Error; err != nil {
		return nil, err
	}
	return &images, nil
}

func (r *productImageRepository) GetMany(tx *gorm.DB, productID uuid.UUID) (*[]models.ProductImage, error) {
	var images []models.ProductImage
	if err := r.db.Where(&models.ProductImage{
		ProductID: productID,
	}).Find(&images).Error; err != nil {
		return nil, err
	}
	return &images, nil
}
