package dto

type CalcCost struct {
	OriginID      int `json:"originId"`
	DestinationID int `json:"destinationId"`
	Weight        int `json:"weight"`
}
