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
            console.log("\n" + res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("\n--------------------------------" + "\n");
        promptUser();
    });

};

function promptUser() {
    inquirer.prompt([{
            message: "What is the ID# of the product you would like to buy?",
            type: "input",
            name: "item",
            validate: function(value){
                if(isNaN(value) == false){return true;}
                else{return false;}
              }
        },
        {
            message: "How many units of this item would you like to purchase?",
            type: "input",
            name: "quantity",
            validate: function(value){
                if(isNaN(value) == false){return true;}
                else{return false;}
              }
        }
    ]).then(function (answer) {
        connection.query("SELECT * FROM products WHERE id = ?", [answer.item], function (err, res) {
            if (err) throw err;

            for (var i = 0; i < res.length; i++) {
                if (answer.quantity > res[i].stock_quantity) {
                    console.log("Sorry WE OUT");
                    // reprompt
                    reprompt();
                } else {
                    console.log(`\nAwesome we got enuf ${res[i].product_name}'s for you.\n`)
                    var qty = answer.quantity;
                    var item = res[i].product_name;
                    var newQty = res[i].stock_quantity - answer.quantity;
                    var itemId = parseInt(answer.item);
                    //console.log(newQty, itemId);
                    fulfill(newQty, itemId, qty, item);
                }
            };
        });
    });
};

function fulfill(newQty, itemId, qty, item) {
    inquirer.prompt([{
        message: `Are you sure you want to purchase ${qty} ${item}'s tho??`,
        type: "confirm",
        name: "confirmSale",
        default: true
    }]).then(function (answer) {
        if (answer.confirmSale) {
            connection.query("UPDATE products SET ? WHERE ?", 
            [
                {
                stock_quantity: newQty
                },
                {
                    id: itemId
                }
            ], function (err, res) {
                if (err) throw err;
                console.log(`\nAlrighty, stock has been updated to ${newQty} units left in my garage..uh I mean warehouse.`)
                //console.log(res);
                totalcosts(itemId, qty);
                //reprompt();
            })
            
        } else {
            console.log("\nProbably for the best, what were you thinking?\n")
            reprompt();
        };
        // reprompt
        //reprompt();
    });
};

function totalcosts(itemId, qty) {
    
    connection.query("SELECT * FROM products WHERE id = ?", [itemId], function (err, res) {
        if (err) throw err;
        var totalCost = res[0].price * parseInt(qty);
        console.log("In total you just spent $" + totalCost.toFixed(2) + "! \nMan, how do you just have that kind of cash laying around.\n");
        reprompt();
    })
}

function reprompt() {
    inquirer.prompt([{
        message: "Would you like to purchase something else?",
        type: "confirm",
        name: "reply"
    }]).then(function(answer) {
        if (answer.reply) {
            promptUser();
        } else {
            console.log("\nCome again soon, buy my things please, I need to pay my rent!\n")
            connection.end();
        }
    })
}