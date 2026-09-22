const express = require("express") 


const app = express() 

app.get("/", (req, res) => {
    res.send("Welcome to the Job Tracking API") ;
})

app.listen(3000, () => {
    console.log("Server is running on PORT 3000") ;
})