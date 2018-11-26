import unittest
import sys
# import TestCase

# This is class we want to test. So, we need to import it
from meeting import Meeting


class Meeting_testing(unittest.TestCase):
    """
    The basic class that inherits unittest.TestCase
    """
    meeting = Meeting("123", "009340877", "009123456", "17:30-18:45",
                      "CS 152 Tutoring", "DH 223", False)  # instantiate the student Class

    def test_get_meeting_id(self):
        assert self.meeting.get_meeting_id() == "123"

    def test_get_peer_id(self):
        assert self.meeting.get_peer() == "009340877"

    def test_get_tutor_id(self):
        assert self.meeting.get_tutor() == "009123456"

    def test_get_time(self):
        assert self.meeting.get_time() == "17:30-18:45"

    def test_get_meeting_title(self):
        assert self.meeting.get_meeting_title() == "CS 152 Tutoring"

    def test_get_location(self):
        assert self.meeting.get_location() == "DH 223"

    def test_get_selfReserved(self):
        assert self.meeting.get_selfReserved() == False

####
    def test_set_meeting_id(self):
        self.meeting.set_meeting_id("1234")
        assert self.meeting.get_meeting_id() == "1234"

    def test_set_peer_id(self):
        self.meeting.set_peer("009123456")
        assert self.meeting.get_peer() == "009123456"

    def test_set_tutor_id(self):
        self.meeting.set_tutor("009340877")
        assert self.meeting.get_tutor() == "009340877"

    def test_set_time(self):
        self.meeting.set_time("10:30-11:45")
        assert self.meeting.get_time() == "10:30-11:45"

    def test_set_meeting_title(self):
        self.meeting.set_meeting_title("CS 156 Tutoring")
        assert self.meeting.get_meeting_title() == "CS 156 Tutoring"

    def test_set_location(self):
        self.meeting.set_location("DH 122")
        assert self.meeting.get_location() == "DH 122"

    def test_set_selfReserved(self):
        self.meeting.set_selfReserved(True)
        assert self.meeting.get_selfReserved() == True


if __name__ == '__main__':
    # begin the unittest.main()
    unittest.main()
