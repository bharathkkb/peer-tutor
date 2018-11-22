import unittest
import sys
sys.path.append("../")
# This is class we want to test. So, we need to import it
from uniClass import UniClass

# Uniclass("001","CS 160", "19:30-20:45", ["001","123"], ["C1","C2","C3"])
# class_id, class_name, time, students, student_comments


class UniClass_testing(unittest.TestCase):
    """
    The basic class that inherits unittest.TestCase
    """
    uniClass = UniClass("001", "CS 160", "19:30-20:45",
                        ["001", "123"], ["C1", "C2", "C3"])

    def test_get_class_id(self):
        assert self.uniClass.get_class_id() == "001"

    def test_get_class_name(self):
        assert self.uniClass.get_class_name() == "CS 160"

    def test_get_time(self):
        assert self.uniClass.get_time() == "19:30-20:45"

    def test_get_students(self):
        assert self.uniClass.get_students() == ["001", "123"]

    def test_get_student_comments(self):
        assert self.uniClass.get_student_comments() == ["C1", "C2", "C3"]
####

    def test_set_class_id(self):
        self.uniClass.set_class_id("002")
        assert self.uniClass.get_class_id() == "002"

    def test_set_class_name(self):
        self.uniClass.set_class_name("CS 161")
        assert self.uniClass.get_class_name() == "CS 161"

    def test_set_time(self):
        self.uniClass.set_time("17:30-18:45")
        assert self.uniClass.get_time() == "17:30-18:45"

    def test_set_students(self):
        self.uniClass.set_students(["002", "123"])
        assert self.uniClass.get_students() == ["002", "123"]

    def test_set_student_comments(self):
        self.uniClass.set_student_comments(["C4", "C5", "C6"])
        assert self.uniClass.get_student_comments() == ["C4", "C5", "C6"]


if __name__ == '__main__':
    # begin the unittest.main()
    unittest.main()
