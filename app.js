const express = require("express");
const request = require("request");
const https = require("https");

const app = express();

//this is to use public folder that has css,images
app.use(express.static("public"));

//this is to use body parser//
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  /** to store the data I get from user */
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.emailAddress;

  /** to change the form of the data to js object I get from user
   * to send it back to mailchimp
   */
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  /* to flat pack js object to send to mailchimp*/
  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/bd19c9e78c";
  const options = {
    method: "POST",
    auth: "second:4c2fa90a2aad76e9e845ca2b96a6bfa6-us21",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});

//api key : 4c2fa90a2aad76e9e845ca2b96a6bfa6-us21//
//audience id : bd19c9e78c
