class Meeting:
    """
    Returns a ```Meeting``` object with the given id, peer, tutor, time, meetingTitle, Location

    """

    def __init__(self, meeting_id, peer_id, tutor_id, time=None, meeting_title=None, location=None):
        self.meeting_id = meeting_id
        self.peer_id = peer_id
        self.tutor_id = tutor_id
        self.time = time
        self.meeting_title = meeting_title
        self.location = location
        print("A Meeting object is created.")

    def __str__(self):
        """
        Prints the details of a meeting.
        """
        return self.meeting_id + " " + self.peer.__str__() + " " + self.tutor.__str__ + " " + self.time.__str__ + " " + self.meeting_title + " " + self.location

    def get_json(self):
        """
        returns a json format of a Meeting
        """
        meeting_dict = dict()
        meeting_dict["meeting_id"] = self.meeting_id
        meeting_dict["peer_id"] = self.peer_id
        meeting_dict["tutor_id"] = self.tutor_id
        # meeting_dict["peer"] = self.peer.get_json() # one meeting one peer
        # meeting_dict["tutor"] = self.tutor.get_json() # one meeting one tutor
        # meeting_dict["time"] = self.time.get_json()  # one meeting one timeBlock
        # meeting_dict["meeting_title"] = self.meeting_title
        # meeting_dict["location"] = self.location
        return meeting_dict

    def get_meeting_id(self):
        """
        return meeting's id
        """
        return self.meeting_id

    def get_peer(self):
        """
        return meeting's peer
        """
        return self.peer_id

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

    def get_meeting_title(self):
        """
        return student's meetingTitle
        """
        return self.meeting_title

    def get_location(self):
        """
        return meeting's location
        """
        return self.location

    def set_peer(self, peer_id):
        """
        set peer
        """
        self.peer_id = peer_id
        return True

    def set_tutor(self, tutor_id):
        """
        set tutor
        """
        self.tutor_id = tutor_id
        return True

    def set_time(self, time):
        """
        set time
        """
        self.time = time
        return True

    def set_meeting_title(self, meeting_title):
        """
        set meetingTitle
        """
        self.meeting_title = meeting_title
        return True

    def set_location(self, location):
        """
        set start_time
        """
        self.location = location
        return True
