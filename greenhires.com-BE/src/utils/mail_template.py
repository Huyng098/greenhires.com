def generate_verification_email(user_name: str, verification_link: str, code: int):
    return f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">

        <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
            <h2 style="color: rgb(47, 86, 107);">Verify Your Email Address</h2>

            <p>Hi <strong>{user_name}</strong>,</p>

            <p>Thank you for registering with us! To complete your registration, please verify your email address by either using the verification code below or clicking the link:</p>

            <p style="text-align: center; font-size: 18px; color: rgb(47, 86, 107);">
                <strong>{code}</strong>
            </p>

            <p style="text-align: center;">
                <a href="{verification_link}" style="background-color: rgb(47, 86, 107); color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Click here to verify your email</a>
            </p>

            <p>If the above link doesn't work, copy and paste the following URL into your browser:</p>

            <p style="word-break: break-all;">
                <a href={verification_link}>
                    {verification_link}
                </a>
            </p>

            <p>If you didn’t create an account with us, please ignore this email.</p>

            <p>Thank you,</p>
            <p>The <strong>GreenHires Team</strong></p>
        </div>

    </body>
    </html>
    """

