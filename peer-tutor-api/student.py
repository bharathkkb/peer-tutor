from uniClass import UniClass
from meeting import Meeting
from timeBlock import TimeBlock

# Student("123","bharath","list(class1,class2,..)", "list(timeblock1,timebl2)","list(m1,m2,m3)")

class Student:
    """
    Returns a ```Student``` object with the given student Id, name, enrolled classes, schedule and meetings.

    """
    def __init__(self, student_id, name, enrolled_classes, schedules, meetings):
        self.student_id = student_id
        self.name = name
        self.enrolled_classes = enrolled_classes
        self.schedules = schedules  # a Time block
        self.meetings = meetings
        print("A student object is created.")

    def __str__(self):
        """
        Prints the details of the student.
        """
        return self.student_id + " " + self.name + " " + self.enrolled_classes.__str__ + " " + self.schedules.__str__ + " " + self.meetings.__str__

    def get_json(self):
        """
        returns a json format of a student
        """
        student_dict=dict()
        student_dict["student_id"] = self.student_id
        student_dict["name"]=self.name

        student_dict["enrolled_classes"] = list()  # "list(class1,class2,..)"
        for enrolled_class in self.enrolled_classes:
            student_dict["enrolled_classes"].append(enrolled_class.get_json())

        student_dict["schedules"] = list()      # list(timeblock1,timeblock2)
        for schedule in self.schedules:
            student_dict["schedules"].append(schedule.get_json())

        student_dict["meetings"] = list()       # list(m1,m2,m3)
        for meeting in self.meetings:
            student_dict["meetings"].append(meeting.get_json())

        return student_dict

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

    def get_schedules(self):
        """
        return student's schedules
        """
        return self.schedules

    def get_meetings(self):
        """
        return student's meetings
        """
        return self.meetings

    def set_student_id(self, student_id):
        """
        set student's id
        """
        self.student_id = student_id

    def set_name(self, name):
        """
        set student's name
        """
        self.name = name

    def add_class(self, a_class):
        """
        add a class
        """
        return True

    def add_meeting(self, meeting):
        """
        add a meeting
        """
        return True

    def add_schedule(self, schedule) :
        """
        add a schedules
        """
        return True
