const http = require("http") 


const server = http.createServer((req, res) => {

    if(req.url === "/" && req.method === "GET") {
        res.writeHead(200, {"content-type" : "text/plain"}) ;
        res.end("Welcome to the Job Tracking API") ;
    }
    else if(req.url === "/health" && req.method === "GET") {
        res.writeHead(200, {"content-type" : "application/json"});
        res.end(JSON.stringify({status : "ok"}))
    }
    else {
        res.writeHead(404, {"content-type" : "text/plain"}) ;
        res.end("Not found") ;
    }
})


server.listen(3000, () => {
    console.log("Server is running on PORT 3000")
})