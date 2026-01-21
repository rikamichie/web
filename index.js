// index.js
import express from "express";
import Parser from "rss-parser";
import cors from "cors";

const app = express();
const parser = new Parser();

app.use(cors()); // permitir CORS desde GitHub Pages

app.get("/feed", async (req, res) => {
  try {
    const feed = await parser.parseURL("https://rikamichie.substack.com/feed");
    res.json(feed);
  } catch (err) {
    console.error("Error al parsear feed:", err);
    res.status(500).json({ error: "No se pudo obtener el feed" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));