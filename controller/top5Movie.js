const {movie, review} = require("../models");

const getTop5Movies = async (req, res) => {
	try {
		const movies = await movie.findAll({
			limit: 5,
			order: [["rating", "DESC"]],
			include: [{ model: review, attributes: ["rating", "reviewText"] }],
		});

        const formattedMoviesResponse = movies.map((movie) => ({
            title: movie.title,
            rating: movie.rating,
            review: movie.reviews.map((review) => ({
                text: review.reviewText,
                wordCount: review.reviewText.split(" ").filter(Boolean).length,
            })),
        }));

		return res.json({ movies: formattedMoviesResponse });
	} catch (error) {
		console.log("movie controller", error.message);
		return res.status(500).json({ error: error.message });
	}
};

module.exports = {getTop5Movies}