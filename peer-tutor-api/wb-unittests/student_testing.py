import unittest
import sys
sys.path.append("../")
# import TestCase

# This is class we want to test. So, we need to import it
from student import Student

# Student("123","bharath",["class1","class2"], ["tb1","tb2"], ["m1","m2","m3"])


class Student_testing(unittest.TestCase):
    """
    The basic class that inherits unittest.TestCase
    """
    student = Student("123", "bharath", "bharath", "123456", "security question?", "security ans", ["class1", "class2"], [
                      "m1", "m2", "m3"], ["tb1", "tb2"])  # instantiate the student Class

    def test_get_student_id(self):
        assert self.student.get_student_id() == "123"

    def test_get_name(self):
        assert self.student.get_name() == "bharath"

    def test_get_user_name(self):
        assert self.student.get_user_name() == "bharath"

    def test_get_password(self):
        assert self.student.get_password() == "123456"

    def test_get_enrolled_classes(self):
        assert self.student.get_enrolled_classes() == ["class1", "class2"]

    def test_get_schedules(self):
        assert self.student.get_schedules() == ["tb1", "tb2"]

    def test_get_meetings(self):
        assert self.student.get_meetings() == ["m1", "m2", "m3"]

####
    def test_set_student_id(self):
        self.student.set_student_id("1234")
        assert self.student.get_student_id() == "1234"

    def test_set_name(self):
        self.student.set_name("Sheldon")
        assert self.student.get_name() == "Sheldon"

    def test_set_user_name(self):
        self.student.set_user_name("Sheldon")
        assert self.student.get_user_name() == "Sheldon"

    def test_set_password(self):
        self.student.set_password("012345")
        assert self.student.get_password() == "012345"

    def test_set_enrolled_classes(self):
        self.student.set_classes(["class3", "class4"])
        assert self.student.get_enrolled_classes() == ["class3", "class4"]

    def test_set_schedules(self):
        self.student.set_schedules(["tb1", "tb2"])
        assert self.student.get_schedules() == ["tb1", "tb2"]

    def test_set_meetings(self):
        self.student.set_meetings(["m1", "m2"])
        assert self.student.get_meetings() == ["m1", "m2"]


if __name__ == '__main__':
    # begin the unittest.main()
    unittest.main()
