require("dotenv").config();

const express = require("express");
const cors = require("cors");
const routes = require("./routes/index.route");
const mongoose = require("mongoose");
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocs = YAML.load("./swagger.yaml");

const { MONGO_URL, API_PORT } = process.env;

const app = express();
const PORT = API_PORT;

app.use(express.json());
app.use(cors());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

mongoose.connect(MONGO_URL).catch((err) => {
  if (err) {
    console.log("Error connecting to MongoDB");
    throw err;
  }
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

module.exports = app;
