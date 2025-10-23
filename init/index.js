const mongoose = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing");

main()
.then(()=> {
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
});


async function main () {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "68e291b2440ba68c3926cb5a"}));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();