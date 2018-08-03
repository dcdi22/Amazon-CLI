var mysql = require("mysql");
var inquirer = require("inquirer");

// Create database connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

// Connect to database
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as Id " + connection.threadId + "\n");
    //make functions
    afterConnection();
});

function afterConnection() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\n--------------------------------" + "\n");
        //console.log(res)
        for (let i = 0; i < res.length; i++) {
            console.log("\n" + res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("\n--------------------------------" + "\n");
        promptUser();
    });

};

function promptUser() {
    inquirer.prompt([{
            message: "What is the ID of the product you would like to buy?",
            type: "input",
            name: "item"
        },
        {
            message: "How much would you like to purchase?",
            type: "input",
            name: "quantity"
        }
    ]).then(function (answer) {
        connection.query("SELECT * FROM products WHERE id = ?", [answer.item], function (err, res) {
            if (err) throw err;

            for (var i = 0; i < res.length; i++) {
                if (answer.quantity > res[i].stock_quantity) {
                    console.log("Sorry WE OUT");
                } else {
                    console.log(`Awesome we got enuf ${res[i].product_name} for you`)
                    var qty = answer.quantity;
                    var item = res[i].product_name;
                    var newQty = res[i].stock_quantity - answer.quantity;
                    var itemId = answer.item;
                    //console.log(newQty, itemId);
                    fulfill(newQty, itemId, qty, item);
                }
            };
        });
    });
};

function fulfill(newQty, itemId, qty, item) {
    inquirer.prompt([{
        message: `Are you sure you want to purchase ${qty} ${item}'s??`,
        type: "confirm",
        name: "confirmSale",
        default: true
    }]).then(function (answer) {
        if (answer.confirmSale) {
            connection.query("UPDATE products SET ? WHERE ?", [])
        }
        else {
            console.log("Probably for the best, what were you thinking?")
        }
    })
}

// function quantityAsk() {
//     inquirer.prompt([{
//         message: "How many would you like?",
//         type: "input",
//         name: "quantity"
//     }]).then(function (answer) {
//         connection.query(`SELECT stock_quantity FROM WHERE id = ${answer.item}`, function (err, res) {
//             if (err) throw err;
//             console.log(res);
//         })
//     })
// }