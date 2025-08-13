package services

import (
	"context"
	"kingcom_server/internal/models"
	"kingcom_server/internal/repositories"
	"strings"

	"github.com/google/uuid"
)

type IUserService interface {
	GetUserById(ctx context.Context, userId uuid.UUID) (*models.User, error)
	GetAllUsers(ctx context.Context) ([]models.User, error)
	GetUserByUsername(ctx context.Context, username string) (*models.User, error)
	GetUserByEmail(ctx context.Context, email string) (*models.User, error)
	GetUserByIdentity(ctx context.Context, identity string) (*models.User, error)
}

type userService struct {
	userRepo repositories.IUserRepository
}

func NewUserService(userRepo repositories.IUserRepository) IUserService {
	return &userService{userRepo: userRepo}
}

func (s *userService) GetUserById(ctx context.Context, userId uuid.UUID) (*models.User, error) {
	user, err := s.userRepo.GetOne(repositories.GetOneParams{Id: &userId})
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *userService) GetUserByIdentity(ctx context.Context, identity string) (*models.User, error) {
	if strings.Contains(identity, "@") {
		return s.GetUserByEmail(ctx, identity)
	} else {
		return s.GetUserByUsername(ctx, identity)
	}
}

func (s *userService) GetUserByEmail(ctx context.Context, email string) (*models.User, error) {
	user, err := s.userRepo.GetOne(repositories.GetOneParams{
		Email: &email,
	})
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *userService) GetUserByUsername(ctx context.Context, username string) (*models.User, error) {
	user, err := s.userRepo.GetOne(repositories.GetOneParams{Username: &username})
	if err != nil {
		return nil, err
	}
	return user, nil
}

func (s *userService) GetAllUsers(ctx context.Context) ([]models.User, error) {
	return s.userRepo.GetAll()
}
