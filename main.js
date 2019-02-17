const express = require('express'); 
const app = express()
const path = require('path'); 
const bodyParser = require('body-parser')
const image = require('./image.js')
const parse = require('./parse'); 

app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.use(express.static('public'))

var port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.render("main.js")
})

app.get('/waiting', (req, res) => {
    res.sendFile(__dirname + "/public/waiting.html")
    setTimeout(function () {
        res.sendFile(__dirname + "/public/test.html")
    }, 5000);
})

app.post("/send_url", (req, res) => { 
    if(req.body.url.startsWith('https://www.sec.gov/Archives/edgar/data/')){
        parse.getinfo(req.body.url, (info) => { 
            image.makeImage(info, () => {
                res.sendFile(__dirname + "/public/test.html")
            })
        })
    }else{
        res.sendFile(__dirname + "/public/index.html")
    }
})

app.get('/url_analyze', (req, res) => {
    res.send("<img src='watermark.png'>");
})

app.get('/test', (req, res) => {
    image.makeImage(req.body.email, () => {
        res.sendFile(__dirname + "/public/test.html")
    })
})
app.listen(port, () => console.log('Example app listening on port 3000!'))