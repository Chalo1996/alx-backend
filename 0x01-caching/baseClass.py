#!/usr/bin/env python3
"""The Base Class for all the classes in the project."""


from typing import Dict


class BaseCaching():
    """BaseCaching defines:
        - constants of the caching system.
        - data stored in a dictionary.
    """
    MAX_ITEMS: int = 4

    def __init__(self) -> None:
        """Initialize the data."""
        self.cache_data: Dict[str, str] = {}

    def print_cache(self) -> None:
        """Print the cache."""
        print("Current cache:")
        for key in sorted(self.cache_data.keys()):
            print("{}: {}".format(key, self.cache_data.get(key)))

    def put(self, key: str, item: str) -> None:
        """Add an item in the cache."""
        raise NotImplementedError(
            "put must be implemented in your cache class")

    def get(self, key: str) -> None:
        """Get an item by key."""
        raise NotImplementedError(
            "get must be implemented in your cache class")
