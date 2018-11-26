import unittest
import sys
sys.path.append("../")
# This is class we want to test. So, we need to import it
from timeBlock import TimeBlock


class TimeBlock_testing(unittest.TestCase):
    """
    The basic class that inherits unittest.TestCase
    """
    timeBlock = TimeBlock("07:30", "8:45")

    def test_get_start_time(self):
        assert self.timeBlock.get_start_time() == "07:30"

    def test_get_end_time(self):
        assert self.timeBlock.get_end_time() == "8:45"
####

    def test_set_start_time(self):
        self.timeBlock.set_start_time("18:30")
        assert self.timeBlock.get_start_time() == "18:30"

    def test_set_end_time(self):
        self.timeBlock.set_end_time("21:30")
        assert self.timeBlock.get_end_time() == "21:30"


if __name__ == '__main__':
    # begin the unittest.main()
    unittest.main()
