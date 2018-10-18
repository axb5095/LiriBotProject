require("dotenv").config();

//var spotify = require('spotify');
//var SpotifyWebApi = require('spotify-web-api-node'); 
var SpotifyWebApi = require('node-spotify-api'); 
const OmdbApi = require('omdb-api-pt')
var fs = require('fs');
var keys= require("./keys.js");

/*
*	Load the spotify keys
*/

var spotifyApi = new SpotifyWebApi(keys.spotify);
  
/*spotifyApi.clientCredentialsGrant().then(
	function (data) {
		console.log('The access token expires in ' + data.body['expires_in']);
		console.log('The access token is ' + data.body['access_token']);

		// Save the access token so that it's used in future calls
		spotifyApi.setAccessToken(data.body['access_token']);
	},
	function (err) {
		console.log(
			'Something went wrong when retrieving an access token',
			err.message
		);
	}
);*/
// Create a new instance of the module.
const omdb = new OmdbApi({
	apiKey:'63abbee7' // Your API key.
  })

/*
* 	Read in command line arguments
*/

// Read in the command line arguments
var cmdArgs = process.argv;

// The LIRI command will always be the second command line argument
var liriCommand = cmdArgs[2];

// The parameter to the LIRI command may contain spaces
var liriArg = '';
for (var i = 3; i < cmdArgs.length; i++) {
	liriArg += cmdArgs[i] + ' ';
}

function concertSong(song) {
	// Append the command to the log file
	fs.appendFile('./concertlog.txt', 'User Command: node liri.js concert-this ' + song + '\n\n', (err) => {
		if (err) throw err;
	});

	// If no song is provided, LIRI defaults to 'Taylor Swift'
	var search;
	if (song === '') {
		search = "https://rest.bandsintown.com/artists/taylor%20swift/events?app_id=codingbootcamp";
	} else {
		search = "https://rest.bandsintown.com/artists/"+song.trim()+"/events?app_id=codingbootcamp";
	}
	console.log(search);
	spotifyApi.request(search).then(
		function (data) {
			console.log(data);
		},
		function (err) {
			console.error(err);
		}
	);

}

// spotifySong will retrieve information on a song from Spotify
function spotifySong(song) {
	// Append the command to the log file
	fs.appendFile('./spotifylog.txt', 'User Command: node liri.js spotify-this-song ' + song + '\n\n', (err) => {
		if (err) throw err;
	});

	// If no song is provided, LIRI defaults to 'Hotel California'
	var search;
	if (song === '') {
		search = 'Ace of Base';
	} else {
		search = song;
	}

	//spotifyApi.searchTracks({type:'track',query:search).then(
	spotifyApi.search({type:'track',query:search}).then(
		function (data) {
			console.log(data);
		},
		function (err) {
			console.error(err);
		}
	);

}

// omdapi will get movie information
function omdapiMovie(movie) {
	// Append the command to the log file
	fs.appendFile('./omdbapilog.txt', 'User Command: node liri.js omdbapi-this-movie ' + movie + '\n\n', (err) => {
		if (err) throw err;
	});

	// If no movie is provided, LIRI defaults to 'The Matrix'
	var searchmovie;
	if (movie === '') {
		searchmovie = 'The Matrix';
	} else {
		searchmovie = movie.trim();
	}

	//movie = "The Matrix";

    console.log(searchmovie);
	omdb.bySearch({
		search: searchmovie
	  }).then(res => console.log(res))
		.catch(err => console.error(err))

}

// Determine which LIRI command is being requested by the user
if (liriCommand === 'concert-this-song') {
	concertSong(liriArg);

} else if (liriCommand === `spotify-this-song`) {
	spotifySong(liriArg);

}  else if (liriCommand === `omdbapi-this-movie`) {
	omdapiMovie(liriArg);

}
else {
	// Append the command to the log file
	fs.appendFile('./log.txt', 'User Command: ' + cmdArgs + '\n\n', (err) => {
		if (err) throw err;

		// If the user types in a command that LIRI does not recognize, output the Usage menu 
		// which lists the available commands.
		outputStr = 'Usage:\n' +
			'    node liri.js concert-this-song "<song_name>"\n' +
			'    node liri.js spotify-this-song "<song_name>"\n';

		// Append the output to the log file
		fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
			if (err) throw err;
			console.log(outputStr);
		});
	});
}