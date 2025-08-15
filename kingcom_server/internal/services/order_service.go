package services

import (
	"context"
	"fmt"
	"kingcom_server/internal/config"
	"kingcom_server/internal/dto"
	"kingcom_server/internal/mapper"
	"kingcom_server/internal/models"
	"kingcom_server/internal/repositories"
	"kingcom_server/internal/transaction"
	"time"

	"github.com/google/uuid"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
	"gorm.io/gorm"
)

type orderService struct {
	orderRepository   repositories.IOrderRepository
	cartRepository    repositories.ICartRepository
	productRepository repositories.IProductRepository
	txManager         transaction.ITransactionManager
	midtransConfig    config.MidtransConfig
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
	) ([]mapper.MapperOrder, error)
	GetMidtransTransactionToken(
		orderId uuid.UUID,
	) (string, error)
	GetOrderById(
		orderId uuid.UUID,
	) (*models.Order, error)
}

func NewOrderService(
	orderRepository repositories.IOrderRepository,
	cartRepository repositories.ICartRepository,
	productRepository repositories.IProductRepository,
	txManager transaction.ITransactionManager,
	midtransConfig config.MidtransConfig,
) IOrderService {
	return &orderService{
		orderRepository:   orderRepository,
		cartRepository:    cartRepository,
		productRepository: productRepository,
		txManager:         txManager,
		midtransConfig:    midtransConfig,
	}
}

func (s *orderService) GetOrderById(
	orderId uuid.UUID,
) (*models.Order, error) {
	return s.orderRepository.GetOrderById(orderId)
}

// func (s *orderService) GetMidtransTransactionToken(orderId uuid.UUID) (string, error) {
// 	order, err := s.orderRepository.GetOrderById(orderId)
// 	if err != nil {
// 		return "", err
// 	}
// 	var sn snap.Client
// 	sn.New(s.midtransConfig.ServerKey, midtrans.Sandbox)
// 	items := make([]midtrans.ItemDetails, 0, len(order.OrderItems))
// 	for _, i := range order.OrderItems {
// 		items = append(items, midtrans.ItemDetails{
// 			ID:    i.Product.ID.String(),
// 			Name:  i.Product.Name,
// 			Price: int64(i.Product.Price),
// 			Qty:   int32(i.Quantity),
// 		})
// 	}

// 	snapReq := &snap.Request{
// 		TransactionDetails: midtrans.TransactionDetails{
// 			OrderID:  order.ID.String(),
// 			GrossAmt: int64(order.Total),
// 		},
// 		Items: &items,
// 		CustomerDetail: &midtrans.CustomerDetails{
// 			FName: order.User.Name,
// 			Email: order.User.Email,
// 		},
// 				Callbacks: &snap.Callbacks{
// 					Finish: "http://localhost:3000/transactions",
// 				},
// 	}
// 	snapResp, midErr := sn.CreateTransaction(snapReq)
// 	if midErr != nil {
// 		// Pastikan midErr nil saat sukses
// 		if midErr.Error() != "" {
// 			return "", midErr
// 		}
// 		return "", fmt.Errorf("failed to create transaction token")
// 	}

// 	if snapResp == nil || snapResp.Token == "" {
// 		return "", fmt.Errorf("empty transaction token from Midtrans")
// 	}

// 	return snapResp.Token, nil
// }

func (s *orderService) GetMidtransTransactionToken(
	orderId uuid.UUID,
) (string, error) {
	order, err := s.orderRepository.GetOrderById(orderId)
	if err != nil {
		return "", err
	}
	items := make([]midtrans.ItemDetails, 0, len(order.OrderItems))
	for _, i := range order.OrderItems {
		items = append(items, midtrans.ItemDetails{
			Name:  i.Product.Name,
			Price: int64(i.Product.Price - i.Product.Price*float64(i.Product.Discount)/100),
			Qty:   int32(i.Quantity),
		})
	}
	items = append(items, midtrans.ItemDetails{
		Name:  fmt.Sprintf("Shipping-%s", order.Shipping.Name),
		Price: int64(order.Shipping.Cost),
		Qty:   1,
	})
	var sn snap.Client
	sn.New(s.midtransConfig.ServerKey, midtrans.Sandbox)
	req := &snap.Request{
		Items: &items,
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  fmt.Sprintf("%s-%d", order.ID, time.Now().Unix()),
			GrossAmt: order.Total,
		},
		CreditCard: &snap.CreditCardDetails{
			Secure: true,
		},
		CustomerDetail: &midtrans.CustomerDetails{
			FName: order.User.Name,
			Email: order.User.Email,
			ShipAddr: &midtrans.CustomerAddress{
				Address: order.Shipping.Address,
			},
		},
		Callbacks: &snap.Callbacks{
			Finish: "http://localhost:3000/transactions",
		},
	}
	token, _ := sn.CreateTransactionToken(req)
	// if err != nil {
	// 	// Pastikan midErr nil saat sukses
	// 	if err.Error() != "" {
	// 		return "", err
	// 	}
	// 	return "", fmt.Errorf("failed to create transaction token")
	// }

	// if token == "" {
	// 	return "", fmt.Errorf("empty transaction token from Midtrans")
	// }
	return token, nil
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
		newShipping, err := s.orderRepository.CreateOrderShipping(tx, shipping)
		if err != nil {
			return err
		}
		newOrder, err := s.orderRepository.CreateOrder(
			tx,
			dto.CreateOrderParams{
				UserID:     userId,
				Total:      total,
				ShippingID: newShipping.ID,
			})
		if err != nil {
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
				OrderID:   newOrder.ID,
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
		if err := s.orderRepository.CreateOrderItems(tx, newOrder.ID, orderItems); err != nil {
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
) ([]mapper.MapperOrder, error) {
	orders, err := s.orderRepository.GetOrders(userId)
	if err != nil {
		return nil, err
	}
	return orders, nil
}
