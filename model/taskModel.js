const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
})

//Here we just need to export schema and not whole model while embeding
// module.exports = mongoose.model("Task", TaskSchema) <---- WRONG

module.exports = taskSchema;
