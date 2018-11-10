class Comment:
    """
    Returns a ```comment``` object with the given id, text, commenter_id, commenter_name

    """
    def __init__(self, comment_id, text, commenter_id, commenter_name):
        self.comment_id = comment_id
        self.text = text
        self.commenter_id = commenter_id
        self.commenter_name = commenter_name
        print("A comment object is created.")

    def __str__(self):
        """
        Prints the details of a meeting.
        """
        return self.comment_id + " " + self.text + " " + self.commenter_id+ " " + self.commenter_name

    def get_json(self):
            """
            returns a json format of a comment
            """
            comment_dict = dict()
            comment_dict["comment_id"] = self.comment_id
            comment_dict["text"] = self.text
            comment_dict["commenter_id"] = self.commenter_id
            comment_dict["commenter_name"] = self.commenter_name
            return comment_dict

    def get_comment_id(self):
        """
        return comment's id
        """
        return self.comment_id

    def get_text(self):
        """
        return comment's text
        """
        return self.text

    def get_commenter_id(self):
        """
        return comment's commenter id
        """
        return self.commenter_id

    def get_commenter_name(self):
        """
        return comment's commenter's name
        """
        return self.commenter_name

    def set_comment_id(self, comment_id):
        """
        set comment's id
        """
        self.comment_id = comment_id
        return True

    def set_text(self, text):
        """
        set comment's text
        """
        self.text = text
        return True

    def set_commenter_id(self, commenter_id):
        """
       set comment's commenter_id
        """
        self.commenter_id = commenter_id
        return True


    def set_commenter_name(self, commenter_name):
        """
        set comment's commenter_name
        """
        self.commenter_name = commenter_name
        return True
