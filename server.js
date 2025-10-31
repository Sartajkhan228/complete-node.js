import express from 'express';
import add from './math.js';


const app = express();

app.get('/', (req, res) => {
    res.send('Hello World!');
})

console.log(add(2, 4))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})