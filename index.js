const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

// Load the environment variables from .env
dotenv.config();

const db = require("./modules/db"); // Load db.js with artist and artwork functions

// Set up the Express app
const app = express();
const port = process.env.PORT || "8888";

// Set up application template engine
app.set("views", path.join(__dirname, "views")); // Path to views
app.set("view engine", "pug");

// Set up folder for static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Home route to display artists and artworks
app.get("/", async (request, response) => {
  const artistList = await db.getArtists();  // Get list of artists
  const artworkList = await db.getArtworks();  // Get list of artworks

  if (!artistList.length || !artworkList.length) {
    await db.initializeData();  // Initialize data if empty
  }

  response.render("index", { artists: artistList, artworks: artworkList });
});

// Route to add an artist
app.post("/add-artist", async (request, response) => {
  const { name, bio, email } = request.body;  // Get data from form
  const newArtist = await db.addArtist(name, bio, email);  // Add artist to DB
  response.json({ message: "Artist added successfully", artist: newArtist });  // Return JSON response
});

// Route to add an artwork
app.post("/add-artwork", async (request, response) => {
  const { title, description, year } = request.body;  // Get data from form
  const newArtwork = await db.addArtwork(title, description, year);  // Add artwork to DB
  response.json({ message: "Artwork added successfully", artwork: newArtwork });  // Return JSON response
});

// Set up server listening
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});