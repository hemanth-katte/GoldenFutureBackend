const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
require("dotenv").config();
const session = require("express-session");
const cors = require("cors");
const path = require("path");
const https = require("https");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(
  session({
    secret: "OIUHDJFK567432KJPOH",
    resave: false,
    saveUninitialized: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", routes);

// // Server listening
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server is running at http://0.0.0.0:${PORT}`);
// });


const sslOptions = {
  key: fs.readFileSync(path.resolve(__dirname, '/home/karthik/GoldenFutureLifeBackend/goldenfuturelife_com.key')),
  cert: fs.readFileSync(path.resolve(__dirname, '/home/karthik/GoldenFutureLifeBackend/goldenfuturelife.crt')),
  ca: fs.readFileSync(path.resolve(__dirname, '/home/karthik/GoldenFutureLifeBackend/goldenfuturelife_com.ca-bundle')),
};

const server = https.createServer(sslOptions, app);

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Server is running at https://127.0.0.1:${PORT}`);
});
