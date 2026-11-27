const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");
const EventEmitter = require("node:events");
const zlib = require("node:zlib");
const { pipeline } = require("node:stream");

// 1. Log current file path and directory
function logCurrentPath() {
  console.log({ File: __filename, Dir: __dirname });
}
// logCurrentPath();

// 2. Return file name from a file path
function logCurrentFileName() {
  return path.basename(__filename);
}
// console.log(logCurrentFileName());

// 3. Build a path from an object
function buildCurrentPath() {
  const pathObj = path.parse(__filename);
  return path.format(pathObj);
}
// console.log(buildCurrentPath());

// 4. Return file extension from a file path
function getCurrentFileExtension() {
  return path.extname(__filename);
}
// console.log(getCurrentFileExtension());

// 5. Parse path and return its name and ext
function parseCurrentNameAndExt() {
  const parsed = path.parse(__filename);
  return { Name: parsed.name, Ext: parsed.ext };
}
// console.log(parseCurrentNameAndExt());

// 6. Check whether a given path is absolute
function isCurrentPathAbsolute() {
  return path.isAbsolute(__filename);
}
// console.log(isCurrentPathAbsolute());;

// 7. Join multiple segments
function joinSegments(...segments) {
  return path.join(...segments);
}
// console.log(joinSegments(__dirname, "src", "components", "App.js"));

// 8. Resolve a relative path to an absolute one
function resolveToAbsolute(relativePath) {
  return path.resolve(relativePath);
}
// console.log(resolveToAbsolute(path.basename(__filename)));

// 9. Join two paths
function joinTwoPaths(path1, path2) {
  return path.join(path1, path2);
}
// console.log(joinTwoPaths("/folder1", "folder2/file.txt"));

// 10. Delete a file asynchronously
function deleteFileAsync(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err.message);
      return;
    }
    console.log(`The ${path.basename(filePath)} is deleted.`);
  });
}
// deleteFileAsync(path.join(__dirname, "delet.txt"));

// 11. Create a folder synchronously
function createFolderSync(folderPath) {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  return "Success";
}
// console.log(createFolderSync("./newFolder"));

// 12. Event emitter listening for "start" event
const emitter = new EventEmitter();

emitter.on("start", () => {
  console.log("Welcome event triggered!");
});
// emitter.emit("start");

// 13. Emit a custom "login" event with a username parameter
emitter.on("login", (username) => {
  console.log(`User logged in: ${username}`);
});
// emitter.emit("login", "Ahmed");

// 14. Read a file synchronously and log its contents
function readFileSyncAndLog(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  console.log(`the file content => "${content}"`);
}
// readFileSyncAndLog(path.join(__dirname, "notes.txt"));

// 15. Write asynchronously to a file
function writeFileAsync(filePath, content) {
  fs.writeFile(filePath, content, "utf-8", (err) => {
    if (err) {
      console.error("Error writing file:", err.message);
      return;
    }
    console.log("File saved asynchronously.");
  });
}
// writeFileAsync("./async.txt", "Async save");

// 16. Check if a directory or path exists
function checkExists(targetPath) {
  return fs.existsSync(targetPath);
}
// console.log(checkExists("./notes.txt"));

// 17. Return OS platform and CPU architecture
function getSystemInfo() {
  return {
    Platform: os.platform(),
    Arch: os.arch(),
  };
}
// console.log(getSystemInfo());

// 18. Use a readable stream to read a file in chunks and log each chunk
function readInChunks(filePath) {
  const readStream = fs.createReadStream(filePath, {
    encoding: "utf-8",
    highWaterMark: 16 * 1024,
  });

  readStream.on("data", (chunk) => {
    console.log("Chunk:", chunk);
  });

  readStream.on("end", () => {
    console.log("Finished reading file.");
  });

  readStream.on("error", (err) => {
    console.error("Stream error:", err.message);
  });
}
// readInChunks(path.join(__dirname, "big.txt"));

// 19. Use readable and writable streams to copy content from one file to another
function copyFileWithStreams(sourcePath, destPath) {
  const readStream = fs.createReadStream(sourcePath);
  const writeStream = fs.createWriteStream(destPath);

  readStream.pipe(writeStream);

  writeStream.on("finish", () => {
    console.log("File copied using streams");
  });

  readStream.on("error", (err) => {
    console.error("Read error:", err.message);
  });

  writeStream.on("error", (err) => {
    console.error("Write error:", err.message);
  });
}
// copyFileWithStreams(path.join(__dirname, "source.txt"),path.join(__dirname, "dest.txt"));

// 20. Create a pipeline that reads a file, compresses it, and writes it to another file
function compressFile(inputPath, outputPath) {
  const readStream = fs.createReadStream(inputPath);
  const gzip = zlib.createGzip();
  const writeStream = fs.createWriteStream(outputPath);

  pipeline(readStream, gzip, writeStream, (err) => {
    if (err) {
      console.error("Pipeline failed:", err.message);
    } else {
      console.log("File compressed successfully.");
    }
  });
}
// compressFile(path.join(__dirname, "data.txt"),path.join(__dirname, "data.txt.gz"));
