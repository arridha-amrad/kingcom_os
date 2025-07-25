package models

import (
	"strconv"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrderStatus string

const (
	OrderStatusPending    OrderStatus = "pending"
	OrderStatusProcessing OrderStatus = "processing"
	OrderStatusShipped    OrderStatus = "shipped"
	OrderStatusDelivered  OrderStatus = "delivered"
	OrderStatusCancelled  OrderStatus = "cancelled"
	OrderStatusRefunded   OrderStatus = "refunded"
)

type Order struct {
	gorm.Model
	UserID            uuid.UUID   `gorm:"not null" json:"user_id"`
	OrderNumber       string      `gorm:"unique;not null" json:"order_number"`
	Status            OrderStatus `gorm:"type:varchar(20);default:'pending'" json:"status"`
	Subtotal          float64     `gorm:"type:decimal(10,2);not null" json:"subtotal"`
	Tax               float64     `gorm:"type:decimal(10,2);not null;default:0" json:"tax"`
	ShippingCost      float64     `gorm:"type:decimal(10,2);not null" json:"shipping_cost"`
	Total             float64     `gorm:"type:decimal(10,2);not null" json:"total"`
	PaymentMethod     string      `gorm:"type:varchar(50)" json:"payment_method"`
	PaymentStatus     string      `gorm:"type:varchar(50);default:'unpaid'" json:"payment_status"`
	ShippingAddress   string      `gorm:"type:text;not null" json:"shipping_address"`
	BillingAddress    string      `gorm:"type:text" json:"billing_address"`
	TrackingNumber    string      `gorm:"type:varchar(100)" json:"tracking_number"`
	EstimatedDelivery *time.Time  `json:"estimated_delivery"`
	DeliveredAt       *time.Time  `json:"delivered_at"`

	// Relationships
	User       User        `gorm:"foreignKey:UserID" json:"-"`
	OrderItems []OrderItem `gorm:"foreignKey:OrderID" json:"order_items"`
}

type OrderItem struct {
	gorm.Model
	OrderID    uint      `gorm:"not null" json:"order_id"`
	ProductID  uuid.UUID `gorm:"not null" json:"product_id"`
	Quantity   int       `gorm:"not null" json:"quantity"`
	Price      float64   `gorm:"type:decimal(10,2);not null" json:"price"`
	Discount   int       `gorm:"default:0" json:"discount"`
	TotalPrice float64   `gorm:"type:decimal(10,2);not null" json:"total_price"`

	// Relationships
	Product Product `gorm:"foreignKey:ProductID" json:"product"`
}

func (o *Order) BeforeCreate(tx *gorm.DB) (err error) {
	o.OrderNumber = "ORD-" + time.Now().Format("20060102") + "-" + strconv.FormatInt(time.Now().UnixNano()%10000, 10)
	return
}
