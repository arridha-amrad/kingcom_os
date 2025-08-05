package services

import (
	"context"
	"kingcom_server/internal/dto"
	"kingcom_server/internal/models"
	"kingcom_server/internal/repositories"
	"kingcom_server/internal/transaction"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

type orderService struct {
	orderRepository repositories.IOrderRepository
	txManager       transaction.ITransactionManager
}

type IOrderService interface {
	PlaceOrder(ctx context.Context, userId uuid.UUID, total int64, shipping models.Shipping, items []dto.CreateOrderRequestItem) error
}

func NewOrderService(
	orderRepository repositories.IOrderRepository,
	txManager transaction.ITransactionManager,
) IOrderService {
	return &orderService{
		orderRepository: orderRepository,
		txManager:       txManager,
	}
}

func (s *orderService) PlaceOrder(ctx context.Context, userId uuid.UUID, total int64, shipping models.Shipping, items []dto.CreateOrderRequestItem) error {
	err := s.txManager.Do(ctx, func(tx *gorm.DB) error {
		shipping, err := s.orderRepository.CreateOrderShipping(tx, shipping)
		if err != nil {
			return err
		}
		order, err := s.orderRepository.CreateOrder(tx, dto.CreateOrderParams{
			ShippingID: shipping.ID,
			UserID:     userId,
			Total:      total,
		})
		if err != nil {
			return err
		}
		var orderItems []dto.CreateOrderItemParams
		for _, item := range items {
			orderItems = append(orderItems, dto.CreateOrderItemParams{
				ProductID: item.ProductID,
				Quantity:  item.Quantity,
				OrderID:   order.ID,
			})
		}
		_, err = s.orderRepository.CreateOrderItems(tx, order.ID, orderItems)
		if err != nil {
			return err
		}
		return nil
	})
	return err
}

func (s *orderService) GetTransactions(c *gin.Context) {}
