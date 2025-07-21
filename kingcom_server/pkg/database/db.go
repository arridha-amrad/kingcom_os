package database

import (
	"fmt"
	"log"
	"time"

	"github.com/redis/go-redis/v9"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func ConnectRedis(addr, pwd string, db int) *redis.Client {
	rdb := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: pwd,
		DB:       db,
	})
	log.Println("Redis connection pool established")
	return rdb
}

type DbConnectionOptions struct {
	Host         string
	User         string
	Password     string
	DbName       string
	Port         int
	MaxIdleTime  int
	MaxOpenConns int
	MaxIdleConns int
}

func Connect(params DbConnectionOptions) (*gorm.DB, error) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%d sslmode=disable",
		params.Host, params.User, params.Password, params.DbName, params.Port,
	)

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal("failed to connect database:", err)
	}

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("failed to get sql.DB:", err)
	}

	// Set connection pool options
	sqlDB.SetMaxOpenConns(params.MaxOpenConns)
	sqlDB.SetMaxIdleConns(params.MaxIdleConns)
	sqlDB.SetConnMaxIdleTime(time.Duration(params.MaxIdleTime) * time.Minute)

	log.Println("Connected to the database")
	return db, nil
}
