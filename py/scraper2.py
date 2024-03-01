# --------------- libs --------------- #

# check platform (Windows/Linux/macOS); macOS == darwin, Windows == win32
from sys import platform
from urllib.request import urlopen  # open URLs
from bs4 import BeautifulSoup  # BeautifulSoup; parsing HTML
import re  # regex; extract substrings
from datetime import datetime  # calculate script's run time
from datetime import timedelta  # addition and subtraction of dates
import webbrowser  # open URL from notification

# --------- start + run time --------- #

print("Starting...")
start = datetime.now()  # run time

# ----------- notifications ---------- #

if platform == "darwin":
    import pync  # macOS notifications
elif platform == 'win32':
    from plyer import notification  # Windows notification
    # from win10toast_click import ToastNotifier # Windows 10 notifications
    # toaster = ToastNotifier() # initialize win10toast

# ------- URL query date range ------- #

start_date_range = datetime.now().date()  # current date, YYYY-MM-DD
end_date_range = start_date_range + \
    timedelta(days=7)  # add 7 days to get a full week

# re-format date from YYYY-MM-DD to DD-MM-YYYY
start_date_range = start_date_range.strftime('%d-%m-%Y')
# re-format date from YYYY-MM-DD to DD-MM-YYYY
end_date_range = end_date_range.strftime('%d-%m-%Y')

# ------------- functions ------------ #

# open URL from Windows 10/11 notification (callback)


def open_url():
    webbrowser.open_new("https://github.com/vardecab/umbrella/tree/master/py")

# open URL from Windows 10/11 notification (callback)

# TODO 

# def open_url_API(notification_id, action):
#     if action == "open_url":
#         webbrowser.open_new("http://pylenia.pl")

# show notification if script didn't work

def errorNotification(location):
    # NOTE: location used to show where error happened
    if platform == "darwin":
        pync.notify(f'Error in: {location}', title='Umbrella', subtitle='PollenInfoAutoUpdate',
                    open="https://github.com/vardecab/umbrella/tree/master/py", sound="", contentImage="icons/error.png")
    elif platform == "win32":
        notification.notify(
            title='Umbrella',
            message=f'PollenInfoAutoUpdate: Error in: {location}',
            app_icon='icons/error.ico')

# isolate pure text from HTML


def cleanHTML(raw_html):
    cleanr = re.compile('<.*?>')  # remove HTML tags
    return re.sub(cleanr, '', raw_html)

# get data from the website


def pullData(soup):

    # find the div with desired info
    description = soup.find("div", {"class": "pollen-item-cont"})
    description = str(description)  # convert to string
    # find the info inside the tag
    description = re.search(r'(<div(.*?)>(.*?)</div>)', description)
    description = description.group(0)  # access text found in regex above
    description = str(cleanHTML(description))  # extract just the text
    description = description.strip()  # remove unnecessary characters

    return description

# get info for regions


def getInfo(region, regionID, regionID_long):

    # Dolny Śląsk
    page_url = f'http://pylenia.pl/search.html?r={regionID}&a=0&from={start_date_range}&to={end_date_range}&w=1'
    # print(page_url) # debug

    try:
        page = urlopen(page_url)
        soup = BeautifulSoup(page, 'html.parser')  # parse the page
    except:
        # status
        print("Can't access http://pylenia.pl. Check manually if it works and try again.")
        # display notification
        errorNotification("accessing URL; Internet or website is down.")
        print("Closing.")  # status
        exit()  # close script

    try:
        description = pullData(soup)  # get data from the function
    except:
        print("Couldn't get the data from the website http://pylenia.pl. Check if you can get the data manually — perhaps something on the website has changed?")  # status
        # display notification
        errorNotification("pullData function; website has changed?")
        print("Closing.")  # status
        exit()  # close script

    # compare local file with new data coming from the scraped website
    try:  # try to compare the file with new info from the page
        if description is not None:
            with open(f"allergens-description-{regionID_long}.txt", "r", encoding="utf-8") as file_read:
                description_local = file_read.read()
            if description == description_local:
                # status
                print(
                    f"No new conditions for {region}. Local file is up to date.")
                changes = 0
            else:
                with open(f"allergens-description-{regionID_long}.txt", "w", encoding="utf-8") as file:
                    file.write(description)
                print(f"Description for {region}: {description}")
                
                # NOTE: show a notification if there is pollen in a specific region
                if regionID == 2: # WY
                    if platform == "darwin":
                        pync.notify(f'{region}: {description}', title='Umbrella', subtitle='PollenInfoAutoUpdate', open="https://github.com/vardecab/umbrella/tree/master/py", sound="", contentImage="icons/umbrella.png")
                        
                # counter
                changes = 1
            return changes
    except FileNotFoundError:  # if file doesn't exist because we have added a new region do something else
        print(f"File for region {region} didn't exist. Let's create it...")
        with open(f"allergens-description-{regionID_long}.txt", "w", encoding="utf-8") as file:
            print("File created.")
            file.write(description)
        print(f"Description for {region}: {description}")
    else:
        # status
        print("For some reason returned data is empty. Check if you can get the data manually.")
        # display notification
        errorNotification("description is 'None'; check the website manually.")
        print("Closing.")  # status
        exit()  # close script

# --- regions defined for function --- #

# NOTE: assigned to a variable to get # of changes, same with the other two
DS = getInfo('Dolny Slask', '6', 'R6DS')
MZ = getInfo('Mazowsze', '7', 'R7MZ')
MP = getInfo('Malopolska', '9', 'R9MP')
PM = getInfo('Wybrzeze', '2', 'R2WY')

# -------- show notifications -------- #

# number of changes (from function: `return changes`), eg. 2 = 2 files have changed because script downloaded new data, 1 file without changes
regions_updated = DS + MZ + MP + PM
if regions_updated > 0:
    print(f"Region(s) updated: {regions_updated}")  # status
    if platform == "darwin":
        pync.notify(f'Update completed for {regions_updated} region(s).', title='Umbrella', subtitle='PollenInfoAutoUpdate',
                    open="https://github.com/vardecab/umbrella/tree/master/py", sound="", contentImage="icons/umbrella.png")
    elif platform == "win32":
        notification.notify(
            title='Umbrella',
            message=f'PollenInfoAutoUpdate: {regions_updated} region(s) updated.',
            app_icon='icons/umbrella.ico')
else:
    print(f"All regions are up-to-date, no changes made.")  # status
    if platform == "darwin":
        pync.notify('All regions are up-to-date, no changes made.', title='Umbrella', subtitle='PollenInfoAutoUpdate',
                    open="https://github.com/vardecab/umbrella/tree/master/py", sound="", contentImage="icons/umbrella.png")
    elif platform == "win32":
        notification.notify(
            title='Umbrella',
            message=f'All regions are up-to-date, no changes made.',
            app_icon='icons/umbrella.ico')

# ------------- run time ------------- #

print("Run time:", datetime.now()-start)
