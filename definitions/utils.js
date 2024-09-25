// // const https = require('https');
// const webpack = require("webpack");
// // const { node} = require("**/node-fetch");


// function fetchStockData(stockSymbols) {
//     // Define the stock symbols as a comma-separated string
//     const symbols = stockSymbols.join(',');

//     // The URL for fetching stock data (Yahoo Finance in this example)
//     const stockApiUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;

//     // Make the HTTP request using fetch and return the promise
//     return fetch(stockApiUrl)
//         .then(response => {
//             // Check if the response is okay (status code 200)
//             if (!response.ok) {
//                 throw new Error(`Error fetching stock data: ${response.statusText}`);
//             }

//             // Parse the response body as JSON
//             return response.json();
//         })
//         .then(stockData => {
//             // Return the stock data
//             return stockData.quoteResponse.result;
//         })
//         .catch(error => {
//             console.error("Failed to fetch stock data:", error);
//             return null; // Return null or handle the error as needed
//         });
// }


// module.exports = {
//     fetchStockData
// }