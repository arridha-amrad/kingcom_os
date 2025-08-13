package dto

import (
	"kingcom_server/internal/models"
	"time"

	"github.com/google/uuid"
)

type CreateOrderItemParams struct {
	ProductID uuid.UUID
	OrderID   uuid.UUID
	Quantity  int
}

type CreateOrderParams struct {
	UserID     uuid.UUID
	Total      int64
	ShippingID uint
}

type GetOrders struct {
	ID             uuid.UUID          `json:"id"`
	OrderNumber    string             `json:"orderNumber"`
	Status         models.OrderStatus `json:"status"`
	UserID         uuid.UUID          `json:"userId"`
	Total          int64              `json:"total"`
	PaymentMethod  string             `json:"paymentMethod"`
	BillingAddress string             `json:"billingAddress"`
	CreatedAt      time.Time          `json:"createdAt"`
	PaidAt         time.Time          `json:"paidAt"`
	ShippedAt      time.Time          `json:"shippedAt"`
	DeliveredAt    time.Time          `json:"deliveredAt"`

	Items    []Item          `json:"items"`
	Shipping models.Shipping `json:"shipping"`
}

type Item struct {
	ID       uint        `json:"id"`
	Quantity int         `json:"quantity"`
	Product  ItemProduct `json:"product"`
}

type ItemProduct struct {
	ID       uuid.UUID `json:"id"`
	Name     string    `json:"name"`
	Slug     string    `json:"slug"`
	Price    float64   `json:"price"`
	Image    string    `json:"image"`
	Weight   float64   `json:"weight"`
	Discount int       `json:"discount"`
}

type OrderWithItemFlat struct {
	models.Order
	OrderItemID       uint      `json:"order_item_id"`
	OrderItemQuantity int       `json:"order_item_quantity"`
	ProductID         uuid.UUID `json:"product_id"`
	ProductName       string    `json:"product_name"`
	ProductSlug       string    `json:"product_slug"`
	ProductPrice      float64   `json:"product_price"`
	ProductImage      string    `json:"product_image"`
	ProductWeight     float64   `json:"product_weight"`
	ProductDiscount   int       `json:"product_discount"`
}

// Used in API Request
type CreateOrderRequest struct {
	Total    int64                      `json:"total"`
	Items    []CreateOrderRequestItem   `json:"items"`
	Shipping CreateOrderRequestShipping `json:"shipping"`
}

type CreateOrderRequestShipping struct {
	Name        string  `json:"name"`
	Code        string  `json:"code"`
	Service     string  `json:"service"`
	Description string  `json:"description"`
	Cost        float64 `json:"cost"`
	Etd         string  `json:"etd"`
	Address     string  `json:"address"`
}

type CreateOrderRequestItem struct {
	CartID    uuid.UUID `json:"cartId"`
	ProductID uuid.UUID `json:"productId"`
	Quantity  int       `json:"quantity"`
}

type CheckoutRequest struct {
	OrderId uuid.UUID `json:"orderId"`
}
