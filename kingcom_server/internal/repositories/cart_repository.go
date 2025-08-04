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
	GetMany(userId uuid.UUID) (*[]CartWithProduct, error)
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

func (r *cartRepository) GetMany(userId uuid.UUID) (*[]CartWithProduct, error) {
	var flatCarts []CartWithProductFlat
	err := r.db.
		Table("carts").
		Select(`
			carts.*,
			p.id AS product_id,
			p.name AS product_name,
			p.price AS product_price,
			p.weight AS product_weight,
			p.discount AS product_discount,
			(
				SELECT url 
				FROM product_images 
				WHERE product_images.product_id = carts.product_id 
				LIMIT 1
			) 
			AS product_image
		`).
		Joins("LEFT JOIN products AS p ON p.id = carts.product_id").
		Where("carts.user_id = ?", userId).
		Scan(&flatCarts).Error

	if err != nil {
		return nil, err
	}

	var result []CartWithProduct
	for _, flat := range flatCarts {
		result = append(result, CartWithProduct{
			Cart: flat.Cart,
			Product: ProductInCart{
				ID:       flat.ProductID,
				Name:     flat.ProductName,
				Price:    flat.ProductPrice,
				Image:    flat.ProductImage,
				Discount: flat.ProductDiscount,
				Weight:   flat.ProductWeight,
			},
		})
	}

	return &result, nil
}

type CartWithProductFlat struct {
	models.Cart
	ProductID       uuid.UUID `json:"product_id"`
	ProductName     string    `json:"product_name"`
	ProductPrice    float64   `json:"product_price"`
	ProductDiscount int       `json:"product_discount"`
	ProductImage    string    `json:"product_image"`
	ProductWeight   float64   `json:"product_weight"`
}

type CartWithProduct struct {
	models.Cart
	Product ProductInCart
}

type ProductInCart struct {
	ID       uuid.UUID `json:"id"`
	Name     string    `json:"name"`
	Price    float64   `json:"price"`
	Image    string    `json:"image"`
	Discount int       `json:"discount"`
	Weight   float64   `json:"weight"`
}
