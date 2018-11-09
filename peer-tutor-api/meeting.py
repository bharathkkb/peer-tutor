class Meeting:
    """
    Returns a ```Meeting``` object with the given id, peer, tutor, time, meetingTitle, Location

    """
    def __init__(self, meeting_id, peer, tutor, time, meetingTitle, location):
        self.meeting_id = meeting_id
        self.peer = peer
        self.tutor = tutor
        self.time = time
        self.meetingTitle = meetingTitle
        self.location = location
        print("A Meeting object is created.")

    def __str__(self):
        """
        Prints the details of a meeting.
        """
        return self.meeting_id + " " + self.peer.__str__() + " " + self.tutor.__str__ + " " + self.time + " " + self.meetingTitle + " " + self.location

    def get_peer(self):
        """
        return meeting's peer
        """
        return self.peer

    def get_tutor(self):
        """
        return meeting's tutor
        """
        return self.tutor

    def get_time(self):
        """
        return meeting's time
        """
        return self.time

    def get_meetingTitle(self):
        """
        return student's meetingTitle
        """
        return self.meetingTitle

    def get_location(self):
        """
        return meeting's location
        """
        return self.location

