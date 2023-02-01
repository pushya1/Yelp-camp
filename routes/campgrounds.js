const express = require('express');
const Router = express.Router();
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');



Router.get('/',catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds});
}))
Router.get('/new',isLoggedIn,catchAsync((req,res)=>{
    res.render('campgrounds/new');
}))
Router.post('/',isLoggedIn,validateCampground, catchAsync(async(req,res,next)=>{
    //if(!req.body.campground) throw new ExpressError("Invalid campground Data",400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success','successfully made a new campground');
    res.redirect(`/campgrounds/${campground._id}`);
}))

Router.get('/:id',catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground);
    if(!campground){
        req.flash('error','cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground});
}));

Router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if(!campground){
        req.flash('error','cannot find that campground!');
        return res.redirect('/campgrounds');
    }  
    res.render('campgrounds/edit',{campground});
}))


Router.put('/:id',isLoggedIn,isAuthor,validateCampground,catchAsync(async(req,res)=>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground},{new: true});
    req.flash('success','Successfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}));

Router.delete('/:id',isLoggedIn,isAuthor,catchAsync(async(req,res)=>{
    const {id} = req.params;
    const { title } = await Campground.findByIdAndDelete(id);
    req.flash('success',` successfully deleted ${title} campground`);
    res.redirect('/campgrounds');
}))


module.exports = Router;
