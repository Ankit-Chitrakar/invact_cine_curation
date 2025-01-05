const { generateAxiosInstance } = require('../services/axios');

require('dotenv').config()

const fetchMovieDetails = async(tmdbId) =>{
    try{
        const axiosInstance = await generateAxiosInstance();
        
        const movieDetails = await axiosInstance.get(`/movie/${tmdbId}`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                language: 'en-US',
            }
        });

        if (!movieDetails) {
            throw new Error(`${tmdbId}: Wrong tmdbId!!`)
        }

        return movieDetails.data;
        
    }catch(err){
        throw new Error(err);
    }
}

module.exports = {fetchMovieDetails}