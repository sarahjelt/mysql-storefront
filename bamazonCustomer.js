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
  displayProducts();
});

//displays table of all inventory
function displayProducts() {
  console.log("Displaying all products...\n");
  connection.query("SELECT item_id, product_name, stock_quantity, price FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    purchase();
  })
};

//displays list of each item id to choose from, input for number you wish to purchase
function purchase() {
  inquirer
    .prompt
    ([
      {
        type: "list",
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
          //if user requests more units of an item than are available, gives "sorry!" message and choice to purchase to another item
          if (parseInt(inquirerResponse.quantity) > parseInt(res[0].stock_quantity)) {
            console.log("Sorry, we only have " + res[0].stock_quantity + " of those!");
            additional();
          //if adequate inventory available, displays total cost of purchase, removes number of units they purchased from that item's inventory, and shows confirm prompt for user to choose whether to keep shopping
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
                additional();
              }
              )
          }
        })
    });
};

//option to make another purchase
function additional() {
  inquirer
  .prompt
  ([
    {
      type: "confirm",
      message: "Would you like to make another purchase?",
      name: "continue"
    }
  ])
  .then(function(inquirerResponse) {
    //shows available products again if they choose to keep shopping
    if (inquirerResponse.continue) {
      displayProducts();
    } 
    //displays thanks message and closes connection if they choose not to keep shopping
    else {
      console.log("Thanks for your business!");
      connection.end();
    }
  })
};
