require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const { send } = require('process')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')


const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
})

// Retrieve an access token
spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))

// Our routes go here:

app.get('/', (request, response) => {
    response.render('home')
})

app.get('/artist-search', (request, response) => {
    const { artist } = request.query
    console.log(artist)

    spotifyApi
        .searchArtists(artist)
        .then(data => {
            console.log('The received data from the API: ', data.body)
            const { artists } = data.body
            const { items } = artists
            response.render("artist-search-results", { items })

        })
        .catch(err => console.log('An error while searching artists occurred: ', err))


})



app.get('/albums/:artistId', (request, response, next) => {
    const {artistId} = request.params
    console.log(artistId)
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            console.log('Artist albums', data.body); 
            const { artistAlbums } = data.body
            const { items } = artists
        })

        .catch(err => console.log('An error while showing the album occured: ', err))
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))

