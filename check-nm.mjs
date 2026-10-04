import fs from "fs";

if (fs.existsSync("./node_modules")) {
  const items = fs.readdirSync("./node_modules");
  console.log(`node_modules exists with ${items.length} items`);
  console.log("Sample:", items.slice(0, 10));
} else {
  console.log("node_modules does not exist yet");
}

