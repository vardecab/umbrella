# --------------- libs --------------- #

from urllib.request import urlopen # open URLs
from bs4 import BeautifulSoup # BeautifulSoup; parsing HTML
import re # regex; extract substrings
from datetime import datetime # calculate script's run time
from datetime import timedelta # addition and subtraction of dates
import webbrowser # open URL from notification 

# --------- start + run time --------- #

print("Starting...")
start = datetime.now() # run time

# ----------- notifications ---------- #

from sys import platform # check platform (Windows/Linux/macOS); macOS == darwin, Windows == win32
if platform == "darwin":
    import pync # macOS notifications
elif platform == 'win32':
    from win10toast_click import ToastNotifier # Windows 10 notifications
    toaster = ToastNotifier() # initialize win10toast

# ------- URL query date range ------- #

start_date_range = datetime.now().date() # current date, YYYY-MM-DD
end_date_range = start_date_range + timedelta(days=7) # add 7 days to get a full week

start_date_range = start_date_range.strftime('%d-%m-%Y') # re-format date from YYYY-MM-DD to DD-MM-YYYY
end_date_range = end_date_range.strftime('%d-%m-%Y') # re-format date from YYYY-MM-DD to DD-MM-YYYY

# ------------- functions ------------ #

# open URL from Windows 10/11 notification (callback)
def open_url(): 
    webbrowser.open_new("https://github.com/vardecab/umbrella/tree/master/py")

# open URL from Windows 10/11 notification (callback)
def open_url_API(): 
    webbrowser.open_new("http://pylenia.pl")
    
# show notification if script didn't work
def errorNotification (location):
    # NOTE: location used to show where error happened
    if platform == "darwin":
        pync.notify(f'Error in: {location}', title='Umbrella', subtitle='PollenInfoAutoUpdate', open="https://github.com/vardecab/umbrella/tree/master/py", sound="", contentImage="icons/error.png")
    elif platform == "win32":
        toaster.show_toast(title="Umbrella", msg=f'PollenInfoAutoUpdate: Error in: {location}', icon_path="icons/error.ico", duration=None, threaded=True, callback_on_click=open_url_API) # duration=None - leave notification in Notification Center; threaded=True - rest of the script will be allowed to be executed while the notification is still active

# isolate pure text from HTML
def cleanHTML(raw_html):
    cleanr = re.compile('<.*?>') # remove HTML tags
    return re.sub(cleanr, '', raw_html)

# get data from the website
def pullData(soup):
    
    description = soup.find("div", {"class":"pollen-item-cont"}) # find the div with desired info
    description = str(description) # convert to string
    description = re.search(r'(<div(.*?)>(.*?)</div>)', description) # find the info inside the tag
    description = description.group(0) # access text found in regex above
    description = str(cleanHTML(description)) # extract just the text
    description = description.strip() # remove unnecessary characters
    
    return description

# get info for regions
def getInfo(region, regionID, regionID_long):
    
    page_url = f'http://pylenia.pl/search.html?r={regionID}&a=0&from={start_date_range}&to={end_date_range}&w=1' # Dolny Śląsk
    # print(page_url) # debug
    
    try:
        page = urlopen(page_url)
        soup = BeautifulSoup(page, 'html.parser') # parse the page
    except:
        print("Can't access http://pylenia.pl. Check manually if it works and try again.") # status
        errorNotification("accessing URL; Internet or website is down.") # display notification
        print("Closing.") # status
        exit() # close script

    try:
        description = pullData(soup) # get data from the function
    except: 
        print("Couldn't get the data from the website http://pylenia.pl. Check if you can get the data manually — perhaps something on the website has changed?") # status
        errorNotification("pullData function; website has changed?") # display notification
        print("Closing.") # status
        exit() # close script
    
    # compare local file with new data coming from the scraped website
    try: # try to compare the file with new info from the page
        if description is not None:
            with open(f"allergens-description-{regionID_long}.txt", "r", encoding="utf-8") as file_read:  
                description_local = file_read.read()
            if description == description_local: 
                print(f"No new conditions for {region}. Local file is up to date.") # status
                changes = 0
            else:
                with open(f"allergens-description-{regionID_long}.txt", "w", encoding="utf-8") as file:
                    file.write(description)
                print(f"Description for {region}: {description}")
                # counter
                changes = 1
            return changes
    except FileNotFoundError: # if file doesn't exist because we have added a new region do something else
        print(f"File for region {region} didn't exist. Let's create it...")
        with open(f"allergens-description-{regionID_long}.txt", "w", encoding="utf-8") as file:
                print("File created.")
                file.write(description)
        print(f"Description for {region}: {description}")
    else:
        print("For some reason returned data is empty. Check if you can get the data manually.") # status
        errorNotification("description is 'None'; check the website manually.") # display notification
        print("Closing.") # status
        exit() # close script

# --- regions defined for function --- #

# NOTE: assigned to a variable to get # of changes, same with the other two
DS = getInfo('Dolny Slask','6','R6DS') 
MZ = getInfo('Mazowsze','7','R7MZ')
MP = getInfo('Malopolska','9','R9MP')
PM = getInfo('Wybrzeze', '2', 'R2WY')

# -------- show notifications -------- #

regions_updated = DS + MZ+ MP # of changes, eg. 2 = 2 files have changed because script downloaded new data, 1 file without changes
if regions_updated > 0:
    print(f"Region(s) updated: {regions_updated}") # status
    if platform == "darwin":
        pync.notify(f'Update completed for {regions_updated} region(s).', title='Umbrella', subtitle='PollenInfoAutoUpdate', open="https://github.com/vardecab/umbrella/tree/master/py", sound="", contentImage="icons/umbrella.png")
    elif platform == "win32":
        toaster.show_toast(title="Umbrella", msg=f'PollenInfoAutoUpdate: {regions_updated} region(s) updated.', icon_path="icons/umbrella.ico", duration=None, threaded=True, callback_on_click=open_url) # duration=None - leave notification in Notification Center; threaded=True - rest of the script will be allowed to be executed while the notification is still active 
else:
    print(f"All regions are up-to-date, no changes made.") # status
    if platform == "darwin":
        pync.notify('All regions are up-to-date, no changes made.', title='Umbrella', subtitle='PollenInfoAutoUpdate', open="https://github.com/vardecab/umbrella/tree/master/py", sound="", contentImage="icons/umbrella.png")
    elif platform == "win32":
        toaster.show_toast(title="Umbrella", msg='All regions are up-to-date, no changes made.', icon_path="icons/umbrella.ico", duration=None, threaded=True, callback_on_click=open_url) # duration=None - leave notification in Notification Center; threaded=True - rest of the script will be allowed to be executed while the notification is still active 

# ------------- run time ------------- #

print("Run time:", datetime.now()-start)