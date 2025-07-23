package repositories

import (
	"kingcom_server/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type cartRepository struct {
	db *gorm.DB
}

type SaveOneParams struct {
	ProductID uuid.UUID
	Quantity  int
	UserID    uuid.UUID
}

type ICartRepository interface {
	SaveOne(tx *gorm.DB, params SaveOneParams) (*models.Cart, error)
}

func NewCartRepository(db *gorm.DB) ICartRepository {
	return &cartRepository{
		db: db,
	}
}

func (r *cartRepository) SaveOne(tx *gorm.DB, params SaveOneParams) (*models.Cart, error) {
	cart := models.Cart{
		Quantity:  params.Quantity,
		ProductID: params.ProductID,
		UserID:    params.UserID,
	}
	if err := tx.Create(&cart).Error; err != nil {
		return nil, err
	}
	return &cart, nil
}

func (r *cartRepository) GetMany(tx *gorm.DB, userId uuid.UUID) (*[]models.Cart, error) {
	var products []models.Cart
	if err := r.db.
		Table("carts").
		Select("carts.*").
		Joins("LEFT JOIN product AS p ON p.id = carts.id").
		Find(&products).Error; err != nil {
		return nil, err
	}
	return &products, nil
}
