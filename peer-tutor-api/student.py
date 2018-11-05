class Student:
    """
    Returns a ```Student``` object with the given student Id, name, enrolled classes, schedule and meetings.

    """
    def __init__(self, student_id, name, enrolled_classes, schedule, meetings):
        self.student_id = student_id
        self.name = name
        self.enrolled_classes = enrolled_classes
        self.schedule = schedule
        self.meetings = meetings
        print("A student object is created.")

    def __str__(self):
        """
        Prints the details of the student.
        """
        return self.student_id + " " + self.name + " " + self.enrolled_classes.__str__ + " " + self.schedule.__str__ + " " + self.meetings.__str__

    def get_student_id(self):
        """
        return student's id
        """
        return self.student_id

    def get_name(self):
        """
        return student's name
        """
        return self.name

    def get_enrolled_classes(self):
        """
        return student's enrolled classes
        """
        return self.enrolled_classes

    def get_schedule(self):
        """
        return student's schedule
        """
        return self.schedule

    def get_meetings(self):
        """
        return student's meetings
        """
        return self.meetings

    def add_meetings(self, meetings):
        """
        add a meeting
        """
        return True

    def add_class(self):
        """
        add a class
        """
        return True

    def add_schedule(self):
        """
        add a schedule
        """
        return True


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

class Tutor:
    """
    Returns a ```tutor``` object with the given tutor Id, tutor_ratings.

    """
    def __init__(self, student_id, name, enrolled_classes, schedule, meetings, tutor_id, tutor_ratings):
        super().__init__(student_id, name, enrolled_classes, schedule, meetings)
        self.tutor_id = tutor_id
        self.tutor_ratings = tutor_ratings
        print("A tutor object is created.")

        def __str__(self):
            """
            Prints the details of the tutor.
            """
            return self.student_id + " " + self.name + " " + self.enrolled_classes.__str__ + " " + self.schedule.__str__ + " " + self.meetings.__str__ + " " + self.tutor_id + " " + self.tutor_ratings

        def set_student(self):
            """
            set
            """
            return True

        def get_tutor_id(self):
            """
            return tutor_id
            """
            return self.tutor_id

        def get_tutor_ratings(self):
            """
            return tutor_ratings
            """
            return self.tutor_ratings


