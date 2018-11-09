from student import Student
class Peer:
    """
    Returns a ```peer``` object with the given peer Id, peer_ratings.

    """
    def __init__(self, student_id, name, enrolled_classes, schedule, meetings, peer_id, peer_ratings):
        super().__init__(student_id, name, enrolled_classes, schedule, meetings)
        self.peer_id = student_id
        self.peer_ratings = peer_ratings
        print("A peer object is created.")

        def __str__(self):
            """
            Prints the details of the peer.
            """
            return self.student_id + " " + self.name + " " + self.enrolled_classes.__str__ + " " + self.schedule.__str__ + " " + self.meetings.__str__ + " "+ self.peer_id + " " + self.peer_ratings

        def get_peer_id(self):
            """
            return student's peer id
            """
            return self.peer_id

        def get_peer_ratings(self):
            """
            return peer_ratings
            """
            return self.peer_ratings