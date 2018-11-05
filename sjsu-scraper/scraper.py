'''
Scrape data from the sjsu course webpage
'''

from bs4 import BeautifulSoup
import requests
import os
import os.path
import csv
import time
import pprint
import json
pp = pprint.PrettyPrinter(indent=4)
dataStruct = dict()
debug = True
urlCount = 0

headers = {
    'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'}


def logUrl(url):
    global urlCount
    print("Url count ={}, Now doing url {}\n".format(urlCount, url))

    urlCount += 1


def getDepts(url, termUrl):
    try:
        logUrl(url)
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")

        max_rows = 0
        # find largest table
        for table in soup.findAll('table'):
            number_of_rows = len(table.findAll(
                lambda tag: tag.name == 'tr' and tag.findParent('table') == table))
            if number_of_rows > max_rows:
                largest_table = table
                max_rows = number_of_rows
        # iterate and find details of each dept
        for tr in largest_table.findAll('tr'):
            dept = tr.find('td').find('a')
            # print(dept.string)
            dataStruct[dept.string] = dict()
            deptURLId = dept['href']

            deptURLId = deptURLId[deptURLId.rfind(
                '/') + 1:deptURLId.rfind('.')]
            dataStruct[dept.string]["dept-id"] = deptURLId
            dataStruct[dept.string]["dept-name"] = dept.string

    except Exception as e:
        print(e)
        exit()


def getClasses(base):
    max = 0
    for k, v in dataStruct.items():
        max += 1
        url = base + v["dept-id"] + ".html"
        logUrl(url)
        response = requests.get(url, headers=headers)
        soup = BeautifulSoup(response.text, "html.parser")

        if(max > 2 and debug):
            print("debug")
            break

        max_rows = 0
        # find largest table
        for table in soup.findAll('table'):
            number_of_rows = len(table.findAll(
                lambda tag: tag.name == 'tr' and tag.findParent('table') == table))
            if number_of_rows > max_rows:
                largest_table = table
                max_rows = number_of_rows

        # pp.pprint(largest_table)
        # iterate and get each class
        dataStruct[k]["classes"] = dict()
        for tr in largest_table.findAll('tr'):
            uniclassAll = tr.findAll('td')
            uniclass = tr.find('td').find('a')
            print()
            if(uniclass is not None):
                # print(uniclass.string)

                dataStruct[k]["classes"][uniclass.string +
                                         "-" + uniclassAll[4].string] = dict()
                classURLId = uniclass['href']

                classURLId = classURLId[classURLId.rfind(
                    '/') + 1:classURLId.rfind('.')]
                dataStruct[k]["classes"][uniclass.string + "-" +
                                         uniclassAll[4].string]["class-id"] = classURLId
                dataStruct[k]["classes"][uniclass.string + "-" +
                                         uniclassAll[4].string]["class-name"] = uniclass.string
                if(debug):
                    print("debug")

                    break


def getClassDetails(base):
    max = 0
    try:
        for dept, deptDetails in dataStruct.items():
            print("Currently doing Department {}".format(dept))
            if(deptDetails.get("classes", None) is not None):
                for uniclass, uniclassDetails in deptDetails["classes"].items():
                    print("Currently doing Class {}".format(uniclass))
                    # print(deptDetails)
                    # print(dataStruct[dept][uniclass])
                    url = base + uniclassDetails["class-id"] + ".html"
                    print(url)
                    logUrl(url)
                    response = requests.get(url, headers=headers)
                    soup = BeautifulSoup(response.text, "html.parser")
                    if(max > 2 and debug):
                        print("debug")
                        break
                    max_rows = 0

                    # find largest table
                    for table in soup.findAll('table'):
                        number_of_rows = len(table.findAll(
                            lambda tag: tag.name == 'tr' and tag.findParent('table') == table))
                        if number_of_rows > max_rows:
                            largest_table = table
                            max_rows = number_of_rows
                    # iterate and get details for a single class
                    for tr in largest_table.findAll('tr'):
                        dataItems = tr.findAll('td')
                        if(len(dataItems) == 3):
                            classDetail = dataItems[0].string.lower()

                            classDetailInfo = dataItems[2].string
                            dataStruct[dept]["classes"][uniclass][classDetail] = classDetailInfo
                            # pp.pprint(dataStruct)
                    if(debug):
                        print("debug")
                        pp.pprint(dataStruct)
                        break
                if(debug):
                    print("debug")
                    break
    except Exception as e:
        print(e)
        exit()


if __name__ == "__main__":
    baseurl = "http://info.sjsu.edu/web-dbgen/schedules-spring/all-departments.html"
    termUrl = "http://info.sjsu.edu/web-dbgen/schedules-spring/"
    getDepts(baseurl, termUrl)
    getClasses(termUrl)
    getClassDetails(termUrl)
    filename = "data.json"
    if os.path.exists(filename):
        os.remove(filename)
    with open(filename, 'w') as fp:
        json.dump(dataStruct, fp)
