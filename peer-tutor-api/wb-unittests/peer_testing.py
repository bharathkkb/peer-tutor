import unittest
import sys
sys.path.append("../")
# import TestCase

# This is class we want to test. So, we need to import it
from peer import Peer


class Peer_testing(unittest.TestCase):
    """
    The basic class that inherits unittest.TestCase
    """
    peer = Peer("123", "bharath", "bharath", "123456", "security question?", "security ans", ["class1", "class2"], [
        "m1", "m2", "m3"], ["tb1", "tb2"], "123", "5")

    def test_get_peer_id(self):
        assert self.peer.get_peer_id() == "123"

    def test_get_peer_ratings(self):
        assert self.peer.get_peer_ratings() == "5"

####
    def test_set_peer_id(self):
        self.peer.set_peer_id("1234")
        assert self.peer.get_peer_id() == "1234"

    def test_set_peer_ratings(self):
        self.peer.set_peer_ratings("4")
        assert self.peer.get_peer_ratings() == "4"


if __name__ == '__main__':
    # begin the unittest.main()
    unittest.main()
