class ErrorCode:
    AUTHENTICATION_REQUIRED = "Authentication required."
    AUTHORIZATION_FAILED = "Authorization failed. User has no access."
    INVALID_TOKEN = "Invalid token."
    INVALID_CREDENTIALS = "Invalid credentials."
    EMAIL_TAKEN = "Email is already taken."
    REFRESH_TOKEN_NOT_VALID = "Refresh token is not valid."
    REFRESH_TOKEN_REQUIRED = "Refresh token is required either in the body or cookie."
    RESET_TOKEN_NOT_VALID = "Reset token is not valid."
    NOT_ENOUGH_PERMISSIONS = "Not enough permissions."
    EMAIL_VERIFIED = "Email is already verified."
    INVALID_OTP = "Invalid OTP."


reset_link_template = """
<html>
        <body>
            <p>Hello,<br>
                Who requested a new password for the following account on Green Hiring website:</p>
        <p>If you did not create this request, ignore the email.</p>
        <p>If you want to do:<br>
            <a href="{reset_link}"> Click here to reset password</a></p>
        <p>Thank you for reading. </p>
        </body>
    </html>
"""

success_reset_template = """
<html>
        <body>
            <p>Hello,<br>
                Your password has been reset successfully.</p>
            <p>If you did not create this request, please contact us.</p>
            <p>Thank you for reading. </p>
        </body>
</html>
"""
