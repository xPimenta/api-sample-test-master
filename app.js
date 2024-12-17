// require modules
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const cron = require("node-cron");

dotenv.config({ path: path.join(__dirname, ".env") });

const { MONGO_URI } = process.env;

const packageJson = require("./package.json");
process.env.VERSION = packageJson.version;

// mongoose connection
mongoose.set("strictQuery", false);
mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("connected to database");
        require("./Domain");

        // worker to run daily at midnight
        cron.schedule("0 0 * * *", () => {
            console.log("Running worker at midnight...");
            require("./worker")();
        });
    });

process.env.instance = "app";

// server setup
require("./server");
