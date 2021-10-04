import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";

import createRoutes from "./routes/index.js";

const port = process.env.PORT;
const app = new express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

createRoutes(app);

app.listen(port, () => {
    console.log(`INFO: Listening on port ${port}`);
});
