import { EventEmitter } from "events";
import { promises as fs } from "fs";

const eventEmitter = new EventEmitter();

let eventCounts = {
    "user-login": 0,
    "user-purchase": 0,
    "profile-update": 0,
    "user-logout": 0
}

const dataFile = 'eventCounts.json';

try {
    const fileData = await fs.readFile(dataFile, 'utf-8')
    eventCounts = JSON.parse(fileData);
    console.log("File data", fileData)

} catch (error) {
    console.log("No existing file data");
    await fs.writeFile(dataFile, JSON.stringify(eventCounts, null, 2), 'utf-8')
}

const saveEventCounts = async () => {
    try {
        const data = await fs.writeFile(dataFile, JSON.stringify(eventCounts, null, 2), 'utf-8')
        console.log("File created successfully")
    } catch (error) {
        console.log("Error creating file", error)
    }
}

eventEmitter.on("user-login", async (user) => {
    eventCounts["user-login"]++;
    await saveEventCounts();
    console.log(`${user.username} logged in successfully`);
})

eventEmitter.on("user-purchase", async (user) => {
    eventCounts["user-purchase"]++;
    await saveEventCounts()
    console.log(`User made a purchase of ${user.productPurchase} successfully`);
})

eventEmitter.on("profile-update", async (user) => {
    eventCounts["profile-update"]++;
    await saveEventCounts()
    console.log(`User updated ${user.profileUpdate} successfully`);
})

eventEmitter.on("user-logout", async (user) => {
    eventCounts["user-logout"]++;
    await saveEventCounts()
    console.log(`${user.username} logged out successfully`);
})

eventEmitter.on("summary-event", () => {
    console.log("data", eventCounts);
})

export default eventEmitter;
