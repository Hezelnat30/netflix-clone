const express = require("express");
const app = express();
const cors = require("cors");
const { ERR, OK } = require("./utils/response");

app.use(cors());
const PORT = 3001;
app.use(express.json());

app.get("/", (req, res) => {
  const data = {
    isRunning: true,
    serverVersion: "1.0.0",
  };
  OK(res, 200, data, "Success getting server main endpoint");
});

// Melihat list favorit movies
app.get("/my-movies", (req, res) => {
  console.log("api movies di hit");
  const data = {
    id: 1,
    title: "Movie 1",
    description: "Description 1",
    genre: "Horror",
    years: "2020",
  };
  OK(res, 200, data, "Success getting list favorite movies");
});

// Menambah favorit movies
app.post("/my-movies", (req, res) => {
  console.log("Insert new favorite movies");
  const data = req.body;
  console.log({ data });
  res.status(201).json({ message: "success" });
});

// Menghapus favorit movies
app.delete("/my-movies/:id/:token", (req, res) => {
  console.log("Delete favorite movies");
  const { id, token } = req.params;
  console.log({ id, token });
  res.status(204).json({ message: "success" });
});

// Menambah data user untuk verifikasi sistem
app.post("/token", (req, res) => {
  console.log("creating user token to database");
  const { token } = req.body;
  console.log({ token });
  res.status(201).json({ message: "token created" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
