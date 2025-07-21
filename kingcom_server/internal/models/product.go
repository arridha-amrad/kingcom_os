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

	Name          string `json:"name"`
	Slug          string
	Price         float64        `json:"price"`
	Description   string         `json:"description"`
	Specification string         `json:"specification"`
	Stock         int            `json:"stock"`
	VideoUrl      string         `json:"video_url"`
	Images        []ProductImage `gorm:"foreignKey:ProductID"`
}

type ProductImage struct {
	gorm.Model
	Url       string
	ProductId uuid.UUID `json:"product_id"`
	Product   Product   `gorm:"foreignKey:ProductID"`
}

type ProductReview struct {
	gorm.Model
	Rating    float64
	Body      string
	ProductId uuid.UUID `json:"product_id"`
	Product   Product   `gorm:"foreignKey:ProductID"`
	UserId    uuid.UUID `json:"user_id"`
	User      User      `gorm:"foreignKey:UserID"`
}

func (p *Product) BeforeCreate(tx *gorm.DB) (err error) {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	return
}
