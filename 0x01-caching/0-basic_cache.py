#!/usr/bin/env python3
"""0-basic_cache module"""


from typing import Union


BaseCaching = __import__('baseClass').BaseCaching


class BasicCache(BaseCaching):
    """BasicCache class"""

    def put(self, key, item) -> None:
        """Assign to the dictionary an item for the key.

        Args:
            key (str): key
            item (str): item

        Returns:
            None
        """
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key: Union[str, int]) -> Union[str, int, None]:
        """Get an item by key.

        Args:
            key (str): key

        Returns:
            item (str): item None otherwise
        """

        if key is None or not (key in self.cache_data):
            return None

        return self.cache_data[key]
