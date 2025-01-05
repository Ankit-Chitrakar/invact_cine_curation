module.exports = (sequelize, DataTypes)=>{
    const movie = sequelize.define('movie', {
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        tmdbId: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },
        genre: {
            type: DataTypes.STRING,
            allowNull: false
        },
        actors: {
            type: DataTypes.TEXT,
        },
        releaseYear: {
            type: DataTypes.INTEGER,
        },
        rating: {
            type: DataTypes.FLOAT,
        },
        description: {
            type: DataTypes.TEXT,
        }
    }, {
        timestamps: true,
    })

    // Association of Movie
    movie.associate = (models)=>{
        movie.hasMany(models.review, {foreignKey: 'movieId'});
        movie.hasMany(models.watchlist, {foreignKey: 'movieId'});
        movie.hasMany(models.wishlist, {foreignKey: 'movieId'});
        movie.hasMany(models.curatedListItem, {foreignKey: 'movieId'});
    }

    return movie;
}