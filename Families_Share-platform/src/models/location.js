const mongoose = require('mongoose');
const User = require("./user")


const LocationSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique:true 
    },
    latitude:{
        type: Number, 
        required : true
    },
    longitude:{
        type: Number, 
        required : true
    }
})

const model = mongoose.model('Location', LocationSchema);
