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

export const updateProfileSchema = z.object({
    name: z.string().trim()
        .min(3, { message: "Name must be minimum of three characters" })
        .max(100, { message: "Name must be maximum of 100 characters" }),

    email: z.string().trim()
        .email({ message: "Email must be a valid email" })
        .max(100, { message: "Email cannot exceed more than 100 characters" })
});

export const linkValidationSchema = z.object({
    url: z.string()
        .url({ message: "Must be a valid url" })
        .trim(),
    shortCode: z.string()
        .trim()
        .min(3, { message: "Short code must be minimum of 3 characters" })
})

export const emailVerificationSchema = z.object({
    token: z.string()
        .trim()
        .length(8),
    email: z.string()
        .trim()
        .email()
});


export const changePasswordSchema = z.object({
    currentPassword: z.string().trim()
        .min(1, { message: "Current password must be minimum of 1 characters" }),

    newPassword: z.string().trim()
        .min(8, { message: "New password must be minimum of 8 characters" })
        .max(100, { message: "New password must be a maximum of 100 characters" }),
    confirmNewPassword: z.string().trim()
        .min(8, { message: "Confirm new password must be minimum of 8 characters" })
        .max(100, { message: "Confirm new password must be a maximum of 100 characters" }),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New password and confirm new password must match",
});


export const emailSchema = z.object({
    email: z.string().trim()
        .email({ message: "Must be a valid email" })
})

export const passwordTokenVerificationSchema = z.object({
    hashToken: z.string().trim(),
    email: z.string().trim().email()
})


const passwordSchema = z.object({
    password: z.string().trim()
        .min(8, { message: "Password must be minimum of 8 characters" })
        .max(100, { message: "Password must not exceed more than 100 characters" }),
    confirmPassword: z.string().trim()
        .min(8, { message: "Password must be minimum of 8 characters" })
        .max(100, { message: "Password must not exceed more than 100 characters" })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password and confirm password must match",
    path: ["confirmPassword"]
})


export const resetPasswordSchema = passwordSchema;
export const setPasswordSchema = passwordSchema;




