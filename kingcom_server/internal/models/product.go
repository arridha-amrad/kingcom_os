package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Product struct {
	ID        uuid.UUID      `gorm:"type:uuid;primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`

	Name          string          `json:"name"`
	Weight        float64         `json:"weight" gorm:"default:0"`
	Slug          string          `json:"slug"`
	Price         float64         `json:"price"`
	Description   string          `json:"description"`
	Specification string          `json:"specification"`
	Stock         uint            `json:"stock"`
	VideoUrl      string          `json:"video_url"`
	Discount      int             `json:"discount"`
	Images        []ProductImage  `gorm:"foreignKey:ProductID" json:"images"`
	Ratings       []ProductRating `gorm:"foreignKey:ProductID" json:"-"`
}

type ProductImage struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`

	Url       string    `json:"url"`
	ProductID uuid.UUID `json:"-"`
	Product   Product   `gorm:"foreignKey:ProductID" json:"-"`
}

type ProductRating struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time `json:"created_at"`

	Value     float64   `json:"value"`
	ProductID uuid.UUID `json:"product_id"`
	Product   Product   `gorm:"foreignKey:ProductID" json:"-"`
}

type ProductReview struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at"`

	Rating    float64   `json:"rating"`
	Body      string    `json:"body"`
	ProductID uuid.UUID `json:"product_id"`
	Product   Product   `gorm:"foreignKey:ProductID" json:"-"`
	UserID    uuid.UUID `json:"user_id"`
	User      User      `gorm:"foreignKey:UserID" json:"-"`
}

func (p *Product) BeforeCreate(tx *gorm.DB) (err error) {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return
}
