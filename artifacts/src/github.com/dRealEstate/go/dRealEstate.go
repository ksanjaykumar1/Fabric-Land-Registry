
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/golang/protobuf/ptypes"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

const index = "owner~name"

// SimpleChaincode implements the fabric-contract-api-go programming model
type SimpleChaincode struct {
	contractapi.Contract
}

type Land struct {
	LandID         string 	`json:"landID"`      //the field tags are needed to keep case from bouncing around
	AreaCode       string 	`json:"areaCode"`
	Length			string 	`json:"length"`
	Breadth			string 	`json:"breadth"`
	TotalArea       string    	`json:"totalArea"`
	Owner          string 	`json:"owner"`
	Price 			string    	`json:"price"`
	Address			string	`json:"address`
	ForSale			string	`json:"forSale"`
}

// HistoryQueryResult structure used for returning result of history query
type HistoryQueryResult struct {
	Record    *Land    `json:"record"`
	TxId     string    `json:"txId"`
	Timestamp time.Time `json:"timestamp"`
	IsDelete  bool      `json:"isDelete"`
}

// PaginatedQueryResult structure used for returning paginated query results and metadata
type PaginatedQueryResult struct {
	Records             []*Land `json:"records"`
	FetchedRecordsCount int32    `json:"fetchedRecordsCount"`
	Bookmark            string   `json:"bookmark"`
}

// Createland initializes a new land in the ledger
func (t *SimpleChaincode) CreateLand(ctx contractapi.TransactionContextInterface, landID, areaCode string, length string,breadth string,totalArea string,owner string, price string, forSale string,address string ) error {
	exists, err := t.LandExists(ctx, landID)
	if err != nil {
		return fmt.Errorf("failed to get land: %v", err)
	}
	if exists {
		return fmt.Errorf("land already exists: %s", landID)
	}
	// var totalArea= length*breadth;

	land := &Land{
		
		LandID:         landID,
		AreaCode:		areaCode,
		Length:			length,
		Breadth: 		breadth,
		TotalArea:		totalArea,
		Owner:          owner,
		Price: 			price,
		Address: 		address,
		ForSale: 		forSale,	
	}
	landBytes, err := json.Marshal(land)
	if err != nil {
		return err
	}

	err = ctx.GetStub().PutState(landID, landBytes)
	if err != nil {
		return err
	}

	//  Create an index to enable owner-based range queries, e.g. return all lands whose owner is mike.
	ownerNameIndexKey, err := ctx.GetStub().CreateCompositeKey(index, []string{land.Owner, land.LandID})
	if err != nil {
		return err
	}
	//  Save index entry to world state. Only the key name is needed, no need to store a duplicate copy of the land.
	//  Note - passing a 'nil' value will effectively delete the key from state, therefore we pass null character as value
	value := []byte{0x00}
	return ctx.GetStub().PutState(ownerNameIndexKey, value)
}

// ReadLand retrieves an land from the ledger
func (t *SimpleChaincode) ReadLand(ctx contractapi.TransactionContextInterface, landID string) (*Land, error) {
	landBytes, err := ctx.GetStub().GetState(landID)
	if err != nil {
		return nil, fmt.Errorf("failed to get land %s: %v", landID, err)
	}
	if landBytes == nil {
		return nil, fmt.Errorf("land %s does not exist", landID)
	}

	var land Land
	err = json.Unmarshal(landBytes, &land)
	if err != nil {
		return nil, err
	}

	return &land, nil
}

// Deleteland removes an land key-value pair from the ledger
func (t *SimpleChaincode) DeleteLand(ctx contractapi.TransactionContextInterface, landID string) error {
	land, err := t.ReadLand(ctx, landID)
	if err != nil {
		return err
	}

	err = ctx.GetStub().DelState(landID)
	if err != nil {
		return fmt.Errorf("failed to delete land %s: %v", landID, err)
	}

	ownerNameIndexKey, err := ctx.GetStub().CreateCompositeKey(index, []string{land.Owner, land.LandID})
	if err != nil {
		return err
	}

	// Delete index entry
	return ctx.GetStub().DelState(ownerNameIndexKey)
}

// Transferland transfers an land by setting a new owner name on the land
func (t *SimpleChaincode) TransferLand(ctx contractapi.TransactionContextInterface, landID, newOwner string) error {
	land, err := t.ReadLand(ctx, landID)
	if err != nil {
		return err
	}

	land.Owner = newOwner
	//land.ForSale="false"
	landBytes, err := json.Marshal(land)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(landID, landBytes)
}

