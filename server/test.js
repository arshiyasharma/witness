const express = require("express");
const app = express();

app.get("/", (req,res) => res.send("Hello world!"));

app.listen(5001, "0.0.0.0", () => console.log("Running on 5001"));