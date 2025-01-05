const { generateAxiosInstance } = require("../services/axios");

require("dotenv").config();

const fetchActorsDetails = async (tmdbId, max_limit) => {
	try {
        const axiosInstance = await generateAxiosInstance();
        
		// Fetch movie actors and crew details
		const movieActorsDetails = await axiosInstance.get(
			`/movie/${tmdbId}/credits`,
			{
				params: {
					api_key: process.env.TMDB_API_KEY,
					language: "en-US",
				},
			}
		);

		// Validate the all credit person's data
		if (
			!movieActorsDetails?.data?.cast ||
			movieActorsDetails.data.cast.length === 0
		) {
			// console.log(`No cast found for movie ID: ${tmdbId}`);
			return "No actors found";
		}

		// Combine cast and crew
		const allPeople = [
			...(movieActorsDetails.data.cast || []),
			...(movieActorsDetails.data.crew || []),
		];
		const actors = allPeople.filter(
			(actor) => actor.known_for_department === "Acting"
		);
		const actorNames = actors
			.map((actor) => actor.name)
			.splice(0, max_limit)
			.join(", ");

		return actorNames;
	} catch (err) {
        throw new Error(err);
    }
};

module.exports = { fetchActorsDetails };
