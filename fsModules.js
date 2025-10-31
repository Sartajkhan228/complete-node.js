import { promises as fs } from 'fs';

const fileName = 'example.txt';
// Asynchronous write

export const writeFile = async () => {
    try {
        const data = await fs.writeFile(fileName, 'This is an example file created using fs module in Node.js the text is updated due to write file', 'utf8');
        console.log("updated file", data)
    } catch (error) {
        console.log("Error", error)
    }
}
await writeFile();

export const readFile = async () => {
    try {
        const data = await fs.readFile(fileName, 'utf8');
        console.log("File content:", data);
    } catch (error) {
        console.log("Error", error)
    }
}

await readFile();

export const updateFile = async () => {
    try {
        const data = await fs.appendFile(fileName, '\nAppended content to the file.', 'utf8');
        console.log("Appended file", data)
    } catch (error) {
        console.log("Error", error)
    }
}
await updateFile();

// export const deleteFile = async () => {
//     try {
//         const data = await fs.unlink(fileName);
//     } catch (error) {
//         console.log("Error", error)
//     }
// }
// await deleteFile();
