const {movie, curatedListItem} = require("../models");
const { checkPresentInCuratedListItem } = require("../utils/checkAlreadyPresentInDB");
const { curatedListExistsInDB } = require("../utils/curatedListExistsInDB");
const { fetchActorsDetails } = require("../utils/fetchActors");
const { fetchMovieDetails } = require("../utils/fetchMovieDetails");
const { movieExistsInDB } = require("../utils/movieExistsInDB");

const addToCuratedListItem = async (req, res)=>{
    try{
        const tmdbId = parseInt(req.body.movieId);
        const curatedListId = parseInt(req.body.curatedListId);

        if(!tmdbId || !curatedListId){
            return res.status(404).json({message: 'Please fill Movie Id and Curatedlist Id'})
        }

        // check curatedListId is exist 
        const existingCuratedList = await curatedListExistsInDB(curatedListId);

        if(!existingCuratedList){
            return res.status(404).json({message: 'Invalid curatedlist id!'});
        }

        // Check if movie already exists in the curated list
        const alreadyAddedMovie = await checkPresentInCuratedListItem(tmdbId, curatedListId);

        if(alreadyAddedMovie){
            return res.status(400).json({ message: "This movie is already in your curated list." });
        }

        // chcek movie is exist in db
        let existingMovie = await movieExistsInDB(tmdbId);

        if(!existingMovie){
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
				rating: movieDetails.vote_average ? movieDetails.vote_average : "N/A",
				description: movieDetails.overview ? movieDetails.overview : "N/A",
            })
        }

        await curatedListItem.create({
            movieId: existingMovie.id,
            curatedListId: existingCuratedList.id,
        })

        res.status(201).json({
            message: 'Movie added to curated list successfully',
            movie: existingMovie,
        })
    }catch(err){    
        return res.status(500).json({error: err.message});
    }
}

module.exports = {addToCuratedListItem}