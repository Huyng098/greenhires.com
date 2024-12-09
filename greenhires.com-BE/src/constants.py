from enum import Enum
from src.resume.schema import Layers


class Environment(str, Enum):
    LOCAL = "LOCAL"
    STAGING = "STAGING"
    TESTING = "TESTING"
    PRODUCTION = "PRODUCTION"

    @property
    def is_debug(self):
        return self in (self.LOCAL, self.STAGING, self.TESTING)

    @property
    def is_testing(self):
        return self == self.TESTING

    @property
    def is_deployed(self) -> bool:
        return self in (self.STAGING, self.PRODUCTION)


DEFAULT_LAYERS: list[Layers] = [
    Layers(
        layers={
            "ROOT": {
                "type": {
                    "resolvedName": "RootLayer"
                },
                "props": {
                    "boxSize": {
                        "width": 794,
                        "height": 1123
                    },
                    "position": {
                        "x": 0,
                        "y": 0
                    },
                    "rotate": 0,
                    "color": "rgba(255, 255, 255)",
                    "image": None,
                },
                "locked": False,
                "child": [],
                "parent": None
            }
        },
    )
]
