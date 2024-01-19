const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require('https');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(`${__dirname}/signup.html`)
});

app.post("/", function (req, res) {
    const firstName = req.body.fName
    const lastName = req.body.lastName
    const email = req.body.email

    // Batch subscribe/unsubscribe data
    const data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }

    const jsonData = JSON.stringify(data);

    // Mailchimp API key and list ID
    const apiKey = '7e7bb1d9eec9757b863f3b5a9dbed8a6-us21';
    const listId = 'f364c63968';

    const url = `https://us21.api.mailchimp.com/3.0/lists/${listId}/`;

    // Set request options
    const options = {
        method: 'POST',
        auth: `Linusman001:${apiKey}`
    }

    const request = https.request(url, options, function (response) {

        if (response.statusCode === 200) {
            res.sendFile(`${__dirname}/success.html`)
        }
        else {
            res.sendFile(`${__dirname}/failure.html`)
        }

        let data = ""

        // A chunk of data has been received.
        response.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received.
        response.on('end', () => {
            console.log(JSON.parse(data));
        });
    })

    // Handle request errors
    request.on('error', (error) => {
        console.error(`Error making request: ${error.message}`);
    });

    // Send the JSON data in the request body
    request.write(jsonData);

    // End the request
    request.end();

})

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000 , function(){
    console.log("Server Started at port 3000");
})
