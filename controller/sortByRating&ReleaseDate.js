// sort watchlist, wishlist, curatedList by rating & releaseDate

const { watchlist, movie, wishlist, curatedListItem } = require("../models");

const sortListByRatingAndReleaseDate = async(req, res)=>{
    try{
        const {list, sortBy, order="ASC"} = req.query;

        if(!list || !sortBy){
            return res.status(400).json({ error: "Query parameters 'list' and 'sortBy' are required." });
        }

        const validListOptions = ['watchlist', 'wishlist', 'curatedlist'];
        const validSortByOptions = ['rating', 'releaseYear']
        const validOrderOptions = ['ASC', 'DESC']

        if(!validListOptions.includes(list.toLowerCase())){
            return res.status(400).json({error: `Invalid list option. Valid options are: ${validListOptions.join(', ')}`});
        }
        
        if(!validSortByOptions.includes(sortBy)){
            return res.status(400).json({error: `Invalid sortBy option. Valid options are: ${validSortByOptions.join(', ')}`});
        }

        if(!validOrderOptions.includes(order.toUpperCase())){
            return res.status(400).json({error: `Invalid order option. Valid options are: ${validOrderOptions.join(', ')}`});
        }

        const listModel = list.toLowerCase() === 'watchlist' 
            ? watchlist 
            : list.toLowerCase() === 'wishlist' 
            ? wishlist
            : curatedListItem;

        // fetch movieId from specific list
        const movieList = await listModel.findAll({
            attributes: ['movieId']
        });

        const movieIdList = movieList.map((movie)=> movie.movieId); 

        // fetch details from movie table
        const movieDetailsList = await movie.findAll({
            where: { id: movieIdList },
            order: [[sortBy, order.toUpperCase()]]
        });


        res.status(200).json({ movies: movieDetailsList });
    }catch(err){
        res.status(500).json({ error: err.message });
    }
}

module.exports = {sortListByRatingAndReleaseDate};