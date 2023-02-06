import fs from 'fs';
import express from 'express';
import path from "path";
import bodyParser from 'body-parser';
import cors from 'cors';


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

const url = 'https://randomuser.me/api/?results=500'

app.get("/",async(req,res)=>{

    const data = await fetch(url);
    const response = await data.json();
    res.json(response);
});
app.listen(5500,()=>{    
    console.log("server running on Port 8000")
});