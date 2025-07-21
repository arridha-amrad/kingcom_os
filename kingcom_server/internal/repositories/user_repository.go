package repositories

import (
	"kingcom_server/internal/models"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type GetOneParams struct {
	Username *string
	Email    *string
	Id       *uuid.UUID
}

type CreateOneParams struct {
	Name       string
	Username   string
	Email      string
	Password   string
	JWTVersion string
	Provider   models.Provider
}

type IUserRepository interface {
	GetAll(tx *gorm.DB) ([]models.User, error)
	CreateOne(tx *gorm.DB, params CreateOneParams) (*models.User, error)
	UpdateOne(tx *gorm.DB, userId uuid.UUID, data UpdateParams) (*models.User, error)
	GetOne(tx *gorm.DB, params GetOneParams) (*models.User, error)
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) IUserRepository {
	return &userRepository{db: db}
}

func (s *userRepository) GetOne(tx *gorm.DB, params GetOneParams) (*models.User, error) {
	if tx == nil {
		tx = s.db
	}
	var user models.User
	whereClause := models.User{}
	if params.Id != nil {
		whereClause.ID = *params.Id
	}
	if params.Email != nil {
		whereClause.Email = *params.Email
	}
	if params.Username != nil {
		whereClause.Username = *params.Username
	}
	if err := tx.Where(&whereClause).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *userRepository) GetAll(tx *gorm.DB) ([]models.User, error) {
	if tx == nil {
		tx = s.db
	}
	var users []models.User
	if err := tx.Find(&users).Error; err != nil {
		return nil, err
	}
	return users, nil
}

func (s *userRepository) CreateOne(tx *gorm.DB, params CreateOneParams) (*models.User, error) {
	user := models.User{
		Name:       params.Name,
		Username:   params.Username,
		Email:      params.Email,
		Password:   params.Password,
		JwtVersion: params.JWTVersion,
		Role:       models.RoleUser,
		Provider:   params.Provider,
	}
	if err := tx.Create(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (s *userRepository) UpdateOne(tx *gorm.DB, userId uuid.UUID, data UpdateParams) (*models.User, error) {
	var user models.User
	if err := tx.Where(&models.User{ID: userId}).First(&user).Error; err != nil {
		return nil, err
	}
	if err := tx.Model(&user).Updates(data).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

type UpdateParams struct {
	Username   string
	Name       string
	Email      string
	Password   string
	Provider   string
	Role       models.Role
	JwtVersion string
	IsVerified bool
}
