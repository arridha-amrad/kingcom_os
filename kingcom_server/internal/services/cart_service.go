package services

import (
	"context"
	"kingcom_server/internal/repositories"
	"kingcom_server/internal/transaction"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type cartService struct {
	cartRepository repositories.ICartRepository
	txManager      transaction.ITransactionManager
}

type ICartService interface {
	Store(ctx context.Context, params StoreParams) error
	GetUserCart(ctx context.Context, userId uuid.UUID) (*[]repositories.CartWithProduct, error)
}

func NewCartService(
	cartRepository repositories.ICartRepository,
	txManager transaction.ITransactionManager,
) ICartService {
	return &cartService{
		cartRepository: cartRepository,
		txManager:      txManager,
	}
}

func (s *cartService) Store(ctx context.Context, params StoreParams) error {
	err := s.txManager.Do(ctx, func(tx *gorm.DB) error {
		if _, err := s.cartRepository.SaveOne(tx, repositories.SaveOneParams{
			ProductID: params.ProductID,
			Quantity:  params.Quantity,
			UserID:    params.UserID,
		}); err != nil {
			return err
		}
		return nil
	})
	return err
}

func (s *cartService) GetUserCart(ctx context.Context, userId uuid.UUID) (*[]repositories.CartWithProduct, error) {
	return s.cartRepository.GetMany(userId)
}

type StoreParams struct {
	Quantity  int
	ProductID uuid.UUID
	UserID    uuid.UUID
}
