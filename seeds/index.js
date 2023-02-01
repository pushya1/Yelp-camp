const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities.js');
const {places,descriptors} = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{});
const db = mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Database connected");
})

const sample = array => array[Math.floor(Math.random()*array.length)];


const seedDb = async () =>{
    await Campground.deleteMany({});
    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*30)+10;
        const camp = new Campground({
            author: '63d6402683ed075f5ee7c76f',
            location: `${cities[random1000].city},${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'This is even not a text may be I can use lorem ipusm but I used the reason hope you will not hate',
            price,
            images: [
                {
                    url: 'https://res.cloudinary.com/dzh00tnpb/image/upload/v1675272147/YELPCAMP/qnd28uwms8wlhiipqyyc.jpg',
                    filename: 'YELPCAMP/qnd28uwms8wlhiipqyyc'
                },
                {
                    url: 'https://res.cloudinary.com/dzh00tnpb/image/upload/v1675272151/YELPCAMP/zvlcl2r5dx2nioeybo0q.jpg',
                    filename: 'YELPCAMP/zvlcl2r5dx2nioeybo0q'
                }
            ]
        })
        await camp.save();
    }
}

seedDb().then(()=>{
    mongoose.connection.close();
});