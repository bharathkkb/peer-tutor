from comment import Comment

class Rating:
    """
    Returns a ```rating``` object with the given

    """
    def __init__(self, score, comments):
        self.score = score
        self.comments = comments
        print("A rating object is created.")

    def __str__(self):
        """
        Prints the details of a rating.
        """
        return self.score + " " + self.comments.__str__()

    def get_json(self):
            """
            returns a json format of a rating
            """
            rating_dict = dict()
            rating_dict["score"] = self.score

            rating_dict["comments"] = list()
            for comment in self.comments:
                rating_dict["comments"].append(comment.get_json())

            return rating_dict

    def get_score(self):
        """
        return a rating's score
        """
        return self.score

    def set_score(self, score):
        """
        set rating's score
        """
        self.score = score
        return True

    def get_comments(self):
        """
        return rating's comments
        """
        return self.comments

    def set_comments(self, comments):
        """
        set rating's comments
        """
        self.comments = comments
        return True
