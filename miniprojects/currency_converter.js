import https from 'https'
import readline from 'readline'
import chalk from 'chalk'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const apiKey = process.env.CURRENCY_CONVERTER_API_KEY
const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`

export const fetchApi = () => {
    https.get(url, (response) => {
        let data = ""

        response.on('data', (chunk) => {
            data += chunk
        })

        response.on('end', () => {
            const result = JSON.parse(data)
            const rates = result.conversion_rates

            rl.question("Write your amount: ", (amount) => {
                rl.question("Write your currency (e.g. PKR, EUR, INR, NPR): ", (currency) => {
                    const rate = rates[currency.toUpperCase()]

                    if (!rate) {
                        console.log(chalk.red(`❌ Invalid currency code: ${currency}`))
                        rl.close()
                        return
                    }

                    const inputAmount = Number(amount)
                    if (isNaN(inputAmount)) {
                        console.log(chalk.red(`❌ Invalid amount: ${amount}`))
                        rl.close()
                        return
                    }

                    const total = inputAmount * rate
                    console.log(
                        chalk.green(`✅ ${inputAmount} USD = ${total.toFixed(2)} ${currency.toUpperCase()}`)
                    )

                    rl.close()
                })
            })
        })

        response.on('error', (error) => {
            console.log(chalk.red(`❌ Error fetching data: ${error.message}`))
        })
    })
}
