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

# Create songs for Fearless
  [
    { title: "Fearless" },
    { title: "Fifteen" },
    { title: "Love Story" },
    { title: "Hey Stephen" },
    { title: "White Horse" },
    { title: "You Belong With Me" },
    { title: "Breathe", feature: "Colbie Caillat" },
    { title: "Tell Me Why" },
    { title: "You're Not Sorry" },
    { title: "The Way I Loved You" },
    { title: "Forever & Always" },
    { title: "The Best Day" },
    { title: "Change" },
    { title: "Jump Then Fall" },
    { title: "Untouchable" },
    { title: "Come In With The Rain" },
    { title: "Superstar" },
    { title: "The Other Side Of The Door" },
    { title: "Today Was A Fairytale" },
    { title: "You All Over Me", feature: "Maren Morris", from_the_vault: true },
    { title: "Mr. Perfectly Fine", from_the_vault: true },
    { title: "We Were Happy", from_the_vault: true },
    { title: "That's When", feature: "Keith Urban", from_the_vault: true },
    { title: "Don't You", from_the_vault: true },
    { title: "Bye Bye Baby", from_the_vault: true },
  ].each do |song_data|
    Song.find_or_create_by!(song_data.merge(album: fearless))
  end

# Create songs for Speak Now
  [
    { title: "Mine" },
    { title: "Sparks Fly" },
    { title: "Back To December" },
    { title: "Speak Now" },
    { title: "Dear John" },
    { title: "Mean" },
    { title: "The Story Of Us" },
    { title: "Never Grow Up" },
    { title: "Enchanted" },
    { title: "Better Than Revenge" },
    { title: "Innocent" },
    { title: "Haunted" },
    { title: "Last Kiss" },
    { title: "Long Live" },
    { title: "Ours" },
    { title: "Superman" },
    { title: "Electric Touch", feature: "Fall Out Boy", from_the_vault: true },
    { title: "When Emma Falls in Love", from_the_vault: true },
    { title: "I Can See You", from_the_vault: true },
    { title: "Castles Crumbling", feature: "Hailey Williams", from_the_vault: true },
    { title: "Foolish One", from_the_vault: true },
    { title: "Timeless", from_the_vault: true },
  ].each do |song_data|
    Song.find_or_create_by!(song_data.merge(album: speak_now))
  end

# Create songs for Red
  [
    { title: "State Of Grace" },
    { title: "Red" },
    { title: "Treacherous" },
    { title: "I Knew You Were Trouble" },
    { title: "All Too Well" },
    { title: "22" },
    { title: "I Almost Do" },
    { title: "We Are Never Ever Getting Back Together" },
    { title: "Stay Stay Stay" },
    { title: "The Last Time", feature: "Gary Lightbody" },
    { title: "Holy Ground" },
    { title: "Sad Beautiful Tragic" },
    { title: "The Lucky One" },
    { title: "Everything Has Changed", feature: "Ed Sheeran" },
    { title: "Starlight" },
    { title: "Begin Again" },
    { title: "The Moment I Knew" },
    { title: "Come Back...Be Here" },
    { title: "Girl At Home" },
    { title: "Ronan" },
    { title: "Better Man", from_the_vault: true },
    { title: "Nothing New", feature: "Phoebe Bridgers", from_the_vault: true },
    { title: "Babe", from_the_vault: true },
    { title: "Message In A Bottle", from_the_vault: true },
    { title: "I Bet You Think About Me", feature: "Chris Stapleton", from_the_vault: true },
    { title: "Forever Winter", from_the_vault: true },
    { title: "Run", feature: "Ed Sheeran", from_the_vault: true },
    { title: "The Very First Night", from_the_vault: true },
  ].each do |song_data|
    Song.find_or_create_by!(song_data.merge(album: red))
  end

# Create songs for 1989
  [
    { title: "Welcome To New York" },
    { title: "Blank Space" },
    { title: "Style" },
    { title: "Out Of The Woods" },
    { title: "All You Had To Do Was Stay" },
    { title: "Shake It Off" },
    { title: "I Wish You Would" },
    { title: "Bad Blood" },
    { title: "Wildest Dreams" },
    { title: "How You Get The Girl" },
    { title: "This Love" },
    { title: "I Know Places" },
    { title: "Clean" },
    { title: "Wonderland" },
    { title: "You Are In Love" },
    { title: "New Romantics" },
    { title: "\"Slut!\"", from_the_vault: true },
    { title: "Say Don't Go", from_the_vault: true },
    { title: "Now That We Don't Talk", from_the_vault: true },
    { title: "Suburban Legends", from_the_vault: true },
    { title: "Is It Over Now?", from_the_vault: true },
  ].each do |song_data|
    Song.find_or_create_by!(song_data.merge(album: a1989))
  end

