from student import Student
from timeBlock import TimeBlock
from meeting import Meeting
from uniClass import UniClass

class Peer(Student):
    """
    Returns a ```peer``` object with the given peer Id, peer_ratings.

    """
    def __init__(self, student_id, name, enrolled_classes, schedule, meetings, peer_id, peer_ratings):
        super().__init__(student_id, name, enrolled_classes, schedule, meetings)
        self.peer_id = peer_id
        self.peer_ratings = peer_ratings
        print("A peer object is created.")

    def __str__(self):
            """
            Prints the details of the peer.
            """
            return self.student_id + " " + self.name + " " + self.enrolled_classes.__str__ + " " + self.schedule.__str__ + " " + self.meetings.__str__ + " "+ self.peer_id + " " + self.peer_ratings

    def get_json(self):
            """
            returns a json format of a peer
            """
            peer_dict = dict()
            peer_dict["student_id"] = self.student_id
            peer_dict["name"] = self.name

            peer_dict["enrolled_classes"] = list()   # "list(class1,class2,..)"
            for enrolled_class in self.enrolled_classes:
                peer_dict["enrolled_classes"].append(enrolled_class.get_json())

            peer_dict["schedules"] = list()  # list(timeblock1,timeblock2)
            for schedule in self.schedules:
                peer_dict["schedules"].append(schedule.get_json())

            peer_dict["meetings"] = list()  # list(m1,m2,m3)
            for meeting in self.meetings:
                peer_dict["meetings"].append(meeting.get_json())

            peer_dict["peer_id"] = self.peer_id
            peer_dict["peer_ratings"] = self.peer_ratings

            return peer_dict

    def get_student(self):
        """
        return student object
        """
        return Student(self.student_id, self.name, self.enrolled_classes, self.schedule, self.meetings)

    def set_student(self, student):
        """

        """
        self.student_id = student.get_student_id()
        self.name = student.get_name()
        self.enrolled_classes = student.get_enrolled_classes()
        self.schedule = student.get_schedules()
        self.meetings = student.get_meetings()
        return True

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

    def set_peer_id(self, peer_id):
            """
            set student's peer id
            """
            self.peer_id = peer_id
            return True

    def set_peer_ratings(self, peer_ratings):
            """
            return peer_ratings
            """
            self.peer_ratings = peer_ratings
            return True