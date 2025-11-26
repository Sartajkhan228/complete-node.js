import nodemailer from "nodemailer";

const testAccount = await nodemailer.createTestAccount();

// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "abbey36@ethereal.email",
        pass: "R2SzRTGnzbR2zkCg88",
    },
});

// Wrap in an async IIFE so we can use await.
// (async () => {
//     const info = await transporter.sendMail({
//         from: '"Maddison Foo Koch" <abbey36@ethereal.email>',
//         to: "bar@example.com, baz@example.com",
//         subject: "Hello ✔",
//         text: "Hello world?",
//         html: "<b>Hello world?</b>",
//     });

//     console.log("Message sent:", info.messageId);
// })();

export const sendEmail = async ({ to, subject, html }) => {

    const info = await transporter.sendMail({
        from: `URL SHORTENER <${testAccount.user}>`,
        to,
        subject,
        html
    })
    const testEmailURL = nodemailer.getTestMessageUrl(info);
    console.log("Verify email:", testEmailURL);

}
