from bs4 import BeautifulSoup
import urllib2

wikiPage = 'https://en.wikipedia.org/wiki/List_of_Latin_pop_artists'
page = urllib2.urlopen(wikiPage)
soup = BeautifulSoup(page)


def match_class(target):
    def do_match(tag):
        classes = tag.get('class', [])
        return all(c in classes for c in target)
    return do_match


artists = soup.find_all(match_class(["div-col", "columns", "column-width"]))
print artists
