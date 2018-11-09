from student import Student

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
            ###test
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

