package dto

import "github.com/google/uuid"

type CreateProduct struct {
	Name          string   `json:"name" validate:"required"`
	Weight        float64  `json:"weight" validate:"required,numeric,gt=0"`
	Price         float64  `json:"price" validate:"required,numeric,gt=0"`
	Description   string   `json:"description" validate:"required"`
	Specification string   `json:"specification" validate:"required"`
	Stock         uint     `json:"stock" validate:"required,numeric,gte=0"`
	VideoUrl      string   `json:"videoUrl" validate:"required,url"`
	Images        []string `json:"images" validate:"required,min=1,dive,required,url"`
}

type AddToCart struct {
	ProductID uuid.UUID `json:"productId" validate:"required"`
	Quantity  int       `json:"quantity" validate:"required,gt=0"`
}
