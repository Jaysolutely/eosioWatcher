const http = require("http");
const fs = require("fs");
const { spawn } = require("child_process");
const { pathToLog, serverPort } = require("../settings.json");

let client = null;

spawn("./src/extractNonEmptyBlocks.sh", [pathToLog]).stdout.on(
  "data",
  (chunk) => {
    const block_num = parseInt(chunk.toString(), 10);
    if (client !== null) client.write(`data: ${block_num}\n\n`);
  }
);

const server = http.createServer((req, res) => {
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
});

server.listen(serverPort, () => {
  console.log(`Server running at port ${serverPort}`);
});
