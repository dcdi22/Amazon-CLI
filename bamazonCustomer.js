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
    console.log("Connected as ID " + connection.threadId + "\n");
    //make functions
})