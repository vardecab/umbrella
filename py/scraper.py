import requests 
from urllib.request import urlopen # open URLs
from bs4 import BeautifulSoup # BeautifulSoup; parsing HTML
import re # regex; extract substrings
from datetime import datetime # calculate script's run time

print("Starting...")
start = datetime.now()

# === R5MZ ===

page_url = 'https://www.claritine.pl/pl/prognoza-dla-alergikow/aktualna-prognoza-pylenia/?region=5' # Mazowsze

page = urlopen(page_url)
soup = BeautifulSoup(page, 'html.parser') # parse the page

def cleanhtml(raw_html):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext

# get update's date range
date_range = soup.find("h3", {"class":"datekalendartitle"})
date_range = str(date_range)
date_range = re.search(r'<span>(.+)((\s)+(.+))+</span>', date_range)
date_range = date_range.group(0)
date_range = str(cleanhtml(date_range))
date_range = date_range.strip()

# get description
description = soup.find("div", {"class":"description"})
description = str(description)
description = re.search(r'(<p>(.|\n)*?<\/p>)', description)
description = description.group(0)
description = str(cleanhtml(description))
description = description.strip()

print("Date range:", date_range)
with open(r"allergens-date_range.txt", "w", encoding="utf-8") as file:
    file.write(date_range)

print("Description MZ:", description)
with open(r"allergens-description-R5MZ.txt", "w", encoding="utf-8") as file:
    file.write(description)

# === R6DS ===

page_url = 'https://www.claritine.pl/pl/prognoza-dla-alergikow/aktualna-prognoza-pylenia/?region=6' # Dolny Śląsk

page = urlopen(page_url)
soup = BeautifulSoup(page, 'html.parser') # parse the page

def cleanhtml(raw_html):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext

# get update's date range
date_range = soup.find("h3", {"class":"datekalendartitle"})
date_range = str(date_range)
date_range = re.search(r'<span>(.+)((\s)+(.+))+</span>', date_range)
date_range = date_range.group(0)
date_range = str(cleanhtml(date_range))
date_range = date_range.strip()

# get description
description = soup.find("div", {"class":"description"})
description = str(description)
description = re.search(r'(<p>(.|\n)*?<\/p>)', description)
description = description.group(0)
description = str(cleanhtml(description))
description = description.strip()

print("Date range:", date_range)
with open(r"allergens-date_range.txt", "w", encoding="utf-8") as file:
    file.write(date_range)

print("Description DS:", description)
with open(r"allergens-description-R6DS.txt", "w", encoding="utf-8") as file:
    file.write(description)

# === R7MP ===

page_url = 'https://www.claritine.pl/pl/prognoza-dla-alergikow/aktualna-prognoza-pylenia/?region=7' # Małopolska

page = urlopen(page_url)
soup = BeautifulSoup(page, 'html.parser') # parse the page

def cleanhtml(raw_html):
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, '', raw_html)
    return cleantext

# get update's date range
date_range = soup.find("h3", {"class":"datekalendartitle"})
date_range = str(date_range)
date_range = re.search(r'<span>(.+)((\s)+(.+))+</span>', date_range)
date_range = date_range.group(0)
date_range = str(cleanhtml(date_range))
date_range = date_range.strip()

# get description
description = soup.find("div", {"class":"description"})
description = str(description)
description = re.search(r'(<p>(.|\n)*?<\/p>)', description)
description = description.group(0)
description = str(cleanhtml(description))
description = description.strip()

print("Date range:", date_range)
with open(r"allergens-date_range.txt", "w", encoding="utf-8") as file:
    file.write(date_range)

print("Description MP:", description)
with open(r"allergens-description-R7MP.txt", "w", encoding="utf-8") as file:
    file.write(description)

print("Run time:", datetime.now()-start)