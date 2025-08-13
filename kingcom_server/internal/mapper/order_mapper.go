package mapper

import (
	"kingcom_server/internal/models"

	"github.com/google/uuid"
)

func OrderModel(orders []models.Order) []MapperOrder {
	var mappedOrders []MapperOrder
	for _, o := range orders {
		mappedOrder := MapperOrder{
			Order: models.Order{
				ID:             o.ID,
				OrderNumber:    o.OrderNumber,
				Status:         o.Status,
				Total:          o.Total,
				PaymentMethod:  o.PaymentMethod,
				BillingAddress: o.BillingAddress,
				CreatedAt:      o.CreatedAt,
				PaidAt:         o.PaidAt,
				ShippedAt:      o.ShippedAt,
				DeliveredAt:    o.DeliveredAt,
			},
		}
		mappedOrder.Shipping = o.Shipping
		for _, item := range o.OrderItems {
			mappedProduct := MapperProduct{
				ID:       item.Product.ID,
				Name:     item.Product.Name,
				Weight:   item.Product.Weight,
				Slug:     item.Product.Slug,
				Price:    item.Product.Price,
				Stock:    item.Product.Stock,
				Discount: item.Product.Discount,
			}
			for _, img := range item.Product.Images {
				mappedProduct.Images = append(mappedProduct.Images, MapperImage{
					ID:  img.ID,
					URL: img.Url,
				})
			}
			mappedOrder.OrderItems = append(mappedOrder.OrderItems, MapperOrderItem{
				ID:       item.ID,
				Quantity: item.Quantity,
				Product:  mappedProduct,
			})
		}
		mappedOrders = append(mappedOrders, mappedOrder)
	}
	return mappedOrders
}

type MapperImage struct {
	ID  uint   `json:"id"`
	URL string `json:"url"`
}

type MapperProduct struct {
	ID       uuid.UUID     `json:"id"`
	Name     string        `json:"name"`
	Weight   float64       `json:"weight"`
	Slug     string        `json:"slug"`
	Price    float64       `json:"price"`
	Stock    uint          `json:"stock"`
	Discount int           `json:"discount"`
	Images   []MapperImage `json:"images"`
}

type MapperOrderItem struct {
	ID       uint          `json:"id"`
	Quantity int           `json:"quantity"`
	Product  MapperProduct `json:"product"`
}

type MapperOrder struct {
	models.Order
	Shipping   models.Shipping   `json:"shipping"`
	OrderItems []MapperOrderItem `json:"orderItems"`
}
