import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config()

const pasKey = process.env.DATABASE_PASSWORD

const db = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: pasKey,
    database: "mysql_db"
})


console.log("data base connected")

// to create database
// await db.execute(`create database mysql_db`)

// console.log(await db.execute("show databases"))

// TO CREAT TABLE ===
// await db.execute(`
//     create table users(
//         id int auto_increment primary key,
//         name varchar(100) not null,
//         email varchar(100) not null unique
//     );
// `)

// TO INSERT DATA IN TABLE 
await db.execute(`

    insert into users(name,email) values
    ("Adam","adam@gmail.com"),
    

`)

