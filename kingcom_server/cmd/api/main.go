package main

import (
	"kingcom_server/internal/config"
	"kingcom_server/internal/container"
	"kingcom_server/internal/models"
	"kingcom_server/internal/routes"
	"kingcom_server/internal/validation"
	"kingcom_server/pkg/database"
	"log"
)

func main() {
	cfg, err := config.LoadEnv()
	if err != nil {
		log.Fatalf("Could not load config: %v", err)
	}

	rdb := database.ConnectRedis(cfg.RDB.REDIS_URL)
	if err != nil {
		log.Panic(err)
	}

	db, err := database.Connect(database.DbConnectionOptions{
		Host:         cfg.DB.Host,
		User:         cfg.DB.User,
		Password:     cfg.DB.Password,
		DbName:       cfg.DB.DbName,
		Port:         cfg.DB.Port,
		MaxIdleTime:  cfg.DB.MaxIdleTime,
		MaxOpenConns: cfg.DB.MaxOpenConns,
		MaxIdleConns: cfg.DB.MaxIdleConns,
	})
	if err != nil {
		log.Panic(err)
	}

	db.AutoMigrate(
		&models.User{},
		&models.Product{},
		&models.ProductImage{},
		&models.ProductReview{},
	)

	sqlDB, err := db.DB()
	if err != nil {
		log.Fatal("failed to get sql.DB:", err)
	}

	defer sqlDB.Close()
	defer rdb.Close()

	validate := validation.Init()

	con := container.NewContainer(db, rdb, validate, cfg)

	router := routes.RegisterRoutes(con)

	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Could not start server: %v", err)
	}
}
