const { Quest } = require("../models");

const questController = {
    getAllQuests: async (req, res) => {
        try {
            const quests = await Quest.findAll({});
            res.status(200).json(quests);
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    },

    getOneQuest: async (req, res) => {
        try {
            const questId = req.params.id;
            const quest = await Quest.findByPk(questId);
            if (quest) {
                res.status(200).json(quest);
            } else {
                res.status(404).json('Quest with the id: ' + questId + ' does not exist');
            }
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    },

    createQuest: async (req, res) => {
        try {
            console.log('ICIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII');

            console.log(req.body);
            const { description, difficulty, reward_exp, reward_coin } = req.body;
            console.log(description);
            const errors = [];
            if (!description) {
                errors.push('description can not be empty');
            }
            if (!difficulty) {
                errors.push('difficulty level can not be empty');
            }
            if (!reward_exp) {
                errors.push('reward experience can not be empty');
            }
            if (!reward_coin) {
                errors.push('reward coin can not be empty');
            }
            if (errors.length) {
                res.status(400).json(errors);
            } else {
                let newQuest = Quest.build({
                    description,
                    difficulty,
                    reward_exp,
                    reward_coin
                });

                await newQuest.save();
                res.status(200).json(newQuest);
            }
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    },

    modifyQuest: async (req, res) => {
        try {
            const questId = req.params.id;
            const quest = await Quest.findByPk(questId);
            if (!quest) {
                res.status(404).json('Quest with the id: ' + questId + ' does not exist');
            } else {
                const { description, difficulty, reward_exp, reward_coin } = req.body;

                if (description) {
                    quest.description = description;
                }
                if (difficulty) {
                    quest.difficulty = difficulty;
                }
                if(reward_exp) {
                    quest.reward_exp = reward_exp;
                }
                if(reward_coin) {
                    quest.reward_coin = reward_coin;
                }

                await quest.save();

                res.status(200).json(quest);
            }
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    },

    deleteQuest: async (req, res) => {
        try {
            const questId = req.params.id;
            const quest = await Quest.findByPk(questId);
            await quest.destroy();
            res.status(200).json("Quest deleted");
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    }
}

module.exports = questController;