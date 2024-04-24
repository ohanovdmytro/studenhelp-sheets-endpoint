const { google } = require("googleapis");
require("dotenv").config();

const {
  deleteNameFromQueue,
  getNameFromQueue,
} = require("../helpers/utils.js");

async function uploadSubjects(req, res) {
  try {
    const { subject } = req.body;
    const name = await getNameFromQueue();

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

    const subjectData = subject.map((sub) => [sub]);
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!${nextColumnLetter}2`,
      valueInputOption: "RAW",
      resource: {
        values: subjectData,
      },
    });

    await deleteNameFromQueue();

    res.status(200).json({
      message: "Data written to Google Sheets successfully",
      name: name,
    });

    console.log(`Subjects from ${name} sent to GS`);
  } catch (error) {
    console.error("Error writing data to Google Sheets:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  uploadSubjects,
};
