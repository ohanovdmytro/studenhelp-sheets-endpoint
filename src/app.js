const express = require("express");

const { uploadSubjects } = require("./middleware/uploadSubjects.js");
const { uploadName } = require("./middleware/uploadName.js");

const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(cors());

app.post("/uploadSubjects", uploadSubjects);
app.post("/uploadName", uploadName);

app.listen(port, () => {
  console.log(`Server is running!`);
});
