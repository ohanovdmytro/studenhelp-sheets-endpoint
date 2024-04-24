const fs = require("fs").promises;

async function getNameFromQueue() {
  try {
    const queueFilePath = "storage/cache.json";
    const existingData = await fs.readFile(queueFilePath, "utf8");
    const queue = JSON.parse(existingData);
    if (queue.length === 0) {
      throw new Error("Cache is empty");
    }
    const name = queue[0].name;
    return name;
  } catch (error) {
    throw new Error("Error reading name from cache: " + error);
  }
}

async function deleteNameFromQueue() {
  try {
    const queueFilePath = "storage/cache.json";
    const existingData = await fs.readFile(queueFilePath, "utf8");
    let queue = JSON.parse(existingData);
    if (queue.length === 0) {
      throw new Error("Queue is empty");
    }
    queue = queue.slice(1);
    await fs.writeFile(queueFilePath, JSON.stringify(queue, null, 2));
  } catch (error) {
    throw new Error("Error deleting name from cache: " + error);
  }
}

module.exports = {
  deleteNameFromQueue,
  getNameFromQueue,
};
