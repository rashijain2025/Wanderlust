const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const listingSchema = new Schema ({
    title: {
       type: String, 
       required: true,
    },
    description: String,
    
    image: {
        url: {
            type: String,
            default: "https://plus.unsplash.com/premium_photo-1684508638760-72ad80c0055f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWlyYm5ifGVufDB8fDB8fHww",
             set: (v) => v=== "" ? "https://plus.unsplash.com/premium_photo-1684508638760-72ad80c0055f?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWlyYm5ifGVufDB8fDB8fHww" : v,
        },
        filename: String,
    },

    price: {
        type: Number,
        default: 0
    },

    location: String,
    country:String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});


listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
       await Review.deleteMany({_id: {$in: listing.reviews}});
    }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;