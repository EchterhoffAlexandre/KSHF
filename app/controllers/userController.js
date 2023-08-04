const { User, Quest, UserQuest, Transaction, Budget } = require("../models");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require('jsonwebtoken');
const getUserId = require('../utils/utils');

// Schema du mot de passe
const schema = Joi.object({
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    email: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')),
});



const userController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await User.findAll();
            res.status(200).json(users);
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    },

    getOneUser: async (req, res) => {
        const userId = getUserId(req);
        try {
            const user = await User.findByPk(userId, {
                include: [
                    {association: "budget",
                    include: [
                        {
                            association:"operations"
                        }]},
                    "family",
                    {association: "friends"},
                    {association: "quests"},
                    {association: "items_collection"},
                    {association: "items_shop"}
                ]
            });
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        } 
    },
    createUser: async (req, res) => {
        try {
            const { email, firstname, lastname, password, confirmation } = req.body;
            const bodyErrors = [];

            // Test des saisies utilisateurs
            if (!email || !firstname || !lastname || !password || password != confirmation) {
                bodyErrors.push('Erreur de saisie du formulaire');
            }

            // On vérifie si l'email est déjà prise :
            const user = await User.findOne({ where: {email:email}});
            if(user) {
                bodyErrors.push('Cet email est déjà utilisé');
            }

            const result = schema.validate({ password: password });
            if (result.error) {
            bodyErrors.push('Mot de passe non conforme');
            console.log(result.error.details[0].message); // "Mot de passe doit contenir au moins 3 caractères"
            }


            // On vérifie si il y a eu des erreurs
            if ( bodyErrors.length) {
                console.log(bodyErrors)
                res.status(400).json(bodyErrors);


            } else {
                const encodedPassword = bcrypt.hashSync(password, 5);
                let newUser = User.build({      // On crée une instance avec le .build
                    email,
                    firstname,
                    lastname,
                    password:encodedPassword
                });
                await newUser.save();            // On enregistre l'instance crée dans la db
                res.status(200).json({ newUser });
            }

        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },
    modifyUser: async (req, res) => {
        const userId = getUserId(req);

        try {            
            const user = await User.findByPk(userId);
            // On test si cet utilisateur existe, si il n'existe pas on retourne une 404
            if (!user) {
                res.status(404).send('Cant find user ' + userId);
            } else {
                // on récupère les nouvelles infos dans le body
                const { firstname, lastname, password, level, wallet, family_id, isAdmin } = req.body;

                // on change que les paramètres présent dans le body
                if (firstname){
                    user.firstname = firstname;
                }
                if (lastname){
                    user.lastname = lastname;
                }
                if (password){
                    // On vérifie d'abord le schéma du mot de passe
                    if(!schema.validate(password)){
                        res.status(404).send('Invalid password - schema')
                    }        
                    // Puis on chiffre le mdp avant de l'inserer en bdd
                    const encodedPassword = bcrypt.hashSync(password, 5);
                    user.password = encodedPassword;
                }
                if (level){
                    user.level = level;
                }
                if (wallet){
                    user.wallet = wallet;
                }
                if (family_id){
                    user.family_id = family_id;
                }
                if (isAdmin){
                    user.isAdmin = isAdmin;
                }


                // Une fois toutes les modifications faîtes, on enregistre
                await user.save();

                // Une fois l'instance enregistré, on envoie la liste en réponse dans la req
                res.status(200).json(user);
            }   
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },
    deleteUser: async (req, res) => {
        const userId = getUserId(req);

        try {
            const user = await User.findByPk(userId); // On instancie la liste a partir de la bdd
            await user.destroy();  // On utilise destroy() pour supprimer l'enregistrement de la bdd
            res.status(200).json('User deleted');
        } catch(error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },
    addFriend: async (req, res) => {
        try {
            // On récupère l'utilisateur qui fait la requête
            const currentUser = await User.findByPk(req.userId);

            // On récupère l'utilisateur à ajouter en ami à partir de l'email passé dans le body de la requête
            const friend = await User.findOne({ where: { email: req.body.email } });

            if (!friend) {
                return res.status(404).json('User not found');
            }

            // On ajoute l'utilisateur en ami
            await currentUser.addFriend(friend);

            res.status(200).json('User added as friend');
        } catch (error) {
            console.error(error);
            res.status(500).json('Error adding friend');
        }
    },
    userFinishQuest: async (req, res) => {

        const userId = getUserId(req);


        const questId = req.params.id; 

        try {
            // Trouver la quête correspondante : 
            const quest = await Quest.findOne({ where: { id: questId }});

            if (!quest) {
                return res.status(404).json({message: 'Quest not found'});
            };
            // Trouver l'user correspondant : 
            const user = await User.findOne({where: { id:userId }});
            if(!user){
                return res.status(404).json({message: 'User not found'});
            };

            // Récupérer la récompense d'expérience de la quête terminée
            const questExp = quest.reward_exp;

            // Appeler la fonction de calcul de niveau
            const result = await User.sequelize.query('SELECT calculate_level(:userId, :questExp)', {
                replacements: { userId, questExp },
                type: User.sequelize.QueryTypes.SELECT
              });

            // trouver le lien 
            const questToChange = await UserQuest.findOne({where: {user_id:userId, quest_id:questId}})
            
            // Vérifier le lien, et le changer si besoin :
            if(questToChange.state === 2){
                questToChange.state = 3;
            } else {
                return res.status(400).json({message: 'Quest cannot be completed'});
            }

            await questToChange.save();
            res.status(200).json({ message: 'Quest completed', questToChange, user  });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error completing quest' });
        }
    },
    getAllQuestOfOneUser: async (req, res) => {
        const userId = getUserId(req);


        try {
            const userQuests = await UserQuest.findAll({where: {'$user_id$': userId}})
            res.status(200).json(userQuests);
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString())
        }  
    },

    deleteAllTransactionBudgetFromOneUser: async (req, res) => {
        const userId = getUserId(req);


        try {
            // Récupération des transactions de l'user
            const transactions = await Transaction.findAll({
                where: {user_id: userId}
            });
            const budgets = await Budget.findAll({
                where: {user_id: userId}
            });

            await transactions.destroy();
            await budgets.destroy();
            res.status(200).json('Transactions & budges deleted');
        } catch (error) {
            console.trace(error);
            res.status(500).json(error);
        }    
    },
}

module.exports = userController;