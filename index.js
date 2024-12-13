const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables
dotenv.config();

const db = require("./modules/db");

const app = express();
const port = process.env.PORT || 8888;

// Middlewares
app.use(cors({ origin: 'http://localhost:5173', methods: ['GET', 'POST'] }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Template Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Routes
app.get("/", async (req, res) => {
  try {
    const artistList = await db.getArtists();
    const artworkList = await db.getArtworks();
    if (!artistList.length || !artworkList.length) await db.initializeData();
    res.render("index", { artists: artistList, artworks: artworkList });
  } catch (error) {
    res.status(500).send("Error loading data");
  }
});

app.get("/artist", async (req, res) => {
  try {
    const artistList = await db.getArtists();
    if (!artistList.length) await db.initializeData();
    res.status(200).json({ message: "Artist List", artists: artistList });
  } catch (error) {
    res.status(500).json({ message: "Error fetching artists", error });
  }
});

app.get("/artwork", async (req, res) => {
  try {
    const artworkList = await db.getArtworks();
    if (!artworkList.length) await db.initializeData();
    res.status(200).json({ message: "Artwork List", artworks: artworkList });
  } catch (error) {
    res.status(500).json({ message: "Error fetching artworks", error });
  }
});

app.post("/add-artist", async (req, res) => {
  try {
    const { name, bio, email } = req.body;
    const newArtist = await db.addArtist(name, bio, email);
    res.status(201).json({ message: "Artist added successfully", artist: newArtist });
  } catch (error) {
    res.status(500).json({ message: "Error adding artist", error });
  }
});

app.post("/add-artwork", async (req, res) => {
  try {
    const { title, description, year } = req.body;
    const newArtwork = await db.addArtwork(title, description, year);
    res.status(201).json({ message: "Artwork added successfully", artwork: newArtwork });
  } catch (error) {
    res.status(500).json({ message: "Error adding artwork", error });
  }
});

// Start Server
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
