# === libs ===

from urllib.request import urlopen # open URLs
from bs4 import BeautifulSoup # BeautifulSoup; parsing HTML
import re # regex; extract substrings
from datetime import datetime # calculate script's run time
from datetime import timedelta # addition and subtraction of dates

# === start + run time ===

print("Starting...")
start = datetime.now() # run time

# === debug === 

# page_url = 'http://pylenia.pl/search.html?r=6&a=0&w=1' # Dolny Śląsk

# page = urlopen(page_url)
# soup = BeautifulSoup(page, 'html.parser') # parse the page
# with open(r"api2_bs_output.html", "w", encoding="utf-8") as file:
#     file.write(str(soup))
# print(soup, file=sys.stderr) # debug

# === notifications ===

from sys import platform # check platform (Windows/Linux/macOS); macOS == darwin, Windows == win32
if platform == "darwin":
    import pync # macOS notifications

# === URL query date range start & end === 

start_date_range = datetime.now().date() # current date, YYYY-MM-DD
end_date_range = start_date_range + timedelta(days=7) # add 7 days to get a full week

start_date_range = start_date_range.strftime('%d-%m-%Y') # re-format date from YYYY-MM-DD to DD-MM-YYYY
end_date_range = end_date_range.strftime('%d-%m-%Y') # re-format date from YYYY-MM-DD to DD-MM-YYYY

# === functions ===

# isolate pure text from HTML
def cleanHTML(raw_html):
    cleanr = re.compile('<.*?>') # remove HTML tags
    cleanText = re.sub(cleanr, '', raw_html)
    return cleanText

# get data from the website
def pullData(soup):
    description = soup.find("div", {"class":"pollen-item-cont"}) # find the div with desired info
    description = str(description) # convert to string
    description = re.search(r'(<div(.*?)>(.*?)</div>)', description) # find the info inside the tag
    try: 
        description = description.group(0)
    except: 
        print('Something went wrong on the website. I cannot pull the data.')
        return
    description = str(cleanHTML(description)) # extract just the text
    description = description.strip()
    # print(description) # debug
    return description
    # if description != 'None' or description is not None:
    #     return description
    # else: 
    #     print('fail')
    # type(description) # debug

# === R6DS ===

page_url = f'http://pylenia.pl/search.html?r=6&a=0&from={start_date_range}&to={end_date_range}&w=1' # Dolny Śląsk
# print(page_url) # debug

page = urlopen(page_url)
soup = BeautifulSoup(page, 'html.parser') # parse the page

description = pullData(soup)
if description is not None:
    print("Description DS:", description)
    with open(r"allergens-description-R6DS.txt", "w", encoding="utf-8") as file:
        file.write(description)
else: 
    exit()
    
# === R7MZ ===

page_url = f'http://pylenia.pl/search.html?r=7&a=0&from={start_date_range}&to={end_date_range}&w=1' # Mazowsze

page = urlopen(page_url)
soup = BeautifulSoup(page, 'html.parser') # parse the page

description = pullData(soup)
if description is not None:
    print("Description MZ:", description)
    with open(r"allergens-description-R7MZ.txt", "w", encoding="utf-8") as file:
        file.write(description)
else: 
    exit()

# === R9MP ===

page_url = f'http://pylenia.pl/search.html?r=9&a=0&from={start_date_range}&to={end_date_range}&w=1' # Małopolska

page = urlopen(page_url)
soup = BeautifulSoup(page, 'html.parser') # parse the page

description = pullData(soup)
if description is not None:
    print("Description MP:", description)
    with open(r"allergens-description-R9MP.txt", "w", encoding="utf-8") as file:
        file.write(description) 
else: 
    exit()

# === done === 

if platform == "darwin":
    pync.notify(f'Update complete.', title='Umbrella', subtitle='PollenInfoAutoUpdate', open="https://github.com/vardecab/umbrella/tree/master/py", contentImage="https://github.com/vardecab/umbrella/blob/master/images/umbrella-icon_blue-circle.png?raw=true", sound="Funk")

# === run time ===

print("Run time:", datetime.now()-start)