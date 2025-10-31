import express from 'express';
import add from './math.js';
import { subtract, multiply, divide, PI } from './math1.js';


const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
})

console.log(add(2, 4));
console.log(subtract(2, 4));
console.log(multiply(2, 4));
console.log(divide(2, 4));
console.log(PI);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})