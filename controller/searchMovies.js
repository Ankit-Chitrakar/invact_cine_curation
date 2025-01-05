const { generateAxiosInstance } = require('../services/axios');
const { fetchActorsDetails } = require('../utils/fetchActors');
require('dotenv').config();

const searchMovieController = async (req, res) => {
    try {
        const movie = req.query.query;
        if (!movie) {
            return res.status(400).json({ message: "Query parameter 'query' is required." });
        }

        const axiosInstance = await generateAxiosInstance();

        // Fetch movie search results
        const movieResponse = await axiosInstance.get('/search/movie', {
            params: {
                query: movie,
                language: 'en-US',
                include_adult: true,
                page: 1,
                api_key: process.env.TMDB_API_KEY
            }
        });

        const moviesWithActors = await Promise.all(
            movieResponse.data.results.map(async (movie) => {
                const actors = await fetchActorsDetails(movie.id, 5);
                // console.log(actors, movie.id)
                return {
                    title: movie.title,
                    tmdbId: movie.id,
                    genre: movie.genre_ids ? movie.genre_ids.join(', ') : 'N/A',
                    actors: actors,
                    releaseYear: movie.release_date ? movie.release_date.slice(0, 4) : 'N/A',
                    rating: movie.vote_average || 'N/A',
                    description: movie.overview || 'N/A',
                };
            })
        );

        res.status(200).json({
            movies: moviesWithActors,
        });


    } catch (err) {
        console.error('Error:', err.message);
        return res.status(500).json({ message: err.message || 'An unexpected error occurred.' });
    }
};

module.exports = { searchMovieController };
