const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { isAlphanumeric, isValidReceipt } = require('./utils');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 8000;

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

const receipts = {};

// receipt object will look like this:
    // {
    //   uuid : {
    //     "retailer": "Target",
    //     "purchaseDate": "2022-01-01",
    //     "purchaseTime": "13:01",
    //     "items": [
    //       {
    //         "shortDescription": "Mountain Dew 12PK",
    //         "price": "6.49"
    //       },{
    //         "shortDescription": "Emils Cheese Pizza",
    //         "price": "12.25"
    //       },{
    //         "shortDescription": "Knorr Creamy Chicken",
    //         "price": "1.26"
    //       },{
    //         "shortDescription": "Doritos Nacho Cheese",
    //         "price": "3.35"
    //       },{
    //         "shortDescription": "   Klarbrunn 12-PK 12 FL OZ  ",
    //         "price": "12.00"
    //       }
    //     ],
    //     "total": "35.35"
    //   }
    // }

app.post('/receipts/process/', (req, res) => {
    // TODO: assign receipt a unique ID, store the receipt in the receipts object, and return the ID to the client
    // generate a new uuid
    const id = uuidv4();
    // if the receipt body is invalid, return 400 error saying "The receipt is invalid"
    if (!isValidReceipt(req.body)) {
        return res.status(400).json({
            description: "The receipt is invalid"
        });
    }
    // while we find the id in the receipts object, generate a new uuid and try again in case of collision
    while (receipts.hasOwnProperty(id)) id = uuidv4();
    receipts[id] = req.body;
    return res.json({ id });
});

app.get("/receipts/:id/points/", (req, res) => {
    // TODO: calculate points based on receipt id
    // take the id from the route params
    const { id } = req.params;

    // start the points counter at 0
    let points = 0;

    // find the receipt in the receipts object
    // if the receipt id cannot be found, then return 404 not found error
    if (!receipts.hasOwnProperty(id)) {
        return res.status(404).json({
            description: "No receipt found for that id"
        });
    }
    // if the receipt is found, then calculate the points
    const receipt = receipts[id];
    // one point is added for each alphanumeric character in the retailer name
    for (let char of receipt.retailer) {
        if (isAlphanumeric(char)) points++;
    }

    // 50 points if the total is a round dollar amount with no cents
    if (receipt.total.endsWith(".00")) points += 50;

    // 25 points if the total is a multiple of 0.25
    if (receipt.total.endsWith(".25") || receipt.total.endsWith(".50") || receipt.total.endsWith(".75") || receipt.total.endsWith(".00")) points += 25;
    // 5 points for every two items on the receipt
    points += Math.floor(receipt.items.length / 2) * 5;
    // if the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer. The result is the number of points earned.
    for (let item of receipt.items) {
        if (item.shortDescription.trim().length % 3 === 0) {
            points += Math.ceil(parseFloat(item.price) * 0.2);
        }
    }

    // 6 points if the day in the purchase date is odd
    const purchaseDate = receipt.purchaseDate
    const purchaseDay = purchaseDate.slice(purchaseDate.length - 2, purchaseDate.length)
    if (parseInt(purchaseDay) % 2 === 1) points += 6

    // 10 points if the time of purchase is after 2:00 PM and before 4:00 PM
    const purchaseHour = parseInt(receipt.purchaseTime.slice(0, 2));
    if (purchaseHour >= 14 && purchaseHour < 16) points += 10
    return res.json({ points });
});
