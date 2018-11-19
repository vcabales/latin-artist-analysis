from spotipy.oauth2 import SpotifyClientCredentials
import spotipy
import json

client_credentials_manager = SpotifyClientCredentials('your key here','your token here')
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

uri = 'spotify:user:spotifycharts:playlist:37i9dQZEVXbJiZcmkrIHGU'
username = uri.split(':')[2]
playlist_id = uri.split(':')[4]

# 2014
# results = sp.user_playlist('spotify', '0KzjapF1zYpPYARZFeBnYm')
# print json.dumps(results, indent=4)

d = {'2012':('spotify','0gbUKxGN0EdQytMEehGsoa'), '2013':('spotify','2kDPYiTtUtm5eZUkVYJ4f0'), '2014':('spotify','0KzjapF1zYpPYARZFeBnYm'), '2015':('spotify year in music','6MT7PxSJmrg8O31Z5vx1iJ'), '2016':('spotify year in music','2xKlsGov0EC2fhl6uXDgWZ'), '2017':('spotify','37i9dQZF1DX5nwnRMcdReF'), '2018':('spotify','4hOKQuZbraPDIfaGbM3lKI')}

for k,v in d.items():
    print 'info for year: ' + k
    print v[0]
    print v[1]
    results = sp.user_playlist_tracks(v[0],v[1])
    f = './'+k+'top100.json'
    with open(f,'w') as outfile:
        json.dump(results,outfile,indent=4)
    outfile.close()
