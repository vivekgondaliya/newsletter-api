const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//route definitions
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  let firstname = req.body.fName;
  let lastname = req.body.lName;
  let email = req.body.email;

  // 2) body content
  let data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname
        }
      }
    ]
  };

  let jsonData = JSON.stringify(data);

  //default method is get, change it to POST
  // 1) Authorization
  let options = {
    url: "https://us20.api.mailchimp.com/3.0/lists/553286706c",
    method: "POST",
    headers: {
      Authorization: "vivekg 861a5ed979b08e4b9e7133d90e426617-us20"
    }
    //body: jsonData
  };

  // 3) request
  request(options, function(error, response, body) {
    if (error) {
      res.send("There was an error with sign up. Please try again.");
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });
});

app.post("/success", function(req, res) {
  res.redirect("/");
});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Running server on PORT 3000...");
});

//mailchimp api key= 861a5ed979b08e4b9e7133d90e426617-us20
//mailchimp list uniqueid = 553286706c
//test your app before you deploy, test on localhost
//create a Procfile
