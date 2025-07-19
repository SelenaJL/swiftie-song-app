# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

# Create tiers
Tier.find_or_create_by!(name: "Mastermind", description: "Songs you'd play on repeat because they're iconic.", value: 3)
Tier.find_or_create_by!(name: "Gorgeous", description: "Songs you'd recommend to others.", value: 2)
Tier.find_or_create_by!(name: "Nothing New", description: "Songs you'd listen to.", value: 1)
Tier.find_or_create_by!(name: "I Forgot That You Existed", description: "Songs you'd skip.", value: 0)

# Create albums
taylor_swift = Album.find_or_create_by!(title: "Taylor Swift", release_year: 2006, color: "teal")
fearless = Album.find_or_create_by!(title: "Fearless", release_year: 2008, color: "yellow")
speak_now = Album.find_or_create_by!(title: "Speak Now", release_year: 2010, color: "purple")
red = Album.find_or_create_by!(title: "Red", release_year: 2012, color: "red")
a1989 = Album.find_or_create_by!(title: "1989", release_year: 2014, color: "light blue")
reputation = Album.find_or_create_by!(title: "Reputation", release_year: 2017, color: "black")
lover = Album.find_or_create_by!(title: "Lover", release_year: 2019, color: "pink")
folklore = Album.find_or_create_by!(title: "Folklore", release_year: 2020, color: "grey")
evermore = Album.find_or_create_by!(title: "Evermore", release_year: 2020, color: "tan")
midnights = Album.find_or_create_by!(title: "Midnights", release_year: 2022, color: "dark blue")
ttpd = Album.find_or_create_by!(title: "The Tortured Poets Department", release_year: 2024, color: "white")

# Create songs for Taylor Swift
  [
    "Tim McGraw",
    "Picture to Burn",
    "Teardrops on My Guitar",
    "A Place in this World",
    "Cold as You",
    "The Outside",
    "Tied Together with a Smile",
    "Stay Beautiful",
    "Should've Said No",
    "Mary's Song (Oh My My My)",
    "Our Song",
    "I'm Only Me When I'm With You",
    "Invisible",
    "A Perfectly Good Heart",
  ].each do |title|
    Song.find_or_create_by!(title: title, album: taylor_swift)
  end
