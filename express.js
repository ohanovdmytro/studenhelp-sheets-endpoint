const express = require("express");
const { sendToGS } = require("./src/middleware/sendToGS.js");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(cors());

app.post("/send", sendToGS);

app.listen(port, () => {
  console.log(`Server is running!`);
});
