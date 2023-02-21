#!/usr/bin/env python3
"""0-basic_cache module.

- BasicCache class that inherits from BaseCaching and is a caching system.
"""


BaseCaching = __import__('baseClass').BaseCaching


class BasicCache(BaseCaching):
    """BasicCache: Implements the put and get methods for adding and item\
        to the dictionary using a key and getting an item from the\
            dictionary using a key.

    Args:
        BaseCaching (class): Base class.
    """

    def put(self, key, item):
        """put: Assign to the dictionary an item for the key.

        The dictionary will contain the item value for the key.
        This is the setattr method.

        Args:
            key (str): key
            item (str): item

        Returns:
            None
        """
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        """get: Get an item by key or None if no key has been passed.

        This is the getattr method. If called, it return the cached item\
            for the key.

        Args:
            key (str): key.

        Returns:
            item (str): item None otherwise.
        """
        if key is None or not (key in self.cache_data):
            return None

        return self.cache_data[key]
