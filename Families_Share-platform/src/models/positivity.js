const mongoose = require('mongoose')

const positiveSchema = {
    positivity_id: {
        type: mongoose.ObjectId,
        required: true,
    },
    user:{
        type:String,
        required:true,
    },
    confirmation_date:{
        type:String,
        required:true
    },
    result:{
        type:String,
        required:true
    }
}

const model = mongoose.model("Positivity", positiveSchema)

module.exports = model
