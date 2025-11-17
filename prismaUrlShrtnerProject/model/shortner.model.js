import pkg from "@prisma/client"
const { PrismaClient } = pkg

const prisma = new PrismaClient()

export const loadLinks = async () => {

    const rows = await prisma.shorLink.findMany()
    return rows;
}


export const insertShortLink = async ({ url, shortCode }) => {

    const result = await prisma.shorLink.create({
        data: { shortCode: shortCode, url: url }
    })
    return result;
}


export const getLinkByShortCode = async (shortCode) => {

    const getUniqueData = await prisma.shorLink.findUnique({
        where: {
            shortCode: shortCode
        }
    })
    return getUniqueData
}