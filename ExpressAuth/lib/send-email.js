import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to,
            subject,
            html
        })

        if (error) {
            console.error("Email sending error:", error);
        } else {
            console.log("Email sent successfully:", data);
        }
        return data;

    } catch (error) {
        console.error(error)
    }
}