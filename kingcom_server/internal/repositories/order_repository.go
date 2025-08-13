package repositories

import (
	"kingcom_server/internal/dto"
	"kingcom_server/internal/mapper"
	"kingcom_server/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type orderRepository struct {
	db *gorm.DB
}

type IOrderRepository interface {
	CreateOrderShipping(
		tx *gorm.DB,
		params dto.CreateOrderRequestShipping,
	) (*models.Shipping, error)
	CreateOrder(
		tx *gorm.DB,
		params dto.CreateOrderParams,
	) (*models.Order, error)
	CreateOrderItems(tx *gorm.DB,
		orderId uuid.UUID,
		items []dto.CreateOrderItemParams,
	) error
	GetOrders(
		userId uuid.UUID,
	) ([]mapper.MapperOrder, error)
	GetOrderById(
		orderId uuid.UUID,
	) (*models.Order, error)
}

func NewOrderRepository(
	db *gorm.DB,
) IOrderRepository {
	return &orderRepository{
		db: db,
	}
}

func (r *orderRepository) GetOrderById(
	orderId uuid.UUID,
) (*models.Order, error) {
	var order models.Order
	if err := r.db.Where("id = ?", orderId).
		Preload("OrderItems").
		Preload("OrderItems.Product").
		Preload("Shipping").
		First(&order).Error; err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *orderRepository) GetOrders(
	userId uuid.UUID,
) ([]mapper.MapperOrder, error) {
	var orders []models.Order
	if err := r.db.
		Where("user_id = ?", userId).
		Preload("OrderItems").
		Preload("OrderItems.Product", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "name", "weight", "slug", "price", "stock")
		}).
		Preload("OrderItems.Product.Images", func(db *gorm.DB) *gorm.DB {
			return db.Select("id", "product_id", "url")
		}).
		Preload("Shipping").
		Find(&orders).Error; err != nil {
		return nil, err
	}
	mappedOrders := mapper.OrderModel(orders)
	return mappedOrders, nil
}

func (r *orderRepository) CreateOrder(
	tx *gorm.DB,
	params dto.CreateOrderParams,
) (*models.Order, error) {
	newOrder := models.Order{
		UserID:     params.UserID,
		Total:      params.Total,
		ShippingID: params.ShippingID,
	}
	if err := tx.Create(&newOrder).Error; err != nil {
		return nil, err
	}
	return &newOrder, nil
}

func (r *orderRepository) CreateOrderItems(
	tx *gorm.DB,
	orderId uuid.UUID,
	items []dto.CreateOrderItemParams,
) error {
	var orderItems []models.OrderItem
	for _, item := range items {
		orderItem := models.OrderItem{
			OrderID:   orderId,
			ProductID: item.ProductID,
			Quantity:  item.Quantity,
		}
		orderItems = append(orderItems, orderItem)
	}
	if err := tx.Create(&orderItems).Error; err != nil {
		return err
	}
	return nil
}

func (r *orderRepository) CreateOrderShipping(
	tx *gorm.DB,
	params dto.CreateOrderRequestShipping,
) (*models.Shipping, error) {
	var newData = models.Shipping{
		Name:        params.Name,
		Code:        params.Code,
		Service:     params.Service,
		Description: params.Description,
		Cost:        params.Cost,
		Etd:         params.Etd,
		Address:     params.Address,
	}
	if err := tx.Create(&newData).Error; err != nil {
		return nil, err
	}
	return &newData, nil
}
