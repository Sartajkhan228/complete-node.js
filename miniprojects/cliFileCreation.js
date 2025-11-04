import readline from 'readline'
import { promises as fs } from 'fs'
import chalk from 'chalk'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

export const fileCreation = () => {
    rl.question("\n Name the file", (filename) => {
        rl.question("Write content in file : ", async (content) => {
            try {
                await fs.writeFile(`${filename}.txt`, content, "utf-8")
                console.log(chalk.green(`File ${filename}.txt created successfully`))
            } catch (error) {
                console.log(chalk.red("Error creating file"), error.message)
            }
            rl.close()
        })

    })
}


fileCreation();