// constructQueryResponseFromIterator constructs a slice of lands from the resultsIterator
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*Land, error) {
	var lands []*Land
	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var land Land
		err = json.Unmarshal(queryResult.Value, &land)
		if err != nil {
			return nil, err
		}
		lands = append(lands, &land)
	}

	return lands, nil
}

// GetlandsByRange performs a range query based on the start and end keys provided.
// Read-only function results are not typically submitted to ordering. If the read-only
// results are submitted to ordering, or if the query is used in an update transaction
// and submitted to ordering, then the committing peers will re-execute to guarantee that
// result sets are stable between endorsement time and commit time. The transaction is
// invalidated by the committing peers if the result set has changed between endorsement
// time and commit time.
// Therefore, range queries are a safe option for performing update transactions based on query results.
func (t *SimpleChaincode) GetLandsByRange(ctx contractapi.TransactionContextInterface, startKey, endKey string) ([]*Land, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange(startKey, endKey)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}

// TransferlandByOwner will transfer lands of a given owner to a certain new owner.
// Uses GetStateByPartialCompositeKey (range query) against owner~name 'index'.
// Committing peers will re-execute range queries to guarantee that result sets are stable
// between endorsement time and commit time. The transaction is invalidated by the
// committing peers if the result set has changed between endorsement time and commit time.
// Therefore, range queries are a safe option for performing update transactions based on query results.
// Example: GetStateByPartialCompositeKey/RangeQuery
func (t *SimpleChaincode) TransferLandByOwner(ctx contractapi.TransactionContextInterface, owner, newOwner string) error {
	// Execute a key range query on all keys starting with 'owner'
	ownerlandResultsIterator, err := ctx.GetStub().GetStateByPartialCompositeKey(index, []string{owner})
	if err != nil {
		return err
	}
	defer ownerlandResultsIterator.Close()

	for ownerlandResultsIterator.HasNext() {
		responseRange, err := ownerlandResultsIterator.Next()
		if err != nil {
			return err
		}

		_, compositeKeyParts, err := ctx.GetStub().SplitCompositeKey(responseRange.Key)
		if err != nil {
			return err
		}

		if len(compositeKeyParts) > 1 {
			returnedlandID := compositeKeyParts[1]
			land, err := t.ReadLand(ctx, returnedlandID)
			if err != nil {
				return err
			}
			land.Owner = newOwner
			landBytes, err := json.Marshal(land)
			if err != nil {
				return err
			}
			err = ctx.GetStub().PutState(returnedlandID, landBytes)
			if err != nil {
				return fmt.Errorf("transfer failed for land %s: %v", returnedlandID, err)
			}
		}
	}

	return nil
}

// QuerylandsByOwner queries for lands based on the owners name.
// This is an example of a parameterized query where the query logic is baked into the chaincode,
// and accepting a single query parameter (owner).
// Only available on state databases that support rich query (e.g. CouchDB)
// Example: Parameterized rich query
func (t *SimpleChaincode) QueryLandsByOwner(ctx contractapi.TransactionContextInterface, owner string) ([]*Land, error) {
	queryString := fmt.Sprintf(`{"selector":{"owner":"%s"}}`, owner)
	return getQueryResultForQueryString(ctx, queryString)
}

// Querylands uses a query string to perform a query for lands.
// Query string matching state database syntax is passed in and executed as is.
// Supports ad hoc queries that can be defined at runtime by the client.
// If this is not desired, follow the QuerylandsForOwner example for parameterized queries.
// Only available on state databases that support rich query (e.g. CouchDB)
// Example: Ad hoc rich query
func (t *SimpleChaincode) QueryLands(ctx contractapi.TransactionContextInterface, queryString string) ([]*Land, error) {
	return getQueryResultForQueryString(ctx, queryString)
}

// getQueryResultForQueryString executes the passed in query string.
// The result set is built and returned as a byte array containing the JSON results.
func getQueryResultForQueryString(ctx contractapi.TransactionContextInterface, queryString string) ([]*Land, error) {
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}

// GetlandsByRangeWithPagination performs a range query based on the start and end key,

func (t *SimpleChaincode) GetLandsByRangeWithPagination(ctx contractapi.TransactionContextInterface, startKey string, endKey string, pageSize int, bookmark string) ([]*Land, error) {

	resultsIterator, _, err := ctx.GetStub().GetStateByRangeWithPagination(startKey, endKey, int32(pageSize), bookmark)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}

// QuerylandsWithPagination uses a query string, page size and a bookmark to perform a query

