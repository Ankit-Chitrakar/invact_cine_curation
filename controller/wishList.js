const { movie, wishlist } = require("../models");
const { checkPresentInWishList } = require("../utils/checkAlreadyPresentInDB");
const { fetchActorsDetails } = require("../utils/fetchActors");
const { fetchMovieDetails } = require("../utils/fetchMovieDetails");
const { movieExistsInDB } = require("../utils/movieExistsInDB");

const addToWishList = async (req, res) => {
    try {
        const tmdbId = parseInt(req.body.tmdbId);

        if (!tmdbId) {
            return res.status(400).json({ message: "TMDB ID is required." });
        }

        // Check if the movie is already in the wishlist
        const alreadyAdded = await checkPresentInWishList(tmdbId);
        if (alreadyAdded) {
            return res
                .status(400)
                .json({ message: "This movie is already in your wishlist." });
        }

        // Search for existing movie in DB or not
        let existingMovie = await movieExistsInDB(tmdbId);

        if (!existingMovie) {
            // Movie is not in the DB, so add it to the DB
            const movieDetails = await fetchMovieDetails(tmdbId);
            const actorDetails = await fetchActorsDetails(tmdbId, 5);

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
                rating: movieDetails.vote_average
                    ? movieDetails.vote_average
                    : "N/A",
                description: movieDetails.overview ? movieDetails.overview : "N/A",
            });
        }

        // Add movie to wishlist
        await wishlist.create({
            movieId: existingMovie.id,
        });

        res.status(201).json({
            message: `Movie added to wishlist successfully`,
            movie: existingMovie,
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

module.exports = { addToWishList };
