package controllers

import (
	"encoding/json"
	"fmt"
	"io"
	"kingcom_server/internal/constants"
	"kingcom_server/internal/dto"
	"kingcom_server/internal/services"
	"kingcom_server/internal/utils"
	"log"
	"net/http"
	"net/url"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

const (
	destinationUrl = "https://rajaongkir.komerce.id/api/v1/destination"
	calcCostUrl    = "https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost"
	courier        = "jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana:dse"
	price          = "lowest"
)

type IShippingController interface {
	GetProvinces(c *gin.Context)
	GetCities(c *gin.Context)
	GetDistricts(c *gin.Context)
	CalcCost(c *gin.Context)
}

type shippingController struct {
	redisService     services.IRedisService
	rajaOngkirApiKey string
	utils            utils.IUtils
}

func NewShippingController(
	redisService services.IRedisService,
	rajaOngkirApiKey string,
	utils utils.IUtils,
) IShippingController {
	return &shippingController{
		redisService:     redisService,
		rajaOngkirApiKey: rajaOngkirApiKey,
		utils:            utils,
	}
}

func (ctrl *shippingController) GetProvinces(c *gin.Context) {

	data, err := ctrl.redisService.GetProvinces()
	if err != nil && !strings.Contains(err.Error(), "key rajaOngkir:provinces not found: redis: nil") {
		ctrl.utils.RespondWithError(c, http.StatusInternalServerError, err, "Failed to get provinces from Redis")
		return
	}
	if err == nil && len(data.Data) > 0 {
		log.Println("Provinces fetched from Redis")
		c.JSON(http.StatusOK, data)
		return
	}

	url := fmt.Sprintf("%s/province", destinationUrl)
	body, err := runRequest(url, ctrl.rajaOngkirApiKey)
	if err != nil {
		ctrl.utils.RespondWithError(c, http.StatusInternalServerError, err, "Failed to fetch provinces")
		return
	}
	var response services.RajaOngkirResponse
	if err := json.Unmarshal(body, &response); err != nil {
		ctrl.utils.RespondWithError(c, http.StatusInternalServerError, err, "failed to unmarshal json")
		return
	}
	if response.Meta.Code == 200 {
		if err := ctrl.redisService.SaveProvinces(response); err != nil {
			ctrl.utils.RespondWithError(c, http.StatusInternalServerError, err, "Failed to save provinces to Redis")
			return
		}
	}
	c.JSON(http.StatusOK, response)
}

func (ctrl *shippingController) CalcCost(c *gin.Context) {
	value, exist := c.Get(constants.VALIDATED_BODY)
	if !exist {
		c.JSON(http.StatusBadRequest, gin.H{"error": "validated body not exists"})
		return
	}
	body, ok := value.(dto.CalcCost)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "invalid type for validated body"})
		return
	}
	form := url.Values{}
	form.Set("origin", strconv.Itoa(body.OriginID))
	form.Set("destination", strconv.Itoa(body.DestinationID))
	form.Set("weight", strconv.Itoa(body.Weight))
	form.Set("courier", courier)
	form.Set("price", price)

	req, err := http.NewRequest("POST", calcCostUrl, strings.NewReader(form.Encode()))
	if err != nil {
		ctrl.utils.RespondWithError(c, http.StatusInternalServerError, err, "failed to create request")
		return
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("key", ctrl.rajaOngkirApiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		ctrl.utils.RespondWithError(c, http.StatusInternalServerError, err, "failed to send request")
		return
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		ctrl.utils.RespondWithError(c, http.StatusInternalServerError, err, "failed to read response body")
		return
	}

	var response CostResponse
	if err := json.Unmarshal(respBody, &response); err != nil {
		ctrl.utils.RespondWithError(c, http.StatusInternalServerError, err, "failed to unmarshal json")
		return
	}

	c.JSON(http.StatusOK, response)
}

func (ctrl *shippingController) GetDistricts(c *gin.Context) {
	cityId := c.Param("cityID")
	url := fmt.Sprintf("%s/district/%s", destinationUrl, cityId)
	body, err := runRequest(url, ctrl.rajaOngkirApiKey)
	if err != nil {
		ctrl.utils.RespondWithError(c, http.StatusInternalServerError, err, "Failed to fetch districts")
		return
	}
	var response services.RajaOngkirResponse
	if err := json.Unmarshal(body, &response); err != nil {
		ctrl.utils.RespondWithError(c, http.StatusInternalServerError, err, "failed to unmarshal json")
		return
	}
	c.JSON(http.StatusOK, response)
}

func (ctrl *shippingController) GetCities(c *gin.Context) {
	provinceId := c.Param("provinceID")
	url := fmt.Sprintf("%s/city/%s", destinationUrl, provinceId)
	body, err := runRequest(url, ctrl.rajaOngkirApiKey)
	if err != nil {
		ctrl.utils.RespondWithError(c, http.StatusInternalServerError, err, "Failed to fetch cities")
		return
	}
	var response services.RajaOngkirResponse
	if err := json.Unmarshal(body, &response); err != nil {
		ctrl.utils.RespondWithError(c, http.StatusInternalServerError, err, "failed to unmarshal json")
		return
	}
	c.JSON(http.StatusOK, response)
}

func runRequest(url, key string) ([]byte, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Println("failed to construct request")
		return nil, err
	}
	req.Header.Add("accept", "application/json")
	req.Header.Add("Key", key)

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Println("failed to perform request")
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		log.Println("failed to read body")
		return nil, err
	}
	return body, nil
}

type CostResponse struct {
	MetaResponse
	Data []struct {
		Name        string  `json:"name"`
		Code        string  `json:"code"`
		Service     string  `json:"service"`
		Description string  `json:"description"`
		Cost        float64 `json:"cost"`
		Etd         string  `json:"etd"`
	} `json:"data"`
}

type MetaResponse struct {
	Meta struct {
		Message string `json:"message"`
		Code    int    `json:"code"`
		Status  string `json:"status"`
	} `json:"meta"`
}
