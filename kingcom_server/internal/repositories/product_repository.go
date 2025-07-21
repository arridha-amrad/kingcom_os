package repositories

import (
	"kingcom_server/internal/models"

	"gorm.io/gorm"
)

type CreateOneProductParams struct {
	Name          string
	Slug          string
	Price         float64
	Description   string
	Specification string
	Stock         int
	VideoUrl      string
}

type productRepository struct {
	db *gorm.DB
}

type IProductRepository interface {
	Save(tx gorm.DB, params CreateOneProductParams) (*models.Product, error)
}

func NewProductRepository(db *gorm.DB) IProductRepository {
	return &productRepository{
		db: db,
	}
}

func (r *productRepository) Save(tx gorm.DB, params CreateOneProductParams) (*models.Product, error) {
	product := models.Product{
		Name:          params.Name,
		Price:         params.Price,
		Description:   params.Description,
		Specification: params.Specification,
		Stock:         params.Stock,
		Slug:          params.Slug,
		VideoUrl:      params.VideoUrl,
	}
	if err := tx.Create(&product).Error; err != nil {
		return nil, err
	}
	return &product, nil
}
