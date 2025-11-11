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


console.log("database connected")

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
// USING PREPARED STATEMENT(THIS IS BEST PRACTICE)

// await db.execute(`insert into users(name,email) values(?, ?)`, ["Sartaj", "sartaj@gmail.com"])
// await db.execute(`insert into users(name,email) values(?, ?)`, ["any", "any@gmail.com"])

// one or many

const values = [
    ["Adam", "adam@gmail.com"],
    ["Adeel", "adeel@gmail.com"],
    ["Anees", "anees@gmail.com"],
    ["Asif", "asif@gmail.com"],
    ["Aqib", "aqib@gmail.com"],

]

// await db.query(`insert into users(name,email) values ?`, [values])


// TO READ DATABASE DATA:

const [rows] = await db.execute('select * from users')
// const [rows] = await db.execute('select * from users where name="Adam"')

console.log(rows)

// const [rows, field] = await db.execute('select * from users')
// console.log(field)

// TO UPDATE DATABASE DATA

// update table_name
// set column2 = value1, column2 = value2
// where condition

// try {

//     const [rows] = await db.execute(
//         "update users set name='Adeel Ali' where email='adeel@gmail.com'"
//     )
//     console.log("rows data", rows)
// } catch (error) {
//     console.log("User update error", error)
// }

// RECOMMENDED WAY:
// try {

//     const [rows] = await db.execute(
//         "update users set name=? where email=?", ["Anees Ali", "anees@gmail.com"]
//     )
//     console.log("rows data", rows)
// } catch (error) {
//     console.log("User update error", error)
// }


// TO DELETE DATA
// delete from table_name
// where condition

// try {
//     await db.execute("delete from users where name='any'")
// } catch (error) {
//     console.log(error)
// }

// RECOMMENDED WAY:

// try {
//     await db.execute("delete from users where email=?", ["any@gmail.com"])
// } catch (error) {
//     console.log(error)
// }

