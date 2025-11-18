import 'dotenv/config';
import { drizzle } from "drizzle-orm/mysql2";
import { eq } from 'drizzle-orm';
import { usersTable } from './db/schema';

const db = drizzle(process.env.DATABASE_URL!);

const main = async () => {

    // TO CREATE NEW USER

    const user: typeof usersTable.$inferInsert = {
        name: "Adam",
        age: 30,
        email: "adam@gmail.com"
    };
    await db.insert(usersTable).values(user)
    console.log("New user created")


    // TO GET USERS

    const users = await db.select().from(usersTable)
    console.log("Getting all users from database", users)


    // TO UPDATE USERS

    await db.update(usersTable)
        .set({
            age: 31
        })
        .where(eq(usersTable.email, user.email));
    console.log("User info updated")

    // TO DELETE USERS

    await db.delete(usersTable).where(eq(usersTable.email, user.email));
    console.log("user deleted")
}
main()




