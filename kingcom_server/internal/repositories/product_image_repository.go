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
	SaveMany(tx *gorm.DB, params []SaveParams) (*[]models.ProductImage, error)
}

func NewProductImageRepository(db *gorm.DB) IProductImageRepository {
	return &productImageRepository{
		db: db,
	}
}

func (r *productImageRepository) SaveMany(tx *gorm.DB, params []SaveParams) (*[]models.ProductImage, error) {
	if len(params) == 0 {
		return nil, errors.New("params must be a slice of url and product_id")
	}
	images := make([]models.ProductImage, 0, len(params))
	for _, param := range params {
		images = append(images, models.ProductImage{
			Url:       param.Url,
			ProductId: param.ProductId,
		})
	}
	if err := tx.Create(&images).Error; err != nil {
		return nil, err
	}
	return &images, nil
}
