const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");  

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
      console.log("connected to Database");
      
}).catch(err=>{
      console.log(err);
      
})
async function main(){
      await mongoose.connect(MONGO_URL)
}

const initDB = async()=>{
      await Listing.deleteMany({});
     initdata.data = initdata.data.map((obj) => ({ ...obj, owner:"67e7ba8b51f8976c166a88eb"}))  
      await Listing.insertMany(initdata.data);
      console.log("data was initialized");
}

initDB();