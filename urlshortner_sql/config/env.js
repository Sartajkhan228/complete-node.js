

import { z } from "zod"
import dotenv from "dotenv"


dotenv.config();

const envSchema = z.object({

    DATABASE_HOST: z.string().min(1),
    DATABASE_USER: z.string().min(1),
    DATABASE_PASSWORD: z.string().min(1),
    DATABASE_NAME: z.string().min(1),
    PORT: z.string().default("3005"),

})

export const env = envSchema.parse(process.env);