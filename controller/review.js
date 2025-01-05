const {movie, review} = require('../models')

const addReviewToMovie = async(req, res)=>{
    try{
        const movieId = parseInt(req.params.movieId);
        const rating = parseFloat(req.body.rating);
        const reviewText = req.body.reviewText?.slice(0, 500);

        // Validate the input
        if(!movieId ||!rating ||!reviewText || reviewText.trim() === ''){
            return res.status(400).json({error: "Invalid input. Please provide movieId, rating, and reviewText."});
        }

        //Rating be a float between 0 and 10.
        if(rating < 0 || rating > 10){
            return res.status(400).json({error: "Invalid rating. Rating should be a float between 0 and 10."});
        }

        // revewText Maximum of 500 characters.
        if(reviewText.length > 500){
            return res.status(400).json({error: "Review text is too long. Maximum length is 500 characters."});
        }

        // check movie exists
        const existingMovie = await movie.findByPk(movieId);

        if(!existingMovie){
            return res.status(404).json({error: "Movie not found."});
        }

        // check movie exists in review table 
        const existingReview = await review.findOne({
            where: {
                movieId: movieId,
            }
        });

        if(existingReview){
            return res.status(400).json({error: "Review for this movie already exists."});
        }

        // Add the review to the review table 
        const newReview = await review.create({
            movieId,
            rating,
            reviewText,
        })

        res.status(201).json({
            message: "Review added successfully.",
            review: newReview,
        })
    }catch(err){
        return res.status(500).json({error: err.message});
    }
}

module.exports = {addReviewToMovie,}