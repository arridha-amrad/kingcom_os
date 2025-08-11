package models

import (
	"fmt"
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type OrderStatus string

const (
	OrderStatusPending   OrderStatus = "pending"
	OrderStatusPaid      OrderStatus = "paid"
	OrderStatusShipped   OrderStatus = "shipped"
	OrderStatusDelivered OrderStatus = "delivered"
	OrderStatusCanceled  OrderStatus = "canceled"
)

type Order struct {
	// Auto generated fields
	ID          uuid.UUID   `gorm:"column:id;type:uuid;primaryKey" json:"id"`
	OrderNumber string      `gorm:"column:order_number;unique;not null" json:"orderNumber"`
	Status      OrderStatus `gorm:"column:status;type:varchar(20);default:'pending'" json:"status"`

	// filled by user
	UserID     uuid.UUID `gorm:"column:user_id;type:uuid;not null" json:"-"`
	Total      int64     `gorm:"column:total;not null" json:"total"`
	ShippingID uint      `gorm:"column:shipping_id;not null" json:"-"`

	PaymentMethod  string `gorm:"column:payment_method;type:varchar(50)" json:"paymentMethod"`
	BillingAddress string `gorm:"column:billing_address;type:text" json:"billingAddress"`

	// Timestamps for order lifecycle
	CreatedAt   time.Time  `gorm:"column:created_at" json:"createdAt"`
	PaidAt      *time.Time `gorm:"column:paid_at" json:"paidAt"`
	ShippedAt   *time.Time `gorm:"column:shipped_at" json:"shippedAt"`
	DeliveredAt *time.Time `gorm:"column:delivered_at" json:"deliveredAt"`

	// Relationships
	User       User        `gorm:"foreignKey:UserID" json:"-"`
	Shipping   Shipping    `gorm:"foreignKey:ShippingID;constraint:onDelete:CASCADE" json:"shipping"`
	OrderItems []OrderItem `gorm:"foreignKey:OrderID;constraint:onDelete:CASCADE;" json:"orderItems"`
}

type OrderItem struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	CreatedAt time.Time `json:"-"`
	OrderID   uuid.UUID `gorm:"not null;constraint:onDelete:CASCADE;" json:"-"`
	ProductID uuid.UUID `gorm:"not null" json:"-"`
	Quantity  int       `gorm:"not null" json:"quantity"`

	// Relationships
	Product Product `gorm:"foreignKey:ProductID" json:"product"`
	Order   Order   `gorm:"foreignKey:OrderID" json:"-"`
}

type Shipping struct {
	ID          uint    `gorm:"primaryKey" json:"id"`
	Name        string  `json:"name"`
	Code        string  `json:"code"`
	Service     string  `json:"service"`
	Description string  `json:"description"`
	Cost        float64 `json:"cost"`
	Etd         string  `json:"etd"`
	Address     string  `json:"address"`
}

func (u *Order) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	u.OrderNumber = generateOrderNumber()
	return
}

func generateOrderNumber() string {
	timestamp := time.Now().UnixNano()
	randomPart := uuid.New().String()[0:8]
	return fmt.Sprintf("ORD-%d-%s", timestamp, randomPart)
}
