const { curatedList } = require('../models');

const curatedListExistsInDB = async (curatedListId) => {
    // Find the curated list by primary key
    const curatedListDetails = await curatedList.findByPk(curatedListId);
    
    return curatedListDetails ? curatedListDetails : null;
};

module.exports = { curatedListExistsInDB };
