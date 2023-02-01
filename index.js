const express = require('express');
const hbs = require('hbs');
const path = require("path");
const bodyParser = require('body-parser');
const { json } = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "hbs");

app.set("views", path.join(__dirname,"/views"));


const url = 'https://randomuser.me/api/'

const data =fetch(url).then((response) => response.json());


app.get("/",(req,res)=>{
    data.then((resp) => {
        res.send(resp)
        // res.render("index", {
        //     article: JSON.parse(JSON.stringify(resp.articles[0].author))
        // })
    })
})

app.get("/",(req,res)=>{
    res.render("index");
})
app.post("/app",(req,res)=>{
    res.send(`hello ${req.body.name}`)
})

app.listen(8000,()=>{
    console.log('fsdf');
})
