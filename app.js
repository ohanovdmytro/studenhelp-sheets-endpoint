const express = require("express");

const { uploadSubjects } = require("./src/middleware/uploadSubjects.js");
const { uploadName } = require("./src/middleware/uploadName.js");

const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => res.json({ message: "Hi from Vercel" }));
app.post("/uploadSubjects", uploadSubjects);
app.post("/uploadName", uploadName);

app.listen(port, () => {
  console.log(`Server is running!`);
});
