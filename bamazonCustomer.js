var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

var connection = mysql.createConnection ({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  // console.log("connected as id " + connection.threadId);
  displayProducts();
});

function displayProducts() {
  console.log("Displaying all products...\n");
  connection.query("SELECT item_id, product_name, stock_quantity, price FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    console.table(res);
    purchase();
  })
};

function purchase() {
  inquirer
    .prompt
    ([
      {
        type: "list",
        //MAKE THIS DATABASEY
        message: "Choose the ID of the product you'd like to purchase.",
        choices: ["CD001", "CD002", "CD003", "CD004", "VN001", "VN002", "VN003", "CS001", "CS002", "CS003"],
        name: "item"
      },
      {
        type: "input",
        message: "How many would you like?",
        name: "quantity"
      }
    ])
    .then(function(inquirerResponse) {
      connection.query("SELECT item_id, product_name, stock_quantity, price FROM products WHERE ?", 
        {
          item_id: inquirerResponse.item
        },
        function(err, res) {
          if (err) throw err;
          console.table(res);
          if (parseInt(inquirerResponse.quantity) > parseInt(res[0].stock_quantity)) {
            console.log("Sorry, we only have " + res[0].stock_quantity + " of those!");
            connection.end();

          } else if (parseInt(inquirerResponse.quantity) <= parseInt(res[0].stock_quantity)) {
            var price = res[0].price;
            connection.query("UPDATE products SET ? WHERE ?",
              [
                {
                  stock_quantity: res[0].stock_quantity - inquirerResponse.quantity
                },
                {
                  item_id: inquirerResponse.item
                }
              ],
              function(err, res) {
              console.log("Great, we've processed your order! Your total purchase cost is " + (parseInt(inquirerResponse.quantity) * parseFloat(price)) + ".");
                displayProducts();
              }
              )
          }
        })
    });
}
