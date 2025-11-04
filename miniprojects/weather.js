import readline from 'readline/promises'
import chalk from 'chalk';

const API_KEY = '58a50ea4ba45fb3464d7b03c6173225d'
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

export const getWeather = async (city) => {
    const url = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("City not found. Please check the city name");
        }
        const data = await response.json();
        console.log("\nWeather informmation")
        console.log(`City: ${data.name}`)
        console.log(`Temperature: ${data.main.temp}◦c`)
        console.log(`Description: ${data.weather[0].description}`)
        console.log(`Humidity: ${data.main.humidity}%`)
        console.log(`Wind speed: ${data.wind.speed}m/s\n`)

    } catch (error) {
        console.error(chalk.red("❌ Error getting weather"), error.message)
    }

}

const city = await rl.question("Enter a city name to get it's weather:")
await getWeather(city);
rl.close();