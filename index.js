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

dbConnect();

app.use(
  cors({
    origin: process.env.NODE_ENV === 'production' ? "https://your-netlify-site.netlify.app" : "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Cloudinary connection
cloudinaryConnect();

app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/profile", profileRoutes);

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: 'Your server is up and running....'
  });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
