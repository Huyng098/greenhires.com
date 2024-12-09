from src.auth.constants import ErrorCode
from src.exceptions import BadRequest, NotAuthenticated, PermissionDenied


class AuthRequired(NotAuthenticated):
    DETAIL = ErrorCode.AUTHENTICATION_REQUIRED


class AuthorizationFailed(PermissionDenied):
    DETAIL = ErrorCode.AUTHORIZATION_FAILED


class InvalidToken(NotAuthenticated):
    DETAIL = ErrorCode.INVALID_TOKEN


class InvalidOTP(BadRequest):
    DETAIL = ErrorCode.INVALID_OTP


class NotEnoughPermissions(PermissionDenied):
    DETAIL = ErrorCode.NOT_ENOUGH_PERMISSIONS


class InvalidCredentials(NotAuthenticated):
    DETAIL = ErrorCode.INVALID_CREDENTIALS


class EmailVerified(PermissionDenied):
    DETAIL = ErrorCode.EMAIL_VERIFIED


class EmailTaken(BadRequest):
    DETAIL = ErrorCode.EMAIL_TAKEN


class RefreshTokenNotValid(PermissionDenied):
    DETAIL = ErrorCode.REFRESH_TOKEN_NOT_VALID


class ResetTokenNotValid(NotAuthenticated):
    DETAIL = ErrorCode.RESET_TOKEN_NOT_VALID
