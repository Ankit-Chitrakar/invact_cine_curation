const { movie } = require('../models');

const movieExistsInDB = async (tmdbId) => {
    // Check if the movie exists in the database by tmdbId
    const movieDetails = await movie.findOne({ where: { tmdbId } });

    return movieDetails ? movieDetails : null;
};

module.exports = { movieExistsInDB };
