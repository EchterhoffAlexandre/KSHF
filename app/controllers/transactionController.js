const {
    User,
    Shop,
    Transaction,
    Budget,
    Family,
    Collection,
    Quest
} = require("../models");
const { Op } = require('sequelize');
const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');
const getUserId = require('../utils/utils');




const transactionController = {
    getAllTransactions: async (req, res) => {
        try {
            const transactions = await Transaction.findAll();
            res.status(200).json(transactions);
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },

    getAllTransactionsOfUser: async (req, res) => {
        const userId = getUserId(req);
        console.log(userId);

        try {
            const transactions = await Transaction.findAll({
                attributes: ['id', 'name', 'amount', 'created_at', 'budget_id'],
                include: [{
                    model: Budget,
                    as: 'budget',
                    where: {user_id: userId},
                    attributes: []
                }],
            });
            res.status(200).json(transactions);
        } catch (error) {
            console.error(error);
            res.status(500).json(error);
        }
    },

    getAllTransactionsOfBudget: async (req, res) => {
        try {
            const budgetId = req.params.id;
            const transactions = await Transaction.findAll({
                where: {
                    '$budget.id$': budgetId
                },
                include: [{
                    model: Budget,
                    as: 'budget',
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: []
                    }]
                }]
            });
            res.status(200).json(transactions)
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },
    getOneTransaction: async (req, res) => {
        try {
            const transactionId = req.params.id;
            const transaction = await Transaction.findByPk(transactionId);

            if (transaction) {
                res.status(200).json(transaction);
            } else {
                res.status(404).json('Cant find transaction ' + transactionId);
            }
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },
    createTransaction: async (req, res) => {
        const userId = getUserId(req);

        try {
            console.log(req.body)
            const { name, amount, budget_id } = req.body.lastExpense;
            console.log(req.body.lastExpense);
            // Je crée un array qui récupère mes erreurs : 
            const bodyErrors = [];
            if (!name) {
                bodyErrors.push('name can not be empty');
            }
            if (!amount) {
                bodyErrors.push('amount can not be empty');
            }
            if (!budget_id) {
                bodyErrors.push('budget_id can not be empty')
            }

            if (bodyErrors.length) {
                res.status(404).json(bodyErrors);
            } else {
                let newTransaction = Transaction.build({
                    name,
                    amount,
                    user_id:userId,
                    budget_id
                });
                await newTransaction.save();

                const transactions = await Transaction.findAll({
                    attributes: ['id', 'name', 'amount', 'created_at', 'budget_id'],
                    include: [{
                        model: Budget,
                        as: 'budget',
                        where: {user_id: userId},
                        attributes: []
                    }],
                });

                // Je trie les valeurs qui m'intéresse 
                const allTransactions = transactions.map(transaction => transaction.dataValues)


                res.status(200).json(allTransactions);
            }
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },
    modifyTransaction: async (req, res) => {
        try {
            const transactionId = req.params.id;
            const transaction = await Transaction.findByPk(transactionId);

            if (!transaction) {
                res.status(404).send('Cant find transaction ' + transactionId);
            } else {
                // On récupère les nouvelles infos dans le body :
                const {
                    name,
                    amount,
                    budget_id
                } = req.body;
                // Et on change que les params présent dans le body :
                if (name) {
                    transaction.name = name;
                }
                if (amount) {
                    transaction.amount = amount;
                }
                if (budget_id) {
                    transaction.budget_id = budget_id;
                }
                // Puis on enregistre directement en bdd
                await transaction.save();
                // Et on renvoie l'instance enregistré en réponse dans le req
                res.status(200).json(transaction);
            }

        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },
    deleteTransaction: async (req, res) => {
        try {
            // Je récupère la transaction que je souhaite supprimer
            const transactionId = req.params.id;
            const transaction = await Transaction.findByPk(transactionId);

            // Ensuite je la supprime puis le fait savoir dans la requête
            await transaction.destroy();
            res.status(200).json('Transaction deleted')

        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },
    getTransactionOfToday: async (req, res) => {
        const userId = getUserId(req);
        console.log("DAAAAYYYYYY", userId);

        try {
            const now = new Date();
            // On instancie une journée
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            //   console.log(today)
            const dailyTransaction = await Transaction.findAll({
                where: {
                    '$budget.user_id$': userId,
                    created_at: {
                        [Op.gte]: today,
                        [Op.lt]: new Date(today.getTime() + 24 * 60 * 60 * 1000),
                    }
                },
                include: [{
                    model: Budget,
                    as: 'budget',
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: []
                    }]
                }]
            });
            res.status(200).json(dailyTransaction);
        } catch (error) {
            console.trace(error)
            res.status(500).json(error.toString());
        }
    },
    getTransactionOfWeek: async (req, res) => {
        const userId = getUserId(req);
        console.log("WEEEKY", userId);

        try {
            
            // Trouver la date du lundi le plus proche avant la date actuelle
            const startOfWeek = dayjs().startOf('week').add(1, 'day').startOf('day');
            // console.log('start of week',startOfWeek)
            const endOfWeek = dayjs().endOf('week').add(1, 'day').toDate();
            // console.log('end of week',endOfWeek)
            const weeklyTransaction = await Transaction.findAll({
                where: {
                    '$budget.user_id$': userId,
                    created_at: {
                        [Op.gte]: startOfWeek.toISOString(),
                        [Op.lt]: endOfWeek.toISOString()
                    }
                },
                include: [{
                    model: Budget,
                    as: 'budget',
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: []
                    }]
                }]
            });
            res.status(200).json(weeklyTransaction);
        } catch (error) {
            console.trace(error)
            res.status(500).json(error.toString());
        }
    },
    getTransactionOfMonth: async (req, res) => {
        const userId = getUserId(req);
        console.log("moonths", userId);

        try {
            
            const now = new Date();

            // Trouver la date du premier jour du mois courant
            const startOfMonth = dayjs().startOf('month').toDate();

            // Trouver la date du dernier jour du mois courant
            const endOfMonth = dayjs().endOf('month').toDate();

            const monthlyTransactions = await Transaction.findAll({
                where: {
                    '$budget.user_id$': userId,
                    created_at: {
                        [Op.gte]: startOfMonth.toISOString(),
                        [Op.lt]: endOfMonth.toISOString()
                    }
                },
                include: [{
                    model: Budget,
                    as: 'budget',
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: []
                    }]
                }]
            });

            res.status(200).json(monthlyTransactions);
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },
    getTransactionOfYear: async (req, res) => {
        const userId = getUserId(req);
        console.log("TEEAR", userId);
        try {

            const now = new Date();

            // Trouver la date du premier jour de l'année courante
            const startOfYear = dayjs(now).startOf('year').toDate();

            // Trouver la date du dernier jour de l'année courante
            const endOfYear = dayjs(now).endOf('year').toDate();

            const yearlyTransactions = await Transaction.findAll({
                where: {
                    '$budget.user_id$': userId,
                    created_at: {
                        [Op.gte]: startOfYear.toISOString(),
                        [Op.lt]: endOfYear.toISOString()
                    }
                },
                include: [{
                    model: Budget,
                    as: 'budget',
                    include: [{
                        model: User,
                        as: 'user',
                        attributes: []
                    }]
                }]
            });

            res.status(200).json(yearlyTransactions);
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },

};

module.exports = transactionController;