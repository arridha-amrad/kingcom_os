package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Role string

const (
	RoleUser  Role = "user"
	RoleAdmin Role = "admin"
)

type Provider string

const (
	ProviderCredentials Provider = "credentials"
)

type User struct {
	ID             uuid.UUID       `gorm:"type:uuid;primaryKey" json:"id"`
	CreatedAt      time.Time       `json:"created_at"`
	UpdatedAt      time.Time       `json:"updated_at"`
	DeletedAt      gorm.DeletedAt  `gorm:"index" json:"deleted_at"`
	Username       string          `json:"username"`
	Name           string          `json:"name"`
	Email          string          `json:"email"`
	Password       string          `json:"-"` // hidden in JSON
	Provider       Provider        `json:"provider"`
	Role           Role            `json:"role"` // we'll restrict values via validation or enum
	JwtVersion     string          `json:"-"`
	IsVerified     bool            `json:"is_verified"`
	ProductReviews []ProductReview `gorm:"foreignKey:UserID"`
}

func (u *User) BeforeCreate(tx *gorm.DB) (err error) {
	if u.ID == uuid.Nil {
		u.ID = uuid.New()
	}
	return
}
