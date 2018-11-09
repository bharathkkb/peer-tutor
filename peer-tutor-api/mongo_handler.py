import pyMongo

def putData(query):
    r=pyMongo.execute(query)
    if(r is True)
        return True
    else:
        return False

def getData(query):
    r=pyMongo.execute(query)
    if(r is True)
        return r.data()
    else:
        return False