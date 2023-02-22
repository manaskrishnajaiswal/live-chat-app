import express from "express";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import dotenv from "dotenv";
dotenv.config();

import connectDB from "./config/db.js";

///////////////////////////////////////start-mongodb-mongoose-connection-code/////////////////////////////////////////////////////////////////////////
connectDB();
///////////////////////////////////////end-mongodb-mongoose-connection-code/////////////////////////////////////////////////////////////////

/// express server configuration
const app = express();
app.use(express.json());
app.use(
  session({
    secret: "melody hensley is my spirit animal",
    resave: true,
    saveUninitialized: true,
  })
);

// Body parser
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const port = process.env.PORT || 5000;

app.use(notFound);
app.use(errorHandler);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Root route
app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
