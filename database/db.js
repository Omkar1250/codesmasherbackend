const mongoose = require("mongoose");

require("dotenv").config();

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("Database connection successful."))
    .catch((error) => {
        console.error("Issue while connecting to the database:", error.message);
        // Consider throwing the error or handling it in a different way
        // process.exit(1); // It's better to throw an error unless this is top-level error handling
        throw error; // This allows error handling to be managed more flexibly
    });
};

module.exports = dbConnect;