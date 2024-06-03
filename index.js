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
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

dotenv.config();
const PORT = process.env.PORT || 4000;
const isProduction = process.env.NODE_ENV === 'production';

// Connect to the database
dbConnect();

// Enable CORS
app.use(
  cors({
    origin: ["https://codesmasher.in", "https://www.codesmasher.in", "http://localhost:3000"],
    credentials: true,
  })
);

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
app.use(helmet());

// Logging HTTP requests
app.use(morgan(isProduction ? 'combined' : 'dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Define routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/post", postRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/profile", profileRoutes);

// Root route
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

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    success: false,
    message: 'Something went wrong!',
    error: isProduction ? {} : err.message
  });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
