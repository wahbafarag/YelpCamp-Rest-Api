const Campground = require("../models/camps");
const cities = require("./cities");
const { places, descriptors } = require("./seedsHelpers");
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo Connection Opened");
  })
  .catch((err) => {
    console.log("Mongo Connection error : " + err);
  });

const db = mongoose.connection;
db.on(
  "error",
  console.error.bind(console, "Error , Failed to connect the Database ")
);
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30) + 1;
    const newCamp = new Campground({
      author: "635671e67964bd96122e7507",
      location: `${cities[random1000].city} , ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/483251",
      description:
        "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum necessitatibus consequuntur debitis esse assumenda ratione labore libero iure corrupti repellendus magnam velit, error, dolorum ipsa quis aspernatur repudiandae deserunt? Amet.",
    });
    await newCamp.save();
  }
};

seedDb().then(() => {
  mongoose.connection.close();
});
