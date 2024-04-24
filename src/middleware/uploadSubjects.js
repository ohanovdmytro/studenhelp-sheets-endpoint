const { google } = require("googleapis");
require("dotenv").config();

async function uploadSubjects(req, res) {
  try {
    const { subject } = req.body;

    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials.json",
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const SPREADSHEET_ID = process.env.SHEET_ID;
    const SHEET_NAME = "Предмети";

    const headerRange = `${SHEET_NAME}!1:1`;
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: headerRange,
    });

    const headers = headerResponse.data.values
      ? headerResponse.data.values[0]
      : [];

    let lastFilledIndex = headers.length;
    for (let i = headers.length - 1; i >= 0; i--) {
      if (headers[i]) {
        lastFilledIndex = i;
        break;
      }
    }

    const subjectData = subject.map((sub) => [sub]);

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!${String.fromCharCode(65 + lastFilledIndex)}2`,
      valueInputOption: "RAW",
      resource: {
        values: subjectData,
      },
    });

    res.status(200).json({
      message: `Subjects ${subject} written to Google Sheets successfully`,
    });
  } catch (error) {
    console.error("Error writing data to Google Sheets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { uploadSubjects };
