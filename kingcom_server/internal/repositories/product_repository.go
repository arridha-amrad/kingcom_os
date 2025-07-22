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
	GetMany() (*[]ProductWithAvgRating, error)
	GetOneBySlug(slug string) (*ProductWithAvgRating, error)
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

func (r *productRepository) GetMany() (*[]ProductWithAvgRating, error) {
	var products []ProductWithAvgRating

	if err := r.db.
		Table("products").
		Select("products.*, COALESCE(CEIL(AVG(pr.value) * 10) / 10, 0) AS average_rating").
		Joins("LEFT JOIN product_ratings AS pr ON pr.product_id = products.id").
		Group("products.id").
		Preload("Images").Preload("Ratings").Find(&products).Error; err != nil {
		return nil, err
	}
	return &products, nil
}

type ProductWithAvgRating struct {
	models.Product
	AverageRating float64 `json:"average_rating"`
}

func (r *productRepository) GetOneBySlug(slug string) (*ProductWithAvgRating, error) {
	var product ProductWithAvgRating
	whereClause := models.Product{
		Slug: slug,
	}
	if err := r.db.
		Table("products").
		Select("products.*, COALESCE(CEIL(AVG(pr.value) * 10) / 10, 0) AS average_rating").
		Joins("LEFT JOIN product_ratings AS pr ON pr.product_id = products.id").
		Group("products.id").
		Preload("Images").
		Preload("Ratings").
		Where(whereClause).First(&product).Error; err != nil {
		return nil, err
	}
	return &product, nil
}
