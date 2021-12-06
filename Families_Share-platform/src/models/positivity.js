const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const positiveSchema = {
    user_id:{
        type:Number,
        required:true,
        unique:true
    },
    confirmation_date:{
        type:String,
        required:true
    }
}

const model = mongoose.model("Positivity", positiveSchema)

module.exports = model