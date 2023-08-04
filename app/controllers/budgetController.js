const { Budget, User } = require('../models');
const jwt = require('jsonwebtoken');
const getUserId = require('../utils/utils');

const budgetController = {

    getAllBudgets: async (req, res) => {
        try {
            const budgets = await Budget.findAll({
                include: "operations"
            });
            res.status(200).json(budgets);
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    },

    getAllBudgetsFromOneUser : async (req, res) => {
        const userId = getUserId(req);
        console.log(req);
        try {
            console.log("let's gooo");
            const budgets = await Budget.findAll({
                attributes: ['id', 'name', 'amount', 'color', 'created_at'],
                where: {
                    user_id: userId
                }
            });
            res.status(200).json(budgets);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    },

    getOneBudget: async (req, res) => {
        try {
            const budgetId = req.params.id;
            const budget = await Budget.findByPk(budgetId, {
                include: "operations"
            });
            if (budget) {
                res.status(200).json(budget);
            } else {
                res.status(404).json('Budget with the id: ' + budgetId + ' does not exist');
            }
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    },

    createBudget: async (req, res) => {
        const userId = getUserId(req);
        
        // Je randomise des valeurs HSL pour la couleur du budget
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 100);
        const lightness = Math.floor(Math.random() * 50) + 25;

        try  {
            const amount = req.body.lastBudget.amount;
            const name = req.body.lastBudget.name;
            const errors = [];
            
            if (!name) {
                errors.push('name can not be empty');
            }
            if (!amount) {
                errors.push('amount can not be empty');
            }
            
            // J'attribue une couleur randomisé au budget
            const color = `${hue} ${saturation}% ${lightness}%`;

            if (errors.length) {
                res.status(400).json(errors);
            } else {
                let newBudget = Budget.build({
                    name,
                    amount,
                    color,
                    user_id:userId,
                });
            await newBudget.save();
            const budgets = await Budget.findAll({
                attributes: ['id', 'name', 'amount', 'color', 'created_at'],
                where: {
                    user_id: userId
                }
            });

            const allBudgets = budgets.map(budget => budget.dataValues)

            res.status(200).json(allBudgets);
            }
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    },

    modifyBudget: async (req, res) => {
        try {
            const budgetId = req.params.id;
            const budget = await Budget.findByPk(budgetId);

            if (!budget) {
                res.status(404).json('Budget with the id: ' + questId + ' does not exist');
            } else {
                const { name, amount, } = req.body;

                if (name) {
                    budget.name = name;
                }
                if (amount) {
                    budget.amount = amount;
                }

                await budget.save();

                res.status(200).json(budget);
            }
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    },

    deleteBudget: async (req, res) => {
        console.log("iciiiiiiiiiiiiiiiiiiii")
        try {
            const budgetId = req.params.id;
            const budget = await Budget.findByPk(budgetId);
            console.log(budget)
            await budget.destroy();
            res.status(200).json("Budget deleted");
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    }
};

module.exports = budgetController;