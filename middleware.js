

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "you must be logged in to create listing!" );
       return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

const Listing = require("./models/listing");

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;
     let listing = await Listing.findById(id);
     if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings"); 
    }
     if(!res.locals.currUser || !listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
       return res.redirect(`/listings/${id}`);
     }
      next();

};

const Review = require("./models/review");

module.exports.isReviewAuthor = async (req, res, next) => {
    let {reviewId, id} = req.params;
     let review = await Review.findById(reviewId);
     if(!res.locals.currUser || !review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the author of this review");
       return res.redirect(`/listings/${id}`);
     }
      next();
};

const ExpressError = require("./utils/ExpressError");
const { listingSchema, reviewSchema } = require("./schema");

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
       if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
       } else {
        next();
       }

};

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
       if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
       } else {
        next();
       }
};