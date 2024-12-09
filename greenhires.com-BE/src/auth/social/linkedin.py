"""Linkedin SSO Login Helper
"""
from typing import Optional
from src.auth.social.base import DiscoveryDocument, OpenID, SSOBase
import httpx


class LinkedInSSO(SSOBase):
    """Class providing login via linkedin OAuth"""

    discovery_url = "https://www.linkedin.com/oauth/.well-known/openid-configuration"
    provider = "linkedin"
    scope = ["openid", "email", "profile"]

    async def get_discovery_document(self) -> DiscoveryDocument:
        """Get document containing handy urls"""
        async with httpx.AsyncClient() as session:
            response = await session.get(self.discovery_url)
            content = response.json()
            return content

    async def openid_from_response(self, response: dict, session: Optional["httpx.AsyncClient"] = None) -> OpenID:
        """Return OpenID from user information provided by Facebook"""
        return OpenID(
            email=response.get("email", ""),
            first_name=response.get("given_name"),
            last_name=response.get("family_name"),
            display_name=response.get("name", ""),
            provider=self.provider,
            id=response.get("sub"),
            picture=response.get("picture", ""),
        )
