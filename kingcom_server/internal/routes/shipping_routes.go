package routes

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"strings"

	"github.com/gin-gonic/gin"
)

const (
	destinationUrl = "https://rajaongkir.komerce.id/api/v1/destination"
	calcCostUrl    = "https://rajaongkir.komerce.id/api/v1/calculate/district/domestic-cost"
)

type ShippingRoutesParams struct {
	*RoutesParams
	RajaOngkirApiKey string
}

func SetShippingRoutes(params ShippingRoutesParams) {
	r := params.Route.Group("/shipping")
	{
		r.GET("/get-provinces", func(ctx *gin.Context) { GetProvinces(ctx, params.RajaOngkirApiKey) })
		r.GET("/get-cities/:provinceID", func(ctx *gin.Context) { GetCities(ctx, params.RajaOngkirApiKey) })
		r.GET("/get-districts/:cityID", func(ctx *gin.Context) { GetDistricts(ctx, params.RajaOngkirApiKey) })
		r.POST("/calc-cost", func(ctx *gin.Context) { CalcCost(ctx, params.RajaOngkirApiKey) })
	}
}

type Params struct {
	OriginID
}

func CalcCost(c *gin.Context, key string) {

	originID := c.ShouldBindJSON()
	destinationID := "7114"
	weight := "1000"
	courier := "jne:sicepat:ide:sap:jnt:ninja:tiki:lion:anteraja:pos:ncs:rex:rpx:sentral:star:wahana:dse"
	price := "lowest"

	// Encode sebagai form
	form := url.Values{}
	form.Set("origin", originID)
	form.Set("destination", destinationID)
	form.Set("weight", weight)
	form.Set("courier", courier)
	form.Set("price", price)

	// Kirim request POST
	req, err := http.NewRequest("POST", calcCostUrl, strings.NewReader(form.Encode()))
	if err != nil {
		log.Println("failed to create request:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.Header.Set("Accept", "application/json")
	req.Header.Set("key", key)

	// Kirim request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println("failed to send request:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer resp.Body.Close()

	// Baca responsenya
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("failed to read response:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	fmt.Println("Raw response:", string(body))

	// Parse JSON ke struct
	var response CostResponse
	if err := json.Unmarshal(body, &response); err != nil {
		log.Println("failed to parse response:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, response)
}

func GetDistricts(c *gin.Context, key string) {
	cityId := c.Param("cityID")
	url := fmt.Sprintf("%s/district/%s", destinationUrl, cityId)
	body, err := runRequest(url, key)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	var response CityDistrictResponse
	if err := json.Unmarshal(body, &response); err != nil {
		log.Println("failed to unmarshal json:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, response)
}

func GetCities(c *gin.Context, key string) {
	provinceId := c.Param("provinceID")
	url := fmt.Sprintf("%s/city/%s", destinationUrl, provinceId)
	body, err := runRequest(url, key)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	var response CityDistrictResponse
	if err := json.Unmarshal(body, &response); err != nil {
		log.Println("failed to unmarshal json:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	for _, city := range response.Data {
		fmt.Printf("ID: %d, Name: %s, ZipCode: %s\n", city.ID, city.Name, city.ZipCode)
	}
	c.JSON(http.StatusOK, response)
}

func GetProvinces(c *gin.Context, key string) {
	url := fmt.Sprintf("%s/province", destinationUrl)

	body, err := runRequest(url, key)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var response ProvinceResponse
	if err := json.Unmarshal(body, &response); err != nil {
		log.Println("failed to unmarshal json:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
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

type CostRequest struct {
	Origin      string `json:"Origin"`      // Ubah jadi huruf besar
	Destination string `json:"Destination"` // Ubah jadi huruf besar
	Weight      int    `json:"Weight"`
	Courier     string `json:"Courier"`
	Price       string `json:"Price"`
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
