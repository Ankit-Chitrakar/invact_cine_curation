const { movieExistsInDB } = require("../utils/movieExistsInDB");
const { watchlist, movie } = require("../models");
const { fetchMovieDetails } = require("../utils/fetchMovieDetails");
const { fetchActorsDetails } = require("../utils/fetchActors");
const { checkPresentInWathchList } = require("../utils/checkAlreadyPresentInDB");
require("dotenv").config();

const addToWatchList = async (req, res) => {
	try {
		const tmdbId = parseInt(req.body.tmdbId);

		if (!tmdbId) {
			return res.status(400).json({ message: "TMDB ID is required." });
		}

        // Check if the movie is already in the watchlist
        const alreadyAdded = await checkPresentInWathchList(tmdbId);
        if (alreadyAdded) {
            return res.status(400).json({ message: "This movie is already in your watchlist." });
        }

		// Check if movie is present in the DB
		let existingMovie = await movieExistsInDB(tmdbId);


		if (!existingMovie) {
			// If movie doesn't exist, fetch details from TMDB and add to DB
			const movieDetails = await fetchMovieDetails(tmdbId);
			const actorDetails = await fetchActorsDetails(tmdbId, 5);

			// Create the movie in the DB
			existingMovie = await movie.create({
				title: movieDetails.title,
				tmdbId: movieDetails.id,
				genre: movieDetails.genres
					? movieDetails.genres.map((genre) => genre.name).join(", ")
					: "N/A",
				actors: actorDetails,
				releaseYear: movieDetails.release_date
					? movieDetails.release_date.slice(0, 4)
					: "N/A",
				rating: movieDetails.vote_average ? movieDetails.vote_average : "N/A",
				description: movieDetails.overview ? movieDetails.overview : "N/A",
			});
		}

		// Add the movie to the watchlist
		await watchlist.create({
			movieId: existingMovie.id,
		});

		res.status(201).json({ 
            message: `Movie added to watchlist successfully`,
            movie: existingMovie,
        });
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
};

module.exports = { addToWatchList };
