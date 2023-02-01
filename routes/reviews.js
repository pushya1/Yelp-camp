const express = require('express')
const Router = express.Router({mergeParams:true});
const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
Router.post('/',isLoggedIn,validateReview,catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created new review');
    res.redirect(`/campgrounds/${campground._id}`);

}))

Router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(async (req,res,)=>{
    const { id, reviewId} = req.params;
    await Review.findByIdAndDelete(req.params.reviewId);
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndUpdate(reviewId);
    req.flash('success','successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = Router;