func (t *SimpleChaincode) QueryLandsWithPagination(ctx contractapi.TransactionContextInterface, queryString string, pageSize int, bookmark string) (*PaginatedQueryResult, error) {

	return getQueryResultForQueryStringWithPagination(ctx, queryString, int32(pageSize), bookmark)
}

// getQueryResultForQueryStringWithPagination executes the passed in query string with
// pagination info. The result set is built and returned as a byte array containing the JSON results.
func getQueryResultForQueryStringWithPagination(ctx contractapi.TransactionContextInterface, queryString string, pageSize int32, bookmark string) (*PaginatedQueryResult, error) {

	resultsIterator, responseMetadata, err := ctx.GetStub().GetQueryResultWithPagination(queryString, pageSize, bookmark)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	lands, err := constructQueryResponseFromIterator(resultsIterator)
	if err != nil {
		return nil, err
	}

	return &PaginatedQueryResult{
		Records:             lands,
		FetchedRecordsCount: responseMetadata.FetchedRecordsCount,
		Bookmark:            responseMetadata.Bookmark,
	}, nil
}

// GetlandHistory returns the chain of custody for an land since issuance.
func (t *SimpleChaincode) GetLandHistory(ctx contractapi.TransactionContextInterface, landID string) ([]HistoryQueryResult, error) {
	log.Printf("GetLandHistory: ID %v", landID)

	resultsIterator, err := ctx.GetStub().GetHistoryForKey(landID)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var records []HistoryQueryResult
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var land Land
		if len(response.Value) > 0 {
			err = json.Unmarshal(response.Value, &land)
			if err != nil {
				return nil, err
			}
		} else {
			land = Land{
				LandID: landID,
			}
		}

		timestamp, err := ptypes.Timestamp(response.Timestamp)
		if err != nil {
			return nil, err
		}

		record := HistoryQueryResult{
			TxId:      response.TxId,
			Timestamp: timestamp,
			Record:    &land,
			IsDelete:  response.IsDelete,
		}
		records = append(records, record)
	}

	return records, nil
}

// landExists returns true when land with given ID exists in the ledger.
func (t *SimpleChaincode) LandExists(ctx contractapi.TransactionContextInterface, landID string) (bool, error) {
	landBytes, err := ctx.GetStub().GetState(landID)
	if err != nil {
		return false, fmt.Errorf("failed to read land %s from world state. %v", landID, err)
	}

	return landBytes != nil, nil
}

// InitLedger creates the initial set of lands in the ledger.
func (t *SimpleChaincode) InitLedger(ctx contractapi.TransactionContextInterface) error {
	lands := []Land{
		{ LandID: "land1", AreaCode: "area1",  Length: "40", Breadth: "40", TotalArea: "1600", Owner: "Tomoko", 	Price: "1300000", ForSale: "true", Address: "AS Layout Bangalore,India"},
		{ LandID: "land2", AreaCode: "area5",  Length: "45", Breadth: "40", TotalArea: "1800", Owner: "Brad", 		Price: "4000000", ForSale: "true", Address: "MS Layout Bangalore,India"},
		{ LandID: "land3", AreaCode: "area12", Length: "40", Breadth: "40", TotalArea: "1600", Owner: "Jin Soo", 	Price: "5000000", ForSale: "true", Address: "SS Layout Bangalore,India"},
		{ LandID: "land4", AreaCode: "area11", Length: "50", Breadth: "50", TotalArea: "2500", Owner: "Max", 		Price: "6000000", ForSale: "true", Address: "OP Layout Bangalore,India" },
		{ LandID: "land5", AreaCode: "area34", Length: "55", Breadth: "40", TotalArea: "2000", Owner: "Adriana", 	Price: "7000000", ForSale: "true", Address: "RS Layout Bangalore,India"},
		{ LandID: "land6", AreaCode: "area17", Length: "15", Breadth: "40", TotalArea: "1600", Owner: "Michel", 	Price: "8000000", ForSale: "true", Address: "KS Layout Bangalore,India"},
	}

	for _, land := range lands {
		err := t.CreateLand(ctx, land.LandID, land.AreaCode, land.Length, land.Breadth,land.TotalArea, land.Owner, land.Price, land.ForSale, land.Address)
		if err != nil {
			return err
		}
	}

	return nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(&SimpleChaincode{})
	if err != nil {
		log.Panicf("Error creating DRealEstate chaincode: %v", err)
	}

	if err := chaincode.Start(); err != nil {
		log.Panicf("Error starting DRealEstate chaincode: %v", err)
	}
}
