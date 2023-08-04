const { Shop, Collection } = require("../models");

const shopController = {
    getAllItemShop: async (req, res) => {
        try {
            const itemsShop = await Shop.findAll({});
            res.status(200).json(itemsShop);
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    },

    getOneItem: async (req, res) => {
        try {
            const itemId = req.params.id;
            const itemShop = await Shop.findByPk(itemId, {
                include: [
                    "items_collection"
                ]
            });
            if (itemShop) {
                res.status(200).json(itemShop);
            } else {
                res.status(404).json('Item with the id: ' + itemId + ' does not exist');
            }
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    },

    addItemToShop: async (req, res) => {
        try {
            const itemId = req.params.id;
            const isAlreadyInShop = await Shop.findOne({
                where: {collection_id: itemId}
            });
            if (isAlreadyInShop) {
                return res.status(400).json('Item already exists in the shop');
            }

            const itemShop = await Shop.findByPk(itemId);
            const itemCollection = await Collection.findByPk(itemId);
            if (!itemCollection) {
                res.status(404).json('Item with the id: ' + itemId + ' does not exist');
            } 
            else {
                let newItemShop = Shop.build({
                    description: itemCollection.description,
                    category: itemCollection.category,
                    require_level: itemCollection.require_level,
                    price: itemShop.price,
                    collection_id: itemCollection.id
                });
                await newItemShop.save();
                res.status(200).json(newItemShop);
            }
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    },

    deleteItemFromShop: async (req, res) => {
        try {
            const itemId = req.params.id;
            const itemShop = await Shop.findOne({ where: { id: itemId } });
            if (!itemShop) {
                res.status(404).json('Item does not exist in the shop');
            } else {
                await itemShop.destroy();
                res.status(200).json("Item has been removed");
            }
        } catch (error) {
            console.error(error);
            console.trace(error);
            res.status(500).json(error);
        }
    }
}

module.exports = shopController;
