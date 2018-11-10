import time
import datetime

class TimeBlock:
    """
    Returns a ```Time Block``` object with the given startTime and endTime

    """
    def __init__(self, start_time, end_time):
        self.start_time = start_time
        self.end_time = end_time
        print("A time block object is created.")

    def __str__(self):
        """
        Prints the details of a time block.
        """
        return self.start_time.strftime("%c") + " " + self.end_time.strftime("%c")

    def get_json(self):
        """
        returns a json format of a Time Block
        """
        time_dict=dict()
        time_dict["start"]=self.start_time
        time_dict["end"] = self.end_time
        return time_dict

    def get_start_time(self):
        """
        return TimeBlock's end_time
        """
        return self.start_time

    def get_end_time(self):
        """
        return TimeBlock's end_time
        """
        return self.end_time

    def set_start_time(self, start_time):
        """
        set start_time
        """
        self.start_time = start_time
        return True

    def set_end_time(self, end_time):
        """
        set end_time
        """
        self.end_time = end_time
        return True