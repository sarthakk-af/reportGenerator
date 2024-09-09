const mongoose=require("mongoose")

const rgSchema = new mongoose.Schema({
    eventName: {
        required: true,
        type: String,
        trim: true
    },
    eventDate: {
        required: true,
        type: String,
        trim: true
    },
    eventVenue: {
        required: true,
        type: String,
        trim: true
    },
    eventDescription: {
        required: true,
        type: String,
        trim: true
    },
    eventPOC:{
        required:true,
        type: String,
        trim:true
    },
    eventImage: {
        required: false,
        type: String 
    },
})
module.exports = mongoose.model("ReportGenerator",rgSchema)