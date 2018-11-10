from student import Student
from timeBlock import TimeBlock
from meeting import Meeting
from uniClass import UniClass


class Tutor(Student):
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

    def get_json(self):
            """
            returns a json format of a tutor
            """
            tutor_dict = dict()
            tutor_dict["student_id"] = self.student_id
            tutor_dict["name"] = self.name

            tutor_dict["enrolled_classes"] = list()   # "list(class1,class2,..)"
            for enrolled_class in self.enrolled_classes:
                tutor_dict["enrolled_classes"].append(enrolled_class.get_json())

            tutor_dict["schedules"] = list()  # list(timeblock1,timeblock2)
            for schedule in self.schedules:
                tutor_dict["schedules"].append(schedule.get_json())

            tutor_dict["meetings"] = list()  # list(m1,m2,m3)
            for meeting in self.meetings:
                tutor_dict["meetings"].append(meeting.get_json())

            tutor_dict["tutor_id"] = self.tutor_id
            tutor_dict["tutor_ratings"] = self.tutor_ratings

            return tutor_dict

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

    def set_tutor_id(self, tutor_id):
            """
            set tutor_id
            """
            self.tutor_id = tutor_id
            return True

    def set_tutor_ratings(self, tutor_ratings):
            """
            return tutor_ratings
            """
            self.tutor_ratings = tutor_ratings
            return True
