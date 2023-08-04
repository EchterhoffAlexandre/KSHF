const { Family } = require("../models");
const jwt = require('jsonwebtoken');
const getUserId = require('../utils/utils');

const familyController = {
    getAllFamilies: async (req, res) => {
        try {
            const families = await Family.findAll({
                include: {
                    association: "members"
                }
            });
            res.status(200).json(families);
        } catch(error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    },

    getOneFamily: async (req, res) => {
        try {
            const familyId = req.params.id;
            const family = await Family.findByPk(familyId, {
                include: {
                    association: "members"
                }
            });
            if (family) {
                res.status(200).json(family);
            } else {
                res.status(404).json('Family with the id: ' + familyId + 'does not exist');
            }
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    },


    createFamily: async (req, res) => {
        try {
            // Ici j'ai mis le level, parce qu'on a pas mis une valeur par défaut
            // dans la bdd, mais après on va retirer le level et mettre 1 par défaut
            // ce sera mieux (une famille a peine créer sera forcément level 1)
            const { name, level } = req.body;
            const errors = [];
            if (!name) {
                errors.push('name can not be empty');
            }
            if (!level) {
                errors.push('level can not be empty');
            }
            if (errors.length) {
                res.status(400).json(errors);
            } else {
                let newFamily = Family.build({
                    name,
                    level
                });

                await newFamily.save();
                res.status(200).json(newFamily);
            }
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    },

    modifyFamily: async (req, res) => {
        try {
            const familyId = req.params.id;
            const family = await Family.findByPk(familyId);
            if (!family) {
                res.status(404).send('Family with the id: ' + familyId + 'does not exist');
            } else {
                const { name } = req.body;

                if (name) {
                    family.name = name;
                }

                await family.save();

                res.status(200).json(family);
            }
        } catch(error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    },

    deleteFamily: async (req, res) => {
        try {
            const familyId = req.params.id;
            const family = await Family.findByPk(familyId);
            await family.destroy();
            res.status(200).json("Family deleted");
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    }
}

module.exports = familyController;