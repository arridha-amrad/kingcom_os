package config

import (
	"kingcom_server/pkg/database"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	DB               database.DbConnectionOptions
	RDB              RedisConfig
	Port             string
	JWtSecretKey     string
	GoogleOAuth2     GoogleOAuth2Config
	AppUri           string
	RajaOngkirApiKey string
}

type RedisConfig struct {
	ADDR      string
	Password  string
	DB        int
	REDIS_URL string
}

type GoogleOAuth2Config struct {
	ProjectId    string
	ClientId     string
	ClientSecret string
	RefreshToken string
}

func LoadEnv() (*Config, error) {
	env := os.Getenv("GO_ENV")
	envFile := ".env.prod"
	if env == "development" {
		envFile = ".env.dev"
	}
	if err := godotenv.Load(envFile); err != nil {
		return nil, err
	}
	vMaxOpenConns, err := strconv.Atoi(os.Getenv("DB_MAX_OPEN_CONNS"))
	if err != nil {
		return nil, err
	}
	vMaxIdleConns, err := strconv.Atoi(os.Getenv("DB_MAX_IDLE_CONNS"))
	if err != nil {
		return nil, err
	}
	vMaxIdleTime, err := strconv.Atoi(os.Getenv("DB_MAX_IDLE_TIME"))
	if err != nil {
		return nil, err
	}
	vPort, err := strconv.Atoi(os.Getenv("DB_PORT"))
	if err != nil {
		return nil, err
	}
	vRedisDb, err := strconv.Atoi(os.Getenv("REDIS_DB"))
	if err != nil {
		return nil, err
	}
	cfg := &Config{
		RajaOngkirApiKey: os.Getenv("RAJA_ONGKIR_API_KEY"),
		DB: database.DbConnectionOptions{
			Host:         os.Getenv("DB_HOST"),
			User:         os.Getenv("DB_USER"),
			Password:     os.Getenv("DB_PASSWORD"),
			DbName:       os.Getenv("DB_NAME"),
			Port:         vPort,
			MaxIdleTime:  vMaxIdleTime,
			MaxOpenConns: vMaxOpenConns,
			MaxIdleConns: vMaxIdleConns,
		},
		RDB: RedisConfig{
			ADDR:      os.Getenv("REDIS_ADDR"),
			Password:  os.Getenv("REDIS_PWD"),
			DB:        vRedisDb,
			REDIS_URL: os.Getenv("REDIS_URL"),
		},
		AppUri:       os.Getenv("APP_URI"),
		Port:         os.Getenv("PORT"),
		JWtSecretKey: os.Getenv("SECRET_KEY"),
		GoogleOAuth2: GoogleOAuth2Config{
			ProjectId:    os.Getenv("GOOGLE_PROJECT_ID"),
			ClientId:     os.Getenv("GOOGLE_CLIENT_ID"),
			ClientSecret: os.Getenv("GOOGLE_CLIENT_SECRET"),
			RefreshToken: os.Getenv("GOOGLE_REFRESH_TOKEN"),
		},
	}
	return cfg, nil
}
