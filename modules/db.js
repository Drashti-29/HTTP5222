const mongoose = require("mongoose");
const express = require('express');
const router = express.Router();

// Connection URL for MongoDB (using environment variables)
const dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PWD}@${process.env.DB_HOST}`;

// Define Schemas and Models
const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bio: { type: String, required: true },
  email: { type: String, required: true }
}, { collection: "artist" });

const artworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  year: { type: Number,required: true  }
}, { collection: "artwork" });

const Artist = mongoose.model("artist", artistSchema);
const Artwork = mongoose.model("artwork", artworkSchema);

// MongoDB Functions
async function connect() {
  try {
    await mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

// Function to initialize collections with sample data
async function initializeData() {
  await connect();

  const artists = [
    {
      name: "Drashti Pokiya",
      bio: "Drashti Pokiya is an interactive artist and web developer specializing in installations that blend digital and physical experiences. Her work often incorporates technology, using sensors, animations, and user interactions.",
      email: "d@gmail.com"
    },
    {
      name: "Heer Vaghela",
      bio: "Heer Vaghela is a contemporary painter who creates abstract art inspired by nature and human emotions. She uses vibrant colors and textures to evoke feelings of serenity and introspection.",
      email: "h@gmail.com"
    }
  ];

  const artworks = [
    {
      title: "Echoes of Nature",
      description: "A digital installation that simulates the sounds and visuals of a forest, allowing users to interact with the environment through motion sensors.",
      year: 2024
    },
    {
      title: "Serene Waves",
      description: "An abstract painting representing the calming effect of ocean waves. The artwork is made with mixed media, combining acrylic and ink to create intricate wave patterns.",
      year: 2023
    }
  ];

  await Artist.insertMany(artists);
  await Artwork.insertMany(artworks);
}

// Admin Routes
async function getArtists() {
  await connect(); // Ensure the database is connected
  return await Artist.find({}).sort({ name: 1 }); // Sort by 'name' in ascending order
}
async function getArtworks() {
  await connect(); // Ensure the database is connected
  return await Artwork.find({}).sort({ year: 1 }); // Sort by 'dateCreated' in ascending order
}

async function addArtist(name, bio, email) {
  await connect();
  const artist = new Artist({ name, bio, email });
  await artist.save();
  return artist; // Return the newly created artist
}

// Add an artwork and return the created artwork
async function addArtwork(title, description, year) {
  await connect();
  const artwork = new Artwork({ title, description, year });
  await artwork.save();
  return artwork; // Return the newly created artwork
}

// Export the router and function
module.exports = {
  router,       // The Express router
  initializeData,
  getArtists,   // The function to get artists
  getArtworks,   // The function to get artworks
  addArtwork,
  addArtist
};