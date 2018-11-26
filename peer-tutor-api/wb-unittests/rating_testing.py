import unittest
import sys
sys.path.append("../")
# This is class we want to test. So, we need to import it
from rating import Rating


class Rating_testing(unittest.TestCase):
    """
    The basic class that inherits unittest.TestCase
    """
    rating = Rating("001", "given", "received", "4", "Good")

    def test_get_score(self):
        assert self.rating.get_score() == "4"
    def test_get_comments(self):
        assert self.rating.get_comments() == "Good"

####

    def test_set_score(self):
        self.rating.set_score("002")
        assert self.rating.get_score() == "002"

    def test_set_comments(self):
        self.rating.set_comments("Good!")
        assert self.rating.get_comments() == "Good!"

if __name__ == '__main__':
    # begin the unittest.main()
    unittest.main()