const { User, Shop, Transaction, Family, Collection, Quest } = require("../models");


const collectionController = {
    getAllCollections: async (req, res) => {
        try {
            const collections = await Collection.findAll()
            res.status(200).json(collections);
        } catch(error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },
    getOneCollection: async (req, res) => {
        try {
            // Je récupère l'id de la collection souhaité
            collectionId = req.params.id;
            const collection = await Collection.findByPk(collectionId)
            
            // Je vérifié si elle existe bien, sinon je renvoie une erreur
            if (collection) {
                res.status(200).json(collection);
            } else {
                res.status(404).json('cant find collection ' + collectionId);
            }
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },
    createCollection: async (req, res) => {
        try {
            // Je récupère les valeurs du body : 
            const { description, category, require_level } = req.body;
            // Je crée un array qui récupère mes erreurs : 
            const bodyErrors = [];

            // 

            // Je test mes données et renvoie l'erreur a mon array en cas d'erreur
            if (!description) {
                bodyErrors.push('description can not be empty');
            }
            if (!category) {
                bodyErrors.push('category can not be empty');
            }
            if (!require_level) {
                bodyErrors.push('require_level can not be empty');
            }

            // Je vérifie le contenue de mon array d'erreurs et renvoi une 404 
            // si il y a eu au moins une erreur. Autrement de poursuit
            if (bodyErrors.length) {
                res.status(404).json(bodyErrors);
            } else {
                let newCollection = Collection.build({
                    description,
                    category,
                    require_level
                });

                await newCollection.save();
                res.status(200).json(newCollection);
            }

        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },
    modifyCollection: async (req, res) => {
        try {   
            // On récupère les infos d'une collection : 
            const collectionId = req.params.id;
            const collection = await Collection.findByPk(collectionId);

            // On test si la collection existe pour continuer : 
            if (!collection) {
                res.status(404).send('Cant find collection ' + collectionId);
            } else {
                // On récupère les nouvelles infos dans le body : 
                const { description, category, require_level } = req.body;

                // Et on change que les params présent dans le body : 
                if (description) {
                    collection.description = description;
                }
                if (category) {
                    collection.category = category;
                }
                if (require_level) {
                    collection.require_level = require_level;
                }

                // Puis on enregistre directement en bdd
                await collection.save();
                // Et on renvoie l'instance enregistré en réponse dans le req
                res.status(200).json(collection);

            }

        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    },
    deleteCollection: async (req, res) => {
        try {
            // Je récupère la collection que je souhaite supprimer
            const collectionId = req.params.id;
            const collection = await Collection.findByPk(collectionId);

            // Puis je supprime l'instance de collection trouvé
            await collection.destroy();
            // Une fois supprimé je le fait savoir au front dans la requete
            res.status(200).json('Collection deleted');
        } catch (error) {
            console.trace(error);
            res.status(500).json(error.toString());
        }
    }
};


module.exports = collectionController;