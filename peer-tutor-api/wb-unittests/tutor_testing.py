import unittest
import sys
sys.path.append("../")
# import TestCase

# This is class we want to test. So, we need to import it
from tutor import Tutor


class Tutor_testing(unittest.TestCase):
    """
    The basic class that inherits unittest.TestCase
    """
    tutor = Tutor("123", "bharath", "bharath", "123456", "security question?", "security ans", ["class1", "class2"], [
        "m1", "m2", "m3"], ["tb1", "tb2"], "002", "4.2")

    def test_get_tutor_id(self):
        assert self.tutor.get_tutor_id() == "002"

    def test_get_tutor_ratings(self):
        assert self.tutor.get_tutor_ratings() == "4.2"

####
    def test_set_tutor_id(self):
        self.tutor.set_tutor_id("1234")
        assert self.tutor.get_tutor_id() == "1234"

    def test_set_tutor_ratings(self):
        self.tutor.set_tutor_ratings("4")
        assert self.tutor.get_tutor_ratings() == "4"


if __name__ == '__main__':
    # begin the unittest.main()
    unittest.main()
