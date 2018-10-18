const OmdbApi = require('omdb-api-pt')
 
// Create a new instance of the module.
const omdb = new OmdbApi({
  apiKey:'63abbee7' // Your API key.
})

omdb.byId({
  imdb: 'tt0412142',
  title: 'House',
  type: 'series',
  year: 2004,
  plot: 'full',
  tomatoes: true,
  season: 1
}).then(res => console.log(res))
  .catch(err => console.error(err))


  omdb.bySearch({
  search: 'The Matrix'
  
}).then(res => console.log(res))
  .catch(err => console.error(err))

