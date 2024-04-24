const { google } = require("googleapis");
require("dotenv").config();

async function uploadName(req, res) {
  try {
    const { name } = req.body;
    

    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const SPREADSHEET_ID = process.env.SHEET_ID;
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

    res.status(200).json({
      message: `Name ${name} written to Google Sheets successfully`,
    });
  } catch (error) {
    console.error("Error writing name to cache:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { uploadName };
