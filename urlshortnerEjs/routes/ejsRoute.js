import express from 'express'

export const ejsRouter = express.Router();


ejsRouter.get("/reports", (req, res) => {
    // res.send("Yes it's working")

    const stdDetails = [
        { name: "Sartaj Ali", class: 10, favoriteSub: "Mathematics" },
        { name: "Ahsan Khan", class: 9, favoriteSub: "Physics" },
        { name: "Laiba Ahmed", class: 8, favoriteSub: "English" },
        { name: "Hamza Tariq", class: 10, favoriteSub: "Computer Science" },
        { name: "Zara Fatima", class: 7, favoriteSub: "Biology" },
        { name: "Bilal Hussain", class: 9, favoriteSub: "Chemistry" },
        { name: "Hassan Ali", class: 10, favoriteSub: "Mathematics" },
        { name: "Maryam Akhtar", class: 8, favoriteSub: "History" },
        { name: "Usman Raza", class: 7, favoriteSub: "Geography" },
        { name: "Aiman Noor", class: 9, favoriteSub: "Urdu" },
        { name: "Taha Siddiqui", class: 10, favoriteSub: "Physics" },
        { name: "Fatima Qureshi", class: 8, favoriteSub: "Islamiyat" },
        { name: "Ali Rehman", class: 7, favoriteSub: "Science" },
        { name: "Eman Saleem", class: 9, favoriteSub: "Mathematics" },
        { name: "Sana Iqbal", class: 10, favoriteSub: "Computer Science" }
    ]

    res.render("report", { stdDetails })
})