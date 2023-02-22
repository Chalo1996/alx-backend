#!/usr/bin/env python3
"""4-mru_cache module."""


BaseCaching = __import__('base_caching').BaseCaching


class MRUCache(BaseCaching):
    """MRUCache class. It implements the MRU replacement algorithm.\
        It inherits the properties of the BaseCaching class.
    """

    def __init__(self):
        """Instantiate the MRUCache class. It preloads the BaseCaching\
            class cache_data dictionary then instantiates the cache_lines list.
        """
        super().__init__()
        self.cache_lines = []

    def put(self, key, item):
        """Assign to the dictionary an item for the key.

        Args:
            key (str): key
            item (str): item

        Returns:
            None
        """
        if key is None or item is None:
            return
        if key in self.cache_data:
            self.cache_data[key] = item
            self.cache_lines.remove(key)
            self.cache_lines.append(key)
            return
        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            print("DISCARD: {}".format(self.cache_lines[-1]))
            self.cache_data.pop(self.cache_lines[-1])
            del self.cache_lines[-1]
        self.cache_data[key] = item
        self.cache_lines.append(key)

    def get(self, key):
        """Get an item by key.

        Args:
            key (str): key

        Returns:
            item (str): item None otherwise
        """
        if key is None or not (key in self.cache_data):
            return None

        self.cache_lines.remove(key)
        self.cache_lines.append(key)
        return self.cache_data[key]
