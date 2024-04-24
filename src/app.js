import express from "express";

import { uploadSubjects } from "./api/middleware/uploadSubjects.js";
import { uploadName } from "./api/middleware/uploadName.js";

import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

// app.get("/", (req, res) => res.send("Express on Vercel"));
// app.post("/uploadSubjects", uploadSubjects);
// app.post("/uploadName", uploadName);

app.listen(port, () => {
  console.log(`Server is running!`);
});
