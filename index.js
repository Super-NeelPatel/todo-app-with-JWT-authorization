require('dotenv').config();
const express = require("express")
const mongoose = require("mongoose")
const userRoutes = require("./routes/userRoutes.js");
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors())
app.use("/todo", userRoutes)




mongoose.connect(process.env.DB_STRING).then(app.listen(process.env.PORT, () => {
    console.log(`Server is running on ${PORT}`);
})).catch(err => console.log(err))