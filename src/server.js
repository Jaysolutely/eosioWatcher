const http = require("http");
const fs = require("fs");
const { spawn } = require("child_process");
const { pathToLog, serverPort } = require("../mySettings.json");

let client = null;

const child = spawn("./src/extractNonEmptyBlocks.sh", [pathToLog]);
child.stdout.on("data", (chunk) => {
  const block_num = parseInt(chunk.toString(), 10);
  if (client !== null) client.write(`data: ${block_num}\n\n`);
});
child.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});
child.on("close", (code) => {
  console.log(`extractNonEmptyBlocks process exited with code ${code}`);
});

const server = http.createServer((req, res) => {
  if (req.url === "/blocks") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    });
    client = res;
    req.on("close", () => {
      console.log(`client connection closed`);
      client = null;
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(serverPort, () => {
  console.log(`Server running at port ${serverPort}`);
});
