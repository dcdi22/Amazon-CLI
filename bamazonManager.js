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
    promptUser();
});


function promptUser() {
    // Give the user only two choices, BID or POST
    inquirer.prompt([{
        type: 'list',
        choices: ['View Products for Sale',
            'View Low Inventory',
            'Add to Inventory',
            'Add New Product'
        ],
        message: 'Hey boss dude what would you like to do?',
        name: 'item'
    }]).then(function (answer) {
        switch (answer.item) {
            case 'View Products for Sale':
                viewProducts();
                break;
            case 'View Low Inventory':
                lowInv();
                break;
            case 'Add to Inventory':
                addInv();
                break;
            case 'Add New Product':
                addProd();
                break;
        }
    });
}

function viewProducts() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.log("\n--------------------------------" + "\n");
        //console.log(res)
        for (let i = 0; i < res.length; i++) {
            console.log("\n" + res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("\n--------------------------------" + "\n");
        //promptUser();
        reprompt();
    });

};

function lowInv() {
    connection.query('SELECT * FROM products GROUP BY product_name HAVING stock_quantity < 10 ', function (err, res) {
        // "SELECT * FROM products WHERE stock_quantity < 10" Works Also
        if (err) throw err;
        console.log("\nHere's what we're low on")
        for (var i = 0; i < res.length; i++) {
            console.log(`LOW INVENTORY: ${res[i].product_name}`);
        };
        console.log("\n");
        reprompt();
    });
};

function addInv() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var itemArr = [];
        var itemObj = {};
        
        for (var i = 0; i < res.length; i++) {
            itemArr.push(res[i].product_name);
            itemObj[res[i].product_name] = res[i];
        };
        inquirer.prompt([{
            message: "Which product would you like to add more inventory to?",
            type: "list",
            choices: itemArr,
            name: "item"
        }, {
            message: "Great, now how much would you like to add to the inventory?",
            type: "input",
            name: "qty",
            validate: function(value){
                if(isNaN(value) == false){return true;}
                else{return false;}
              }
        }]).then(function (answer) {
            var newQty = parseInt(itemObj[answer.item].stock_quantity) + parseInt(answer.qty);
            //console.log(newQty);
            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: newQty
            }, {
                product_name: answer.item
            }], function (err, res) {
                if (err) throw err;
                console.log(`Inventory has been updated to ${newQty} units of ${answer.item}'s.`);
                //console.log(res);
                reprompt();
            });
        });
    });
};

function addProd() {
    inquirer.prompt([{
        message: "What is the name of the product you would add?",
        type: "input",
        name: "product"
    }, {
        message: "What deperatment does this product belong in?",
        type: "input",
        name: "dpmt"
    }, {
        message: "What is the selling price?",
        type: "input",
        name: "price",
        validate: function(value){
            if(isNaN(value) == false){return true;}
            else{return false;}
          }
    }, {
        message: "How much inventory would you like to start with?",
        type: "input",
        name: "qty",
        validate: function(value){
            if(isNaN(value) == false){return true;}
            else{return false;}
          }
    }]).then(function(answer) {
        //console.log("HELLO");
        connection.query("INSERT INTO products SET ?", {
            product_name: answer.product,
            department_name: answer.dpmt,
            price: answer.price,
            stock_quantity: answer.qty
        }, function (err, res) {
            if (err) throw err;
            console.log(`${answer.product} has now been added to the store.`);
            //console.log(res);
            reprompt();
        });
    });
};

function reprompt() {
    inquirer.prompt([{
        message: "Is there anything else you'd like to do?",
        type: "confirm",
        name: "reply"
    }]).then(function(answer) {
        if (answer.reply) {
            promptUser();
        } else {
            console.log("Thanks boss dude, come back if you need to check on the business.");
            connection.end();
        }
    })
}