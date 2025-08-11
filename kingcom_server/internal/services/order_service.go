package services

import (
	"context"
	"fmt"
	"kingcom_server/internal/dto"
	"kingcom_server/internal/models"
	"kingcom_server/internal/repositories"
	"kingcom_server/internal/transaction"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type orderService struct {
	orderRepository   repositories.IOrderRepository
	cartRepository    repositories.ICartRepository
	productRepository repositories.IProductRepository
	txManager         transaction.ITransactionManager
}

type IOrderService interface {
	PlaceOrder(
		ctx context.Context,
		userId uuid.UUID,
		total int64,
		shipping dto.CreateOrderRequestShipping,
		items []dto.CreateOrderRequestItem,
	) error
	GetOrders(
		userId uuid.UUID,
	) (*[]models.Order, error)
}

func NewOrderService(
	orderRepository repositories.IOrderRepository,
	cartRepository repositories.ICartRepository,
	productRepository repositories.IProductRepository,
	txManager transaction.ITransactionManager,
) IOrderService {
	return &orderService{
		orderRepository:   orderRepository,
		cartRepository:    cartRepository,
		productRepository: productRepository,
		txManager:         txManager,
	}
}

// TODO
// Buat data order baru
// Buat data shipping baru
// Update produk kurangi stock dengan quantity
// Buat data order_items baru
// Hapus carts
func (s *orderService) PlaceOrder(
	ctx context.Context,
	userId uuid.UUID,
	total int64,
	shipping dto.CreateOrderRequestShipping,
	items []dto.CreateOrderRequestItem,
) error {
	err := s.txManager.Do(ctx, func(tx *gorm.DB) error {
		order, err := s.orderRepository.CreateOrder(
			tx,
			dto.CreateOrderParams{
				UserID: userId,
				Total:  total,
			})
		if err != nil {
			return err
		}
		if _, err := s.orderRepository.CreateOrderShipping(tx, shipping, order.ID); err != nil {
			return err
		}
		// Preallocate slices
		orderItems := make([]dto.CreateOrderItemParams, 0, len(items))
		cartsToDeleteIds := make([]uuid.UUID, 0, len(items))
		productIDs := make([]uuid.UUID, 0, len(items))
		qtyMap := make(map[uuid.UUID]uint)
		for _, item := range items {
			orderItems = append(orderItems, dto.CreateOrderItemParams{
				ProductID: item.ProductID,
				Quantity:  item.Quantity,
				OrderID:   order.ID,
			})
			cartsToDeleteIds = append(cartsToDeleteIds, item.CartID)
			productIDs = append(productIDs, item.ProductID)
			qtyMap[item.ProductID] = uint(item.Quantity)
		}
		products, err := s.productRepository.GetProductsForUpdate(tx, productIDs)
		if err != nil {
			return err
		}
		for _, p := range products {
			if p.Stock < qtyMap[p.ID] {
				return fmt.Errorf("not enough stock for product %s", p.ID)
			}
			if err := s.productRepository.UpdateStock(
				tx,
				p.ID,
				p.Stock-qtyMap[p.ID],
			); err != nil {
				return err
			}
		}
		if err := s.orderRepository.CreateOrderItems(tx, order.ID, orderItems); err != nil {
			return err
		}
		if err := s.cartRepository.RemoveManyCarts(tx, cartsToDeleteIds); err != nil {
			return err
		}
		return nil
	})
	return err
}

func (s *orderService) GetOrders(
	userId uuid.UUID,
) (*[]models.Order, error) {
	orders, err := s.orderRepository.GetOrders(userId)
	if err != nil {
		return nil, err
	}
	return orders, nil
}
