import { createReadStream, createWriteStream } from "fs";
import path from "path";

const inputFileStream = path.join(import.meta.dirname, "input.txt");
const outputFileStream = path.join(import.meta.dirname, "output.txt");

const readableStream = createReadStream(inputFileStream, { encoding: "utf-8", highWaterMark: 16 });
const writeableStream = createWriteStream(outputFileStream);

readableStream.on("data", (chunk) => {
    console.log("Buffer (chunk):", Buffer.from(chunk));
    console.log("Received chunk:", chunk);
    writeableStream.write(chunk);
});

readableStream.on("end", () => {
    console.log("File read completed");
    writeableStream.end();
});

// You could also use pipe for simplicity:
// readableStream.pipe(writeableStream);

readableStream.on("error", (error) => console.log("Read Error:", error));
writeableStream.on("error", (error) => console.log("Write Error:", error));
