# === libs ===

import requests 
from urllib.request import urlopen # open URLs
from bs4 import BeautifulSoup # BeautifulSoup; parsing HTML
import re # regex; extract substrings
from datetime import datetime # calculate script's run time
import sys # workaround for encoding error (https://stackoverflow.com/questions/33444740/unicodedecodeerror-charmap-codec-cant-encode-character-x-at-position-y-char)

# === start + run time ===

print("Starting...")
start = datetime.now() # run time

# === FIX, 2nd 'API' ===

# new 'API' = http://pylenia.pl/search.html?r=6&a=0&from=09-01-2021&to=16-01-2021&w=0
# base URL =  http://pylenia.pl/search.html?
# region Slask: r=6
# region Malopolska: r=9
# region Mazowsze: r=7
# aktualne pylenie: a=0 
# pylenie bylicy: a=8
# data: from=09-01-2021&to=16-01-2021 // DD-MM-YYYY
# aktualny tydzien: w=1
# nastepny tydzien: w=0 

### regions:
# <option regId="1" value=0>Cała Polska</option>
# <option regId="2" value=1>Wybrzeże</option>
# <option regId="3" value=2>Pomorze</option>
# <option regId="4" value=3>Warmia, Mazury, Podlasie</option>
# <option regId="5" value=4>Ziemia Lubuska</option>
# <option selected="" regId="6" value=5>Śląsk i Wielkopolska</option>
# <option regId="7" value=6>Mazowsze i ziemia Lubelska</option>
# <option regId="8" value=7>Sudety</option>
# <option regId="9" value=8>Małopolska</option>
# <option regId="10" value=9>Karpaty</option>

# === remove HTML tags from text ===

def cleanhtml(raw_html):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext

# === R6DS ===

page_url = 'http://pylenia.pl/search.html?r=6&a=0&w=1' # Dolny Śląsk

page = urlopen(page_url)
soup = BeautifulSoup(page, 'html.parser') # parse the page
# with open(r"api2_output.html", "w", encoding="utf-8") as file:
#     file.write(str(soup))
# print(soup, file=sys.stderr) # debug

description = soup.find("div", {"class":"pollen-item-cont"}) # find the div with desired info
description = str(description) # convert to string
description = re.search(r'(<div(.*?)>(.*?)</div>)', description) # find the info inside the tag
description = description.group(0)
description = str(cleanhtml(description)) # extract just the text
description = description.strip()
# print(description) # debug

print("Description DS:", description)
with open(r"allergens-description-R6DS.txt", "w", encoding="utf-8") as file:
    file.write(description)

# === R7MZ ===

page_url = 'http://pylenia.pl/search.html?r=7&a=0&w=1' # Mazowsze

page = urlopen(page_url)
soup = BeautifulSoup(page, 'html.parser') # parse the page

description = soup.find("div", {"class":"pollen-item-cont"}) # find the div with desired info
description = str(description) # convert to string
description = re.search(r'(<div(.*?)>(.*?)</div>)', description) # find the info inside the tag
description = description.group(0)
description = str(cleanhtml(description)) # extract just the text
description = description.strip()

print("Description MZ:", description)
with open(r"allergens-description-R7MZ.txt", "w", encoding="utf-8") as file:
    file.write(description)

# === R9MP ===

page_url = 'http://pylenia.pl/search.html?r=9&a=0&w=1' # Małopolska

page = urlopen(page_url)
soup = BeautifulSoup(page, 'html.parser') # parse the page

description = soup.find("div", {"class":"pollen-item-cont"}) # find the div with desired info
description = str(description) # convert to string
description = re.search(r'(<div(.*?)>(.*?)</div>)', description) # find the info inside the tag
description = description.group(0)
description = str(cleanhtml(description)) # extract just the text
description = description.strip()

print("Description MP:", description)
with open(r"allergens-description-R9MP.txt", "w", encoding="utf-8") as file:
    file.write(description)

# === run time ===

print("Run time:", datetime.now()-start)