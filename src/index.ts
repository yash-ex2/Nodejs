import fs from 'fs';
import express from 'express';
import path from "path";
import bodyParser from 'body-parser';


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

const url = 'https://randomuser.me/api/?results=50'

app.get("/",(req,res)=>{
    let fileData = (readDataToFile().toString())
    res.render("index",{resp:JSON.parse(fileData)});
});

// app.post("/",(req,res)=>{
//     let name = req.body.first
//     let loc = req.body.location
//     let sort = req.body.sort;
//     let data = readDataToFile();
//     if(req.body.Sort==='Sort'){
//         if(sort=='asc')JSON.parse(data.toString()).results = JSON.parse(data.toString()).results.sort(compare);
//         else JSON.parse(data.toString()).results = JSON.parse(data.toString()).results.sort(dscComp);
//         res.render("index",{resp:(data)});

//     }else{
//         let searchData=JSON.parse(data.toString());
//         for(let x of JSON.parse(data.toString()).results){
//                 if (
//                     ( x.name.first.toLowerCase().includes(name) || x.name.last.toLowerCase().includes(name) ) &&
//                     ( x.location.city.includes(loc) || x.location.state.includes(loc) ||x.location.country.includes(loc) )
//                 ){
//                     searchData.results.push(x);
//                 }
            
//         }
//         res.render("index",{resp:searchData});
//     }
// });


function compare(a: { name: { first: string; last: string; }; }, b: { name: { first: string; last: string; }; }) {
    if (a.name.first < b.name.first) {
        return -1;
    }
    if (a.name.first > b.name.first) {
        return 1;
    }
    if (a.name.last < b.name.last) {
        return -1;
    }
    if (a.name.last > b.name.last) {
        return 1;
    }
    return 0;
}

function dscComp(a: { name: { first: string; last: string; }; }, b: { name: { first: string; last: string; }; }) {
    return -1 * compare(a, b);
}


function writeDataToFile(data: any){
    let d = JSON.stringify(data);
    fs.writeFileSync("file.json",d);
}
function readDataToFile(){
    let d = fs.readFileSync("file.json");
    return d;  
}


app.listen(8000,async()=>{
    const data = await fetch(url);
    const response = await data.json();
    writeDataToFile(response);
    
    console.log("server running on Port 8000")
});