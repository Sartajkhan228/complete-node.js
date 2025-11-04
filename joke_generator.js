import https from 'https'
import chalk from 'chalk'


export const getJokes = () => {

    const url = "https://official-joke-api.appspot.com/random_joke"

    https.get(url, (response) => {
        let data = ""
        response.on('data', (chunk) => {
            data += chunk
        });
        response.on('end', () => {
            const joke = JSON.parse(data)
            console.log(`Here is a random ${joke.type} joke:`)
            console.log(chalk.bgBlue.gray(`${joke.setup}`));
            console.log(chalk.bgGray.green(`${joke.punchline}`))
        });
        response.on('error', (error) => {
            console.log(chalk.red(`Error fetchin jokes, ${error.message}`))
        });
    })
}

getJokes();

