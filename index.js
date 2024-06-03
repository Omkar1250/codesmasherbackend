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

// Connect to the database
dbConnect();

// Define allowed origins
const allowedOrigins = [
  "https://codesmasher.in",
  "https://www.codesmasher.in",
  "http://localhost:3000"
];

// Enable CORS for specified origins
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true, // Allow credentials (e.g., cookies, authorization headers)
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

// Test route to check if server is running
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: 'Your server is up and running....'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
