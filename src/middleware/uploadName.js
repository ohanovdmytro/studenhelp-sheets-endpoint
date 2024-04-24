const { fs } = require("fs").promises;

async function uploadName(req, res) {
  try {
    const { name } = req.body;

    const queueFilePath = "storage/cache.json";
    const existingData = await fs.readFile(queueFilePath, "utf8");
    const queue = JSON.parse(existingData);

    queue.push({ name });

    await fs.writeFile(queueFilePath, JSON.stringify(queue, null, 2));

    res.status(200).json({ message: `Name ${name} written to cache` });
  } catch (error) {
    console.error("Error writing name to cache:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { uploadName };
