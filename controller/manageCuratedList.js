const { where, Op } = require("sequelize");
const { curatedList } = require("../models");
const generateSlug = require("../utils/generateSlug");

const addCuratedList = async (req, res) => {
	try {
		const { name, description } = req.body;

		if (!name || !description) {
			return res.status(400).json({ error: "All fields are required." });
		}

		const createdSlug = generateSlug(name);

		const existingSlug = await curatedList.findOne({
			where: { slug: createdSlug },
		});
		if (existingSlug) {
			return res
				.status(400)
				.json({ error: "A curated list with the same name already exists." });
		}

		const newCuratedList = await curatedList.create({
			name,
			description,
			slug: createdSlug,
		});

		res.status(201).json({
			message: "Curated list created successfully.",
			data: newCuratedList,
		});
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

const updateCuratedList = async (req, res) => {
	try {
		const id = parseInt(req.params.curatedListId);
		const { name, description } = req.body;

		console.log(name, description, id);

		const existingCuratedList = await curatedList.findByPk(id);
		if (!existingCuratedList) {
			return res.status(404).json({ error: "Curated list not found." });
		}

		if (name) {
			existingCuratedList.name = name;
            
            // update slug also as per updated name
			const updatedSlug = generateSlug(name);

			// check new updatedSlug is matches with any existing slug
			const existingSlug = await curatedList.findOne({
				where: {
					slug: updatedSlug,
					id: { [Op.ne]: existingCuratedList.id },
				},
			});

			if (existingSlug) {
				return res
					.status(400)
					.json({ error: "A curated list with the same name already exists." });
			}

            existingCuratedList.slug = updatedSlug;
		}
		if (description) {
			existingCuratedList.description = description;
		}

		await existingCuratedList.save();

		res.status(200).json({
			message: "Curated list updated successfully.",
			data: existingCuratedList,
		});
	} catch (err) {
		return res.status(500).json({ message: err.message });
	}
};

module.exports = { addCuratedList, updateCuratedList };
