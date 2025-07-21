package transaction

import (
	"context"

	"gorm.io/gorm"
)

type ITransactionManager interface {
	Do(ctx context.Context, fn func(tx *gorm.DB) error) error
}

type transactionManager struct {
	db *gorm.DB
}

func NewTransactionManager(db *gorm.DB) ITransactionManager {
	return &transactionManager{db}
}

func (t *transactionManager) Do(ctx context.Context, fn func(tx *gorm.DB) error) (err error) {
	tx := t.db.WithContext(ctx).Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			panic(r)
		} else if err != nil {
			tx.Rollback()
		} else {
			err = tx.Commit().Error
		}
	}()
	err = fn(tx)
	return
}
