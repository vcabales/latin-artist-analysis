from bs4 import BeautifulSoup
import urllib2
from w3lib.html import remove_tags
import json

wikiPage = 'https://en.wikipedia.org/wiki/List_of_Latin_pop_artists'
page = urllib2.urlopen(wikiPage)
soup = BeautifulSoup(page)


def match_class(target):
    def do_match(tag):
        classes = tag.get('class', [])
        return all(c in classes for c in target)
    return do_match


artists = soup.find_all(match_class(["div-col", "columns", "column-width"]))
artists = map(remove_tags, [str(t) for t in artists])
artists = [a.split('\n') for a in artists]
artists = [[i for i in j if i] for j in artists]
countries = soup.find_all(match_class(['mw-headline']))
countries = map(remove_tags, [str(c) for c in countries])[:-1]

d = {} # artist : country
all_latin_artists = []
for i in range(len(countries)):
    for j in artists[i]: # for each artist
        d[j] = countries[i]
        all_latin_artists.append(j)
all_latin_artists = set(all_latin_artists) # Set for O(1) lookup

# Adding a few that weren't on Wikipedia
all_latin_artists.add("Ozuna")
all_latin_artists.add("Zion & Lennox")
all_latin_artists.add("Arcangel")
all_latin_artists.add("Chris Jeday")
all_latin_artists.add("Wisin")
all_latin_artists.add("Yandel")
all_latin_artists.add("Danny Ocean")
all_latin_artists.add("Descemer Bueno")

# Read from json
year_dict = {} # year : list of artists that placed
year_songs = {} # year: list of artists that placed and their songs
i = 12
while i <= 18:
    s = '20'+str(i)+'top100.json'

    with open(s) as f:
        data = json.load(f)
        f.close()

    artists = []
    artist_tracks = []
    tracks = data["items"]
    for t in tracks:
        if t["track"]:
            artist = t["track"]["artists"]
            track_name = t["track"]["name"]
        for a in artist:
            artists.append(a["name"])
            artist_tracks.append((a["name"], track_name))
    key = 2000+i
    year_dict[key] = artists # All artists that made the top 100 in that year
    year_songs[key] = artist_tracks
    i += 1

latin_year_totals = {}
latin_year_counts = {}

artist_year_songs = {}
for year, artist_tracks in year_songs.items():
    latin_year_totals[year] = {}
    latin_year_counts[year] = 0
    artist_year_songs[year] = {}
    for a in artist_tracks:
        if a[0] in all_latin_artists:
            latin_year_counts[year] += 1
            latin_year_totals[year][a[0]] = latin_year_totals[year].get(a[0],0) + 1 # add if not added
            if a[0] not in artist_year_songs[year]:
                artist_year_songs[year][a[0]] = []
            artist_year_songs[year][a[0]].append(a[1])

print latin_year_totals # Artist and number of songs that made it to Spotify Top 100
print latin_year_counts # Number of Latin artists that placed in a given year
print artist_year_songs # Artist and their songs for the year they placed

with open('artists_totals.json','w') as f:
    json.dump(latin_year_totals,f,indent=4,sort_keys=True)
f.close()

with open('year_counts.json','w') as f:
    json.dump(latin_year_counts,f,indent=4,sort_keys=True)
f.close()

with open('artist_songs.json','w') as f:
    json.dump(artist_year_songs,f,indent=4,sort_keys=True)
f.close()
