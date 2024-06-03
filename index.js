const express = require('express');
const app = express();
const dbConnect = require("./database/db");
const userRoutes = require("./Routes/User");
const postRoutes = require("./Routes/Post");
const commentRoutes = require("./Routes/Comment");
const profileRoutes = require("./Routes/Profile");
const cookieParser = require('cookie-parser');
const { cloudinaryConnect } = require("./database/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const PORT = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';

// Connect to the database
dbConnect();

// Enable CORS with specific origin
const allowedOrigins = ["https://codesmasher.in", "https://www.codesmasher.in", "http://localhost:3000"];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Enable file uploads
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Connect to Cloudinary
cloudinaryConnect();

app.use(express.json());
app.use(cookieParser());

// Define routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/profile", profileRoutes);

app.get("/", (req, res) => {
  const response = {
    success: true,
    message: 'Your server is up and running....'
  };

  // Log response only in non-production environments
  if (!isProduction) {
    console.log(response);
  }

  return res.json(response);
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
