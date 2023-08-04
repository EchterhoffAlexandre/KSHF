const { User, Shop, Transaction, Family, Collection, Quest } = require("../models");

const adminController = {
    homePage: (req, res) => {
        res.render("home");
    },

    familyPage: async (req, res) => {
        try {
            const families = await Family.findAll();
            res.render("family", { 
                families,
            });
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        } 
    },

    userPage: async (req, res) => {
        try {
            const users = await User.findAll();
            const families = await Family.findAll()
            res.render("users", {usersList: users, familiesList: families});
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    },

    questPage: async (req, res) => {
        try {
            const quests = await Quest.findAll();
            const collections = await Collection.findAll();
            res.render("quest", { quests, collections })
        } catch(error) {
            console.trace(error);
        }
    },

    shopPage: async (req, res) => {
        try {
            const collections = await Collection.findAll();
            console.log(collections)
            res.render("shop", {collections});
        } catch(error) {
            console.trace(error);
        }
    },

}

module.exports = adminController;