"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.set("view engine", "hbs");
app.set("views", path_1.default.join(__dirname, "views"));
const url = 'https://127.0.0.1:5500';
app.get("/", (req, res) => {
    let fileData = (readDataToFile().toString());
    res.render("index", { resp: JSON.parse(fileData) });
});
app.post("/", (req, res) => {
    let name = req.body.first;
    let loc = req.body.location;
    let sort = req.body.sort;
    let data = readDataToFile();
    if (req.body.Sort === 'Sort') {
        if (sort == 'asc')
            JSON.parse(data.toString()).results = JSON.parse(data.toString()).results.sort(compare);
        else
            JSON.parse(data.toString()).results = JSON.parse(data.toString()).results.sort(dscComp);
        res.render("index", { resp: (data) });
    }
    else {
        let searchData = JSON.parse(data.toString());
        for (let x of JSON.parse(data.toString()).results) {
            if ((x.name.first.toLowerCase().includes(name) || x.name.last.toLowerCase().includes(name)) &&
                (x.location.city.includes(loc) || x.location.state.includes(loc) || x.location.country.includes(loc))) {
                searchData.results.push(x);
            }
        }
        res.render("index", { resp: searchData });
    }
});
function compare(a, b) {
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
function dscComp(a, b) {
    return -1 * compare(a, b);
}
function writeDataToFile(data) {
    let d = JSON.stringify(data);
    fs_1.default.writeFileSync("file.json", d);
}
function readDataToFile() {
    let d = fs_1.default.readFileSync("file.json");
    return d;
}
app.listen(8000, () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield fetch(url);
    const response = yield data.json();
    writeDataToFile(response);
    console.log("server running on Port 8000");
}));
