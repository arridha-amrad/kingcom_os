package services

import (
	"context"
	"errors"
	"kingcom_server/internal/repositories"
	"kingcom_server/internal/transaction"
	"kingcom_server/internal/utils"
	"strings"

	"gorm.io/gorm"
)

type productService struct {
	productImgRepo repositories.IProductImageRepository
	productRepo    repositories.IProductRepository
	txManager      transaction.ITransactionManager
	utils          utils.IUtils
}

type IProductService interface {
	StoreNewProduct(ctx context.Context, params StoreNewProductParams) error
	FetchProducts(ctx context.Context) (*[]repositories.ProductWithAvgRating, error)
	FetchProductBySlug(ctx context.Context, slug string) (*repositories.ProductWithAvgRating, error)
}

func NewProductService(
	prodImgRepo repositories.IProductImageRepository,
	prodRepo repositories.IProductRepository,
	txManager transaction.ITransactionManager,
	utils utils.IUtils,
) IProductService {
	return &productService{
		productRepo:    prodRepo,
		productImgRepo: prodImgRepo,
		txManager:      txManager,
		utils:          utils,
	}
}

func (s *productService) FetchProductBySlug(ctx context.Context, slug string) (*repositories.ProductWithAvgRating, error) {
	product, err := s.productRepo.GetOneBySlug(slug)
	if err != nil {
		return nil, err
	}
	return product, nil

}

func (s *productService) FetchProducts(ctx context.Context) (*[]repositories.ProductWithAvgRating, error) {
	products, err := s.productRepo.GetMany()
	if err != nil {
		return nil, err
	}
	return products, nil
}

func (s *productService) StoreNewProduct(ctx context.Context, params StoreNewProductParams) error {
	slug := s.utils.ToSlug(params.Name)
	existedProduct, err := s.productRepo.GetOne(repositories.GetOneProductParams{
		Slug: &slug,
	})
	if err != nil {
		if !strings.Contains(err.Error(), "not found") {
			return err
		}
	}
	if existedProduct != nil {
		return errors.New("product is exist")
	}
	err = s.txManager.Do(ctx, func(tx *gorm.DB) error {
		new_product, err := s.productRepo.Save(tx, repositories.CreateOneProductParams{
			Name:          params.Name,
			Slug:          slug,
			Price:         params.Price,
			Description:   params.Description,
			Specification: params.Specification,
			Stock:         params.Stock,
			VideoUrl:      params.VideoUrl,
		})
		if err != nil {
			return err
		}
		_, err = s.productImgRepo.SaveMany(tx, new_product.ID, params.Images)
		if err != nil {
			return err
		}
		return nil
	})
	return err
}

type StoreNewProductParams struct {
	Name          string
	Price         float64
	Description   string
	Specification string
	Stock         uint
	VideoUrl      string
	Weight        float64
	Images        []string
}