# Create songs for Reputation
  [
    { title: "…Ready For It?" },
    { title: "End Game", feature: "Ed Sheeran, Future" },
    { title: "I Did Something Bad" },
    { title: "Don't Blame Me" },
    { title: "Delicate" },
    { title: "Look What You Made Me Do" },
    { title: "So It Goes…" },
    { title: "Gorgeous" },
    { title: "Getaway Car" },
    { title: "King Of My Heart" },
    { title: "Dancing With Our Hands Tied" },
    { title: "Dress" },
    { title: "This Is Why We Can't Have Nice Things" },
    { title: "Call It What You Want" },
    { title: "New Years Day" },
  ].each do |song_data|
    Song.find_or_create_by!(song_data.merge(album: reputation))
  end

# Create songs for Lover
  [
    { title: "I Forgot That You Existed" },
    { title: "Cruel Summer" },
    { title: "Lover" },
    { title: "The Man" },
    { title: "The Archer" },
    { title: "I Think He Knows" },
    { title: "Miss Americana & The Heartbreak Prince" },
    { title: "Paper Rings" },
    { title: "Cornelia Street" },
    { title: "Death By A Thousand Cuts" },
    { title: "London Boy" },
    { title: "Soon You'll Get Better", feature: "The Chicks" },
    { title: "False God" },
    { title: "You Need To Calm Down" },
    { title: "Afterglow" },
    { title: "Me!", feature: "Brendon Urie of Panic! At The Disco" },
    { title: "It's Nice To Have A Friend" },
    { title: "Daylight" },
  ].each do |song_data|
    Song.find_or_create_by!(song_data.merge(album: lover))
  end

# Create songs for Folklore
  [
    { title: "the 1" },
    { title: "cardigan" },
    { title: "the last great american dynasty" },
    { title: "exile", feature: "Bon Iver" },
    { title: "my tears ricochet" },
    { title: "mirrorball" },
    { title: "seven" },
    { title: "august" },
    { title: "this is me trying" },
    { title: "illicit affairs" },
    { title: "invisible string" },
    { title: "mad woman" },
    { title: "epiphany" },
    { title: "betty" },
    { title: "peace" },
    { title: "hoax" },
    { title: "the lakes" },
  ].each do |song_data|
    Song.find_or_create_by!(song_data.merge(album: folklore))
  end

# Create songs for Evermore
  [
    { title: "willow" },
    { title: "champagne problems" },
    { title: "gold rush" },
    { title: "'tis the damn season" },
    { title: "tolerate it" },
    { title: "no body, no crime", feature: "Haim" },
    { title: "happiness" },
    { title: "dorothea" },
    { title: "coney island", feature: "The National" },
    { title: "ivy" },
    { title: "cowboy like me" },
    { title: "long story short" },
    { title: "marjorie" },
    { title: "closure" },
    { title: "evermore", feature: "Bon Iver" },
    { title: "right where you left me" },
    { title: "it's time to go" },
  ].each do |song_data|
    Song.find_or_create_by!(song_data.merge(album: evermore))
  end

# Create songs for Midnights
  [
    { title: "Lavender Haze" },
    { title: "Maroon" },
    { title: "Anti-Hero" },
    { title: "Snow on the Beach", feature: "Lana Del Rey" },
    { title: "You're on Your Own, Kid" },
    { title: "Midnight Rain" },
    { title: "Question...?" },
    { title: "Vigilante Shit" },
    { title: "Bejeweled" },
    { title: "Karma" },
    { title: "Sweet Nothing" },
    { title: "Mastermind" },
    { title: "The Great War" },
    { title: "Bigger Than The Whole Sky" },
    { title: "Paris" },
    { title: "High Infidelity" },
    { title: "Glitch" },
    { title: "Would've, Could've, Should've" },
    { title: "Dear Reader" },
    { title: "Hits Different" },
  ].each do |song_data|
    Song.find_or_create_by!(song_data.merge(album: midnights))
  end

# Create songs for The Tortured Poets Department
  [
    { title: "Fortnight", feature: "Post Malone" },
    { title: "The Tortured Poets Department" },
    { title: "My Boy Only Breaks His Favorite Toys" },
    { title: "Down Bad" },
    { title: "So Long, London" },
    { title: "But Daddy I Love Him" },
    { title: "Fresh Out the Slammer" },
    { title: "Florida!!!", feature: "Florence + The Machine" },
    { title: "Guilty as Sin?" },
    { title: "Who's Afraid of Little Old Me?" },
    { title: "I Can Fix Him (No Really I Can)" },
    { title: "loml" },
    { title: "I Can Do It With a Broken Heart" },
    { title: "The Smallest Man Who Ever Lived" },
    { title: "The Alchemy" },
    { title: "Clara Bow" },
    { title: "The Black Dog" },
    { title: "imgonnagetyouback" },
    { title: "The Albatross" },
    { title: "Chloe or Sam or Sophia or Marcus" },
    { title: "How Did It End?" },
    { title: "So High School" },
    { title: "I Hate It Here" },
    { title: "thanK you aIMee" },
    { title: "I Look in People's Windows" },
    { title: "The Prophecy" },
    { title: "Cassandra" },
    { title: "Peter" },
    { title: "The Bolter" },
    { title: "Robin" },
    { title: "The Manuscript" },
  ].each do |song_data|
    Song.find_or_create_by!(song_data.merge(album: ttpd))
  end
  