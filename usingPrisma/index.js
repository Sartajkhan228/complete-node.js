import pkg from "@prisma/client"
const { PrismaClient } = pkg;

const prisma = new PrismaClient()


const main = async () => {

    // TO READ DATA :

    // const allUsers = await prisma.user.findMany()
    // console.log(allUsers)


    // TO INSERT SINGLE DATA :

    // const users = await prisma.user.create({
    //     data: {
    //         name: "Alice",
    //         email: "alice@gmail.com",
    //         posts: {
    //             create: { title: "Hello I am Alice" }
    //         },
    //         profile: {
    //             create: { bio: "I like to code" }
    //         },
    //     },


    // })
    // console.log(users)


    // TO INSERT MANY DATA

    const usersData = [
        {
            name: "Ameen",
            email: "ameen@gmail.com",
            posts: {
                create: { title: "Hello I am Alice" }
            },
            profile: {
                create: { bio: "I like to code" }
            },
        },
        {
            name: "Adam",
            email: "adam@gmail.com",
            posts: {
                create: { title: "Hello I am Adam" }
            },
            profile: {
                create: { bio: "I like to code" }
            },
        },
        {
            name: "Aim",
            email: "aim@gmail.com",
            posts: {
                create: { title: "Hello I am Aim" }
            },
            profile: {
                create: { bio: "I like to code" }
            },
        },
    ]

    // for (const userData of usersData) {
    //     const users = await prisma.user.create({ data: userData });
    //     console.log(users)
    // }

    // OR

    // Promise.all(usersData)
    //     .then((result) => {
    //         console.log(result)
    //     }).catch((error) => {
    //         console.log("Error", error)
    //     })
    // console.log(userData)

    // TO FIND COLUMS:

    // const uniqueData = await prisma.user.findUnique({
    //     where: { email: "adam@gmail.com" }
    // })

    // console.log(uniqueData)

    const dataToFind = await prisma.user.findUnique({
        where: {
            name: "Aim"
        }

    })
    console.log(dataToFind)


}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })



