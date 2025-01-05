const express = require('express');
const { searchMovieController } = require('../controller/searchMovies');
const { addCuratedList, updateCuratedList } = require('../controller/manageCuratedList');
const { addToWatchList } = require('../controller/watchList');
const { addToWishList } = require('../controller/wishList');
const { addToCuratedListItem } = require('../controller/curatedListItem');
const { addReviewToMovie } = require('../controller/review');
const { searchByGenreAndActor } = require('../controller/searchByGenre&Actor');
const { sortListByRatingAndReleaseDate } = require('../controller/sortByRating&ReleaseDate');
const { getTop5Movies } = require('../controller/top5Movie');

const router = express.Router();

router.get('/', (req, res) => {
    res.send('Everything is good!');
});

router.get('/movies/search', searchMovieController);
router.post('/api/curated-lists', addCuratedList);
router.put('/api/curated-lists/:curatedListId', updateCuratedList);
router.post('/api/movies/watchlist', addToWatchList)
router.post('/api/movies/wishlist', addToWishList)
router.post('/api/movies/curated-list', addToCuratedListItem)
router.post('/api/movies/:movieId/reviews', addReviewToMovie)
router.get('/api/movies/searchByGenreAndActor', searchByGenreAndActor)
router.get('/api/movies/sort', sortListByRatingAndReleaseDate)
router.get('/api/movies/top5', getTop5Movies)

module.exports = router;