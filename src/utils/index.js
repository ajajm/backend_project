require ("dotenv").config()
const express = require("express")
const app = express()
port = 3000

app.get("/", (req,res) => {
    res.send("Hello world")
})

app.get("/twitter", (req, res) => {
    res.send("you are at twitter")
})

app.get("/login", (req, res) => {
    res.send("<h1>please login at backend program</h1>")
})

app.get("/chai", (req, res) => {
    res.send("<h2>chai aur code</h2>")
})

app.listen(process.env.PORT, () => { 
    console.log(`App is listening on PORT: ${port}`)
})