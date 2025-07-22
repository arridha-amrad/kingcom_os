package repositories

import (
	"kingcom_server/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type CreateOneProductParams struct {
	Name          string
	Slug          string
	Price         float64
	Description   string
	Specification string
	Stock         uint
	VideoUrl      string
}

type productRepository struct {
	db *gorm.DB
}

type IProductRepository interface {
	Save(tx *gorm.DB, params CreateOneProductParams) (*models.Product, error)
	GetOne(params GetOneProductParams) (*models.Product, error)
	GetMany() (*[]models.Product, error)
}

func NewProductRepository(db *gorm.DB) IProductRepository {
	return &productRepository{
		db: db,
	}
}

type GetOneProductParams struct {
	ID   *uuid.UUID
	Slug *string
}

func (r *productRepository) GetOne(params GetOneProductParams) (*models.Product, error) {
	var product models.Product
	whereClause := models.Product{}
	if params.ID != nil {
		whereClause.ID = *params.ID
	}
	if params.Slug != nil {
		whereClause.Slug = *params.Slug
	}
	if err := r.db.Where(&whereClause).First(&product).Error; err != nil {
		return nil, err
	}
	return &product, nil
}

func (r *productRepository) Save(tx *gorm.DB, params CreateOneProductParams) (*models.Product, error) {
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

func (r *productRepository) GetMany() (*[]models.Product, error) {
	var products []models.Product

	if err := r.db.Preload("Images").Find(&products).Error; err != nil {
		return nil, err
	}
	return &products, nil
}
