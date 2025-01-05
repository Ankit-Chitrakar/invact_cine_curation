const axios = require('axios');
require('dotenv').config();

const generateAxiosInstance = async () => {
    try {
        const { TMDB_BASE_URL, TMDB_ACCESS_TOKEN } = process.env;

        if (!TMDB_ACCESS_TOKEN) {
            throw new Error('TMDB Access token is missing. Please configure TMDB_ACCESS_TOKEN in the .env file.');
        }

        if (!TMDB_BASE_URL) {
            throw new Error('TMDB base URL is missing. Please configure TMDB_BASE_URL in the .env file.');
        }

        return axios.create({
            baseURL: TMDB_BASE_URL,
            headers: {
                Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
                Accept: 'application/json',
            },
        });
    } catch (err) {
        console.error('Error creating TMDB Axios instance:', err.message || err);
        throw err;
    }
};

module.exports = { generateAxiosInstance };
