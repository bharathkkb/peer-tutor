from timeBlock import TimeBlock
from student import Student
from comment import Comment

class UniClass:
    """
    Returns a ```UniClass``` object with the given id, peer, tutor, time, meetingTitle, Location

    """
    def __init__(self, class_id, class_name, time, students, student_comments):
        self.class_id = class_id
        self.class_name = class_name
        self.time = time
        self.students = students
        self.student_comments = student_comments
        print("A UniClass object is created.")

    def __str__(self):
        """
        Prints the details of a meeting.
        """
        return self.class_id + " " + self.class_name + " " + self.time.__str__ + " " + self.students.__str__ + " " + self.student_comments.__str__

    def get_json(self):
        """
        returns a json format of a UniClass
        """
        class_dict=dict()
        class_dict["class_id"]=self.class_id
        class_dict["class_name"] = self.class_name
        class_dict["time"] = self.time.get_json() # one class one time block

        class_dict["students"] = list()         # one class has more than 1 students
        for student in self.students:
            class_dict["students"].append(student.get_json())

        class_dict["student_comments"] = list()   # one class has more than 1 student_comments
        for student_comment in self.student_comments:
            class_dict["student_comments"].append(student_comment.get_json())

        return class_dict

    def get_class_id(self):
        """
        return class_id
        """
        return self.class_id

    def get_class_name(self):
        """
        return class_name
        """
        return self.class_name

    def get_time(self):
        """
        return time
        """
        return self.time

    def get_students(self):
        """
        return students
        """
        return self.students

    def get_student_comments(self):
        """
        return student_comments
        """
        return self.student_comments

    def set_class_id(self, class_id):
        """
        set class_id
        """
        self.class_id = class_id
        return True

    def set_class_name(self, class_name):
        """
        set class_name
        """
        self.class_name = class_name
        return True

    def set_time(self, class_time):
        """
        set class_time
        """
        self.class_time = class_time
        return True

    def add_student(self, student):
        """
        add a student into a class
        """
        return True

    def add_student_comment(self, student_comment):
        """
        add student_comments
        """
        return True