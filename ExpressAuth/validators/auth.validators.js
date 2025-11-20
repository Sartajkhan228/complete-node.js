import z from "zod";

export const loginUserSchema = z.object({
    email: z.string()
        .trim()
        .email({ message: "Must be valid email" })
        .max(100, { message: "Email cannot exceed more than 100 characters" }),
    password: z.string().trim()
        .min(8, { message: "Password must be minimum of 8 characters" })
        .max(100, { message: "Password must be a maximum of 100 characters" })
});

export const registerUserSchema = loginUserSchema.extend({

    name: z.string().trim()
        .min(3, { message: "Name must be minimum of three characters" })
        .max(100, { message: "Name must be maximum of 100 characters" }),

    // email: z.string().trim()
    //     .email({ message: "Email must be a valid email" }),
    // password: z.string()
    //     .trim()
    //     .min(8, { message: "Password must be minumum of 8 characters" })
    //     .max(100, { message: "Password must be a maximum of 100 characters" })

});



export const linkValidationSchema = z.object({
    url: z.string()
        .url({ message: "Must be a valid url" })
        .trim(),
    shortCode: z.string()
        .trim()
        .min(3, { message: "Short code must be minimum of 3 characters" })
})




