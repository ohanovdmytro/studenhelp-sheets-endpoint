const express = require("express");
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(cors());

app.post("/send", async (req, res) => {
  try {
    const { name, subject } = req.body;

    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const SPREADSHEET_ID = "1gWBsURQMsk9JZ-OSEYju3voEhk-bhziywtxDfwHbxGI";
    const SHEET_NAME = "Предмети";

    const range = `${SHEET_NAME}!A1:ZZ1`;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range,
    });

    const values = response.data.values;
    let nextColumnIndex = values ? values[0].length : 0;
    const nextColumnLetter = String.fromCharCode(65 + nextColumnIndex); 

    const userData = [[name]];
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!${nextColumnLetter}1`,
      valueInputOption: "RAW",
      resource: {
        values: userData,
      },
    });

    const subjectData = subject.map((sub) => [sub]);
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!${nextColumnLetter}2`,
      valueInputOption: "RAW",
      resource: {
        values: subjectData,
      },
    });

    res.status(200).json({
      message: "Data written to Google Sheets successfully",
    });
  } catch (error) {
    console.error("Error writing data to Google Sheets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
