const mongoose = require("mongoose")

     
const connectdb = ()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{console.log(`Database connected successfully`)})
    .catch((err)=>{
        console.log(err.message)
    })
} 

module.exports = connectdb