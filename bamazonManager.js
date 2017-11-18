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
  console.log("connected as id " + connection.threadId);
  managerView();
});

function managerView() {
  inquirer
    .prompt
    ([
      {
        type: "list",
        message: "Choose the ID of the product you'd like to purchase.",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
        name: "menu"
      }
    ])
    .then(function(inquirerResponse) {
      if (inquirerResponse.menu === "View Products for Sale") {
        connection.query("SELECT item_id, product_name, stock_quantity, price FROM products", 
        function(err, res) {
          if (err) throw err;
          console.table(res);
        })
      } else if (inquirerResponse.menu === "View Low Inventory") {
          connection.query("SELECT product_name FROM products GROUP BY stock_quantity HAVING count(*) < 5", 
          function(err, res) {
            if (err) throw err;
              for (var i = 0; i < res.length; i++) {
                console.table(res[i].product_name);
              }
          })
      } else if (inquirerResponse.menu === "Add to Inventory") {
        inquirer
          .prompt([
            {
              type: "input",
              message: "Which item would you like to add stock for?"
              name: "add"
            }
          ])
      } else if (inquirerResponse.menu === "Add New Product") {
        inquirer
          .prompt([
            {
              type: "input",
              message: "What would you like to add?"
              name: "new"
            }
          ])
      }
    });
};
