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
            console.log("\n" + res[i].id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("\n--------------------------------" + "\n");
        //promptUser();
    });

};

function lowInv() {
    connection.query('SELECT * FROM products GROUP BY product_name HAVING stock_quantity < 10 ', function (err, res) {
        // "SELECT * FROM products WHERE stock_quantity < 10" Works Also
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(`LOW: ${res[i].product_name}`);
        };
    });
};

function addInv() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        var itemArr = [];
        for (var i = 0; i < res.length; i++) {
            itemArr.push(res[i].product_name);
        };

        inquirer.prompt([{
            message: "Which product would you like to add more inventory to?",
            type: "list",
            choices: itemArr,
            name: "item"
        }, {
            message: "Great, now how much would you like to add to the inventory?",
            type: "input",
            name: "qty"
        }]).then(function(answer){
            
        })


    })
    // inquirer.prompt([{
    //     message: "Which product would you like to add more inventory to? Please select by product ID.",
    //     type: "input",
    //     name: "itemId"
    // },
    // {
    //     message: "Great, now how much would you like to add to the inventory?",
    //     type: "input",
    //     name: "qty"
    // }]).then(function (answer){
    //     var newQty = res.stock_quantity + answer.qty;
    //     console.log(newQty);
    //     connection.query("UPDATE products SET ? WHERE ?", 
    //     [
    //         {
    //         stock_quantity: newQty
    //         },
    //         {
    //             id: answer.itemId
    //         }
    //     ], function (err, res){
    //         if (err) throw err;
    //         console.log(res);
    //     });
    // });
};