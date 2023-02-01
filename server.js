const http = require('http');
const {
    parse
} = require('querystring');


const hostname = '127.0.0.1';
const port = 8000;

const url = 'https://randomuser.me/api/?results=10'
const data = fetch(url).then((response) => response.json());

const server = http.createServer((req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        if (req.method === "GET") {
            data.then(resp => {
                res.end(`
                
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Document</title>
                </head>
                <body>      

                <form action="/" method = "POST">
                <input type="text" name="first" placeholder="Name">
                <input type="text" name="State" placeholder="Sate/Country">
                <button>Search</button>
                <select name="sort"><option value="asc">asc</option>
                <option value="dsc">dsc</option>
                <input type="submit" value="Sort">
                </form>

                <ol class="list">              
                </ol>

                <script>
                for(let x of ${JSON.stringify(resp.results)}){
                    let img = document.createElement('img');
                    let div = document.createElement('div');
                    img.src = x.picture.thumbnail;
                    img.style.width='100px';
                    img.style.height='100px';
                    img.style.margin = '5px';
                    let p1 = document.createElement('p');
                    let p2 = document.createElement('p');
                    let p3 = document.createElement('p');
                    
                    p1.innerText = "name: "+x.name.first + " " +  x.name.last;
                    p2.innerText = "Loaction: " + x.location.city, + ", " + x.location.state + ", " + x.location.country;
                    p3.innerText = "username: " + x.login.username;

                    div.appendChild(p1);
                    div.appendChild(p2);
                    div.appendChild(p3);


                    let list = document.getElementsByClassName('list')[0];
                    list.style.padding='0px';
                    list.style.margin='5px 5px';
                    let li = document.createElement('li');
                    li.className = 'listItem';
                    li.style.border = '1px solid grey';
                    li.style.listStyleType='none';
                    li.appendChild(img);
                    li.appendChild(div);


                    li.style.display= 'flex';
                    li.style.width='100%';    

                    list.appendChild(li);
                    
                }
                </script>
    
                </body>
                </html>
            `);
            })

        } else if (req.method === "POST" && req.url === "/") {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                let fname = parse(body);
                data.then(resp => {
                    if (fname.sort == 'asc') {
                        resp.results = resp.results.sort(compare);
                    } else if (fname.sort == 'dsc') {
                        resp.results = resp.results.sort(dscComp);
                    }
                    res.end(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Document</title>
                    </head>
                    <body>      
    
                    <form action="/" method = "POST">
                    <input type="text" name="first" placeholder="Name">
                    <input type="text" name="State" placeholder="Sate/Country">
                    <button>Search</button>
                    <select name="sort"><option value="asc">asc</option>
                    <option value="dsc">dsc</option>
                    <input type="submit" value="sort">
                    </form>

                    <ol class="list">
                    </ol>

                    <script>
                    let list = document.getElementsByClassName('list')[0];
                    list.style.padding='0px';
                    list.style.margin='5px 5px';
                    let searchname = ${JSON.stringify(fname.first)} 
                    let searchloc = ${JSON.stringify(fname.State)}
                    for(let x of ${JSON.stringify(resp.results)}){
                        if(
                            (x.name.first.toLowerCase().includes(searchname.toLowerCase()) || x.name.last.toLowerCase().includes(searchname.toLowerCase())) &&
                            (x.location.city.toLowerCase().includes(searchloc.toLowerCase()) || x.location.country.toLowerCase().includes(searchloc.toLowerCase())
                            || x.location.state.toLowerCase().includes(searchloc.toLowerCase()))
                         ){

                            let img = document.createElement('img');
                            let div = document.createElement('div');
                            img.src = x.picture.thumbnail;
                            img.style.width='100px';
                            img.style.height='100px';
                            img.style.margin = '5px';
                            let p1 = document.createElement('p');
                            let p2 = document.createElement('p');
                            let p3 = document.createElement('p');
                            p1.innerText = "name: "+x.name.first + " " +  x.name.last;
                            p2.innerText = "Loaction: " + x.location.city, + ", " + x.location.state + ", " + x.location.country;
                            p3.innerText = "username: " + x.login.username;
    
                            div.appendChild(p1);
                            div.appendChild(p2);
                            div.appendChild(p3);
                            let li = document.createElement('li');
                            li.className = 'listItem';
                            li.style.border = '1px solid grey';
                            li.style.listStyleType='none';
                            li.appendChild(img);
                            li.appendChild(div);
                            
                            li.style.display= 'flex';
                            li.style.width='100%';    
                            
                            list.appendChild(li);
                         }                       
                        
                    }
                    </script>
        
                    </body>
                    </html>
                `);
                })

            });
        }
    }

);

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


server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});