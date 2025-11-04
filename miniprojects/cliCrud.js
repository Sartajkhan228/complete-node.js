import chalk from 'chalk'
import readline from 'readline'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const todoData = []

export const showMenu = () => {

    console.log(chalk.bgBlue.gray('\n 1: Add task'))
    console.log(chalk.bgGray.green("2:View task"))
    console.log(chalk.bgMagenta.bold("3: Exit"))

    rl.question("\nChose an option:", handleInput)

}

const handleInput = (option) => {

    if (option === "1") {
        rl.question("Add any task:", (task) => {
            todoData.push(task)
            console.log(chalk.green("Task added"), task);
            showMenu();
        })
    } else if (option === "2") {
        console.log("\nTask list")
        todoData.forEach((item, index) => {
            console.log(`${index + 1}, ${item}`);
        })
        showMenu();
    } else if (option === "3") {
        console.log("Good Bye")
        rl.close()
    } else {
        console.log(chalk.red("Please select options from 1 to 3"))
        showMenu();
    }
}

showMenu()

