import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { name, email, message } = await request.json();

        if (!name || !email || !message) {
            return Response.json({
                success: false,
                error: "All fields are required"
            }, { status: 400 });
        }

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: 'fariedrisky@gmail.com',
            subject: `New message from ${name} on fariesky.vercel.app`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            font-family: Roboto, Arial, sans-serif;
        }
        body {
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            padding: 24px;
            border-radius: 24px 24px 0 0;
            border: 1px solid #eee;
            background: #fff;

        }
        .content {
            background: #fff;
            padding: 24px;
            border: 1px solid #eee;
            border-radius: 0 0 28px 28px;
        }
        .field {
            margin-bottom: 20px;
            padding: 16px;
            border-radius: 24px;
            border: 1px solid #eee;
        }
        .label {
            font-weight: 500;
            color: #333;
            font-size: 16px;
            margin-bottom: 8px;
        }
        .value {
            color: #666;
            font-size: 15px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2 style="margin:0;font-weight:600;">New Contact Form Submission on fariesky.vercel.app</h2>
    </div>
    <div class="content">
        <div class="field">
            <div class="label">Name</div>
            <div class="value">${name}</div>
        </div>
        <div class="field">
            <div class="label">Email</div>
            <div class="value">${email}</div>
        </div>
        <div class="field">
            <div class="label">Message</div>
            <div class="value">${message}</div>
        </div>
    </div>
</body>
</html>`
        });

        return Response.json({
            success: true,
            message: "Email sent successfully"
        });

    } catch (error) {
        console.error("API error:", error);
        return Response.json({
            success: false,
            error: error instanceof Error ? error.message : "Failed to send email"
        }, { status: 500 });
    }
}
