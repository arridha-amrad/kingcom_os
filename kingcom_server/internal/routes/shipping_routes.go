package routes

import (
	"encoding/json"
	"fmt"
	"io"
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

type ShippingRoutesParams struct {
	*RoutesParams
	RajaOngkirApiKey string
	Utils            utils.IUtils
}

func SetShippingRoutes(params ShippingRoutesParams) {
	r := params.Route.Group("/shipping")
	{
		r.GET("/get-provinces", func(ctx *gin.Context) { GetProvinces(ctx, params.Utils, params.RajaOngkirApiKey) })
		r.GET("/get-cities/:provinceID", func(ctx *gin.Context) { GetCities(ctx, params.Utils, params.RajaOngkirApiKey) })
		r.GET("/get-districts/:cityID", func(ctx *gin.Context) { GetDistricts(ctx, params.Utils, params.RajaOngkirApiKey) })
		r.POST("/calc-cost", func(ctx *gin.Context) { CalcCost(ctx, params.Utils, params.RajaOngkirApiKey) })
	}
}

type Params struct {
	OriginID      int `json:"originId"`
	DestinationID int `json:"destinationId"`
	Weight        int `json:"weight"`
}

func CalcCost(c *gin.Context, utils utils.IUtils, key string) {

	var input Params
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.RespondWithError(c, http.StatusBadRequest, err, "Invalid input")
		return
	}

	form := url.Values{}
	form.Set("origin", strconv.Itoa(input.OriginID))
	form.Set("destination", strconv.Itoa(input.DestinationID))
	form.Set("weight", strconv.Itoa(input.Weight))
	form.Set("courier", courier)
	form.Set("price", price)

	req, err := http.NewRequest("POST", calcCostUrl, strings.NewReader(form.Encode()))
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err, "failed to create request")
		return
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("key", key)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err, "failed to send request")
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err, "failed to read response body")
		return
	}

	var response CostResponse
	if err := json.Unmarshal(body, &response); err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err, "failed to unmarshal json")
		return
	}

	c.JSON(http.StatusOK, response)
}

func GetDistricts(c *gin.Context, utils utils.IUtils, key string) {
	cityId := c.Param("cityID")
	url := fmt.Sprintf("%s/district/%s", destinationUrl, cityId)
	body, err := runRequest(url, key)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err, "Failed to fetch districts")
		return
	}
	var response CityDistrictResponse
	if err := json.Unmarshal(body, &response); err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err, "failed to unmarshal json")
		return
	}
	c.JSON(http.StatusOK, response)
}

func GetCities(c *gin.Context, utils utils.IUtils, key string) {
	provinceId := c.Param("provinceID")
	url := fmt.Sprintf("%s/city/%s", destinationUrl, provinceId)
	body, err := runRequest(url, key)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err, "Failed to fetch cities")
		return
	}
	var response CityDistrictResponse
	if err := json.Unmarshal(body, &response); err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err, "failed to unmarshal json")
		return
	}
	for _, city := range response.Data {
		fmt.Printf("ID: %d, Name: %s, ZipCode: %s\n", city.ID, city.Name, city.ZipCode)
	}
	c.JSON(http.StatusOK, response)
}

func GetProvinces(c *gin.Context, utils utils.IUtils, key string) {
	url := fmt.Sprintf("%s/province", destinationUrl)
	body, err := runRequest(url, key)
	if err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err, "Failed to fetch provinces")
		return
	}
	var response ProvinceResponse
	if err := json.Unmarshal(body, &response); err != nil {
		utils.RespondWithError(c, http.StatusInternalServerError, err, "failed to unmarshal json")
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

type MetaResponse struct {
	Meta struct {
		Message string `json:"message"`
		Code    int    `json:"code"`
		Status  string `json:"status"`
	} `json:"meta"`
}

type CityDistrictResponse struct {
	MetaResponse
	Data []struct {
		ID      int    `json:"id"`
		Name    string `json:"name"`
		ZipCode string `json:"zip_code"`
	} `json:"data"`
}

type ProvinceResponse struct {
	MetaResponse
	Data []struct {
		ID   int    `json:"id"`
		Name string `json:"name"`
	} `json:"data"`
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
