package repositories

import (
	"kingcom_server/internal/dto"
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
		orderId uuid.UUID,
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
	) (*[]models.Order, error)
}

func NewOrderRepository(
	db *gorm.DB,
) IOrderRepository {
	return &orderRepository{
		db: db,
	}
}

func (r *orderRepository) GetOrders(
	userId uuid.UUID,
) (*[]models.Order, error) {
	var orders []models.Order
	if err := r.db.
		Where("user_id = ?", userId).
		Preload("User").
		Preload("OrderItems").
		Preload("OrderItems.Product").
		Preload("Shipping").
		Find(&orders).Error; err != nil {
		return nil, err
	}
	return &orders, nil
}

// func (r *orderRepository) GetOrders() (*[]dto.GetOrders, error) {
// 	var flatOrders []dto.OrderWithItemFlat
// 	err := r.db.
// 		Table("orders").
// 		Select(`
// 		orders.*,
// 		oi.id AS order_item_id,
// 		oi.quantity AS order_item_quantity,
// 		p.id AS product_id,
// 		p.name AS product_name,
// 		p.slug AS product_slug,
// 		p.price AS product_price,
// 		(
// 			SELECT url
// 			FROM product_images
// 			WHERE product_images.product_id = p.id
// 			LIMIT 1
// 		) AS product_image,
// 		p.weight AS product_weight,
// 		p.discount AS product_discount
// 	`).
// 		Joins("LEFT JOIN order_items AS oi ON oi.order_id = orders.id").
// 		Joins("LEFT JOIN products AS p ON p.id = oi.product_id").
// 		Scan(&flatOrders).Error
// 	if err != nil {
// 		return nil, err
// 	}

// 	var result []dto.GetOrders
// 	for _, flat := range flatOrders {
// 		order := dto.GetOrders{
// 			ID:             flat.ID,
// 			UserID:         flat.UserID,
// 			Total:          flat.Total,
// 			OrderNumber:    flat.OrderNumber,
// 			Status:         flat.Status,
// 			PaymentMethod:  flat.PaymentMethod,
// 			BillingAddress: flat.BillingAddress,
// 			CreatedAt:      flat.CreatedAt,
// 			PaidAt:         flat.PaidAt,
// 			ShippedAt:      flat.ShippedAt,
// 			DeliveredAt:    flat.DeliveredAt,
// 			Items: []dto.ItemProduct{
// 				{
// 					ID:          flat.OrderItemID,
// 					ProductID:   flat.ProductID,
// 					ProductName: flat.ProductName,
// 					ProductSlug: flat.ProductSlug,
// 					Quantity:    flat.OrderItemQuantity,
// 					Price:       flat.ProductPrice,
// 					ImageUrl:    flat.ProductImage,
// 					Weight:      flat.ProductWeight,
// 					Discount:    flat.ProductDiscount,
// 				},
// 			},
// 			Shipping: dto.Shipping{
// 				ID:          flat.ShippingID,
// 				Name:        flat.ShippingName,
// 				Code:        flat.ShippingCode,
// 				Service:     flat.ShippingService,
// 				Description: flat.ShippingDescription,
// 				Cost:        flat.ShippingCost,
// 				Etd:         flat.ShippingEtd,
// 				Address:     flat.ShippingAddress,
// 			},
// 		}
// 		result = append(result, order)
// 	}

// }

func (r *orderRepository) CreateOrder(
	tx *gorm.DB,
	params dto.CreateOrderParams,
) (*models.Order, error) {
	newOrder := models.Order{
		UserID: params.UserID,
		Total:  params.Total,
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
	orderId uuid.UUID,
) (*models.Shipping, error) {
	var newData = models.Shipping{
		Name:        params.Name,
		Code:        params.Code,
		Service:     params.Service,
		Description: params.Description,
		Cost:        params.Cost,
		Etd:         params.Etd,
		Address:     params.Address,
		OrderID:     orderId,
	}
	if err := tx.Create(&newData).Error; err != nil {
		return nil, err
	}
	return &newData, nil
}
