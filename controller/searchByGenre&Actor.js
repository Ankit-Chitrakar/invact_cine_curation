// in here search in watchlist, wishlist and curatedList by genre and actors of movie
// so lets suppose for watchlist fisrt fetch all the movieId store it in a array and then by each movieId fetch all details of movie and then filtered with actors name and genre 

const { movie } = require('../models');

// extra for watchList serach by genre and actors
const searchByGenreAndActor = async (req, res) => {
    try {
        const { actor, genre } = req.query;

        if (!actor || !genre) {
            return res.status(400).json({ error: "Query parameters 'actors' and 'genre' are required." });
        }

        // Fetch all the movieId from watchlist
        const movieList = await movie.findAll({
            attributes: ['id']
        });

        const movieIdList = movieList.map((movie)=> movie.id);
        // console.log(movieIdList);

        // fetch all movies details by movieId
        const movieDetailsList = await Promise.all(
            movieIdList.map(async (movieId)=>{
                const movieDetails = await movie.findOne({ where: { id: movieId } });
                return movieDetails;
            })
        )

        // filter as per genre and actor
        const filteredMovieDetailsList = movieDetailsList.filter((movieDetails)=> {
            return movieDetails.actors.toLowerCase().includes(actor.toLowerCase()) && movieDetails.genre.toLowerCase().includes(genre.toLowerCase());
        });

        res.status(200).json({ movies: filteredMovieDetailsList });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


module.exports = { searchByGenreAndActor };
