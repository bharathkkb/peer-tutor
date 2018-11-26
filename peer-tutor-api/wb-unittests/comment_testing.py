import unittest
import sys
sys.path.append("../")
# This is class we want to test. So, we need to import it
from comment import Comment


class Comment_testing(unittest.TestCase):
    """
    The basic class that inherits unittest.TestCase
    """
    comment = Comment("001", "Great", "123456", "Sheldon")

    def test_get_comment_id(self):
        assert self.comment.get_comment_id() == "001"

    def test_get_text(self):
        assert self.comment.get_text() == "Great"

    def test_get_commenter_id(self):
        assert self.comment.get_commenter_id() == "123456"

    def test_get_commenter_name(self):
        assert self.comment.get_commenter_name() == "Sheldon"
####

    def test_set_comment_id(self):
        self.comment.set_comment_id("002")
        assert self.comment.get_comment_id() == "002"

    def test_set_text(self):
        self.comment.set_text("Good")
        assert self.comment.get_text() == "Good"

    def test_set_commenter_id(self):
        self.comment.set_commenter_id("987654")
        assert self.comment.get_commenter_id() == "987654"

    def test_set_commenter_name(self):
        self.comment.set_commenter_name("bharath")
        assert self.comment.get_commenter_name() == "bharath"


if __name__ == '__main__':
    # begin the unittest.main()
    unittest.main()