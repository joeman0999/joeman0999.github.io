from skyfield.api import load, wgs84

# Create a timescale and ask the current time.
ts = load.timescale()
t = ts.now()

# t = ts.utc(2014, 1, 23, 11, 18, 7)

stations_url = 'http://celestrak.org/NORAD/elements/stations.txt'
satellites = load.tle_file(stations_url)
by_name = {sat.name: sat for sat in satellites}
satellite = by_name['ISS (ZARYA)']
print(satellite)

geocentric = satellite.at(t)
lat, lon = wgs84.latlon_of(geocentric)
alt = wgs84.height_of(geocentric)

print('Latitude: ', lat)
print('Longitude: ', lon)
print('Altitude: ', alt)

# Gets planet data 

# # Load the JPL ephemeris DE421 (covers 1900-2050).
# planets = load('de421.bsp')
# earth, mars = planets['earth'], planets['mars']

# # What's the position of Mars, viewed from Earth?
# astrometric = earth.at(t).observe(mars)
# ra, dec, distance = astrometric.radec()

# print(ra)
# print(dec)
# print(distance)