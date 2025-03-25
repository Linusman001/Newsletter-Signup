const express = require('express')
const bodyParser = require('body-parser')
const https = require('https')
const app = express()
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))

app.get('/', (req, res)=>{
    res.sendFile(`${__dirname}/signup.html`)
})

app.post('/', (req, res)=>{
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email

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

    const jsonData = JSON.stringify(data)

    const url = 'https://us21.api.mailchimp.com/3.0/lists/f364c63968'
    const options = {
        method: 'POST',
        auth: "Linusman:b64390cec8084533d39ce3a5cc860f4d-us21"
    }

    const request = https.request(url, options, (response)=>{
        let responseData = ''
        
        // response.on('data', (d)=> {
        //     process.stdout.write(d)
        // })

        response.on('data', (data)=>{
            responseData += data
        })

        response.on('end', ()=>{
            console.log(JSON.parse(responseData))
        })

        if (response.statusCode == 200) {
            res.sendFile(`${__dirname}/success.html`)
        }
        else {
            res.sendFile(`${__dirname}/failure.html`)
        }
    })
    
    request.on('error', (error)=>{
        console.error(error)
    })
    request.write(jsonData)
    request.end()
})

app.post('/failure', (req, res)=>{
    res.redirect('/')
})

app.listen(3000, ()=>{
    console.log('Server is running on port 3000')
})


//API Key
// b64390cec8084533d39ce3a5cc860f4d-us21

//List Id
// f364c63968