const { cast } = require("sequelize");
const {curatedListItem, watchlist, wishlist, movie} = require("../models");
const { curatedListExistsInDB } = require("./curatedListExistsInDB");
const { movieExistsInDB } = require("./movieExistsInDB");

const checkPresentInCuratedListItem = async(movieId, curatedListId)=>{
    try{
        const movieDetails = await movieExistsInDB(movieId);

        if(!movieDetails) return null;

        const curatedListDetails = await curatedListExistsInDB(curatedListId);

        if(!curatedListDetails) return null;

        const alreadyAdded = await curatedListItem.findOne({where: {
            curatedListId: curatedListDetails.id,
            movieId: movieDetails.id,
        }})

        return alreadyAdded;
    }catch(err){
        throw new Error(err)
    }
}
const checkPresentInWathchList = async(tmdbId)=>{
    try{
        const movieDetails = await movieExistsInDB(tmdbId);

        if(!movieDetails){
            return null;
        }

        const alreadyAdded = await watchlist.findOne({where: {
            movieId: movieDetails.id,
        }})

        return alreadyAdded;
    }catch(err){
        throw new Error(err)
    }
}

const checkPresentInWishList = async (tmdbId) => {
    try {
        const movieDetails = await movieExistsInDB(tmdbId);

        if (!movieDetails) {
            return null;
        }

        // Check if movie is in the wishlist
        const alreadyAdded = await wishlist.findOne({
            where: { movieId: movieDetails.id },
        });

        return alreadyAdded;
    } catch (err) {
        throw new Error(err);
    }
};

module.exports = {checkPresentInWishList, checkPresentInWathchList, checkPresentInCuratedListItem}