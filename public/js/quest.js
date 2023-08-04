const quest = {
    // Le select et sa div 
    divSelect : document.getElementById('select-quest'), 
    selectQuests : document.getElementById('quest-choice'),

    // Les formulaires, de moficiation et d'ajout
    formAdd : document.getElementById('quest-form-add'), 
    formModify : document.getElementById('quest-form-modify'), 

    // bouton du fomulaire de modification
    modifyButton: document.querySelector('.form-button-modify-quest'),
    cancelButton: document.querySelector('.form-button-cancel-quest'),

    // boutons du début
    buttonAdd : document.getElementById('add-button'), // le bouton pour faire afficher le fomulaire d'ajout
    buttonModify : document.getElementById('modify-button'), // le btn pour faire afficher le formulaire de modification

    questId: '',

    init: function() {
        if (document.body.classList.contains('quest-page')) {
            console.log('init function quest')


            quest.buttonAdd.addEventListener('click', quest.handleAddForm);
            
            quest.buttonModify.addEventListener('click', quest.handleSelect);
            quest.selectQuests.addEventListener('change', quest.handleModifyForm);
        }
    },
    handleAddForm: function(event) {
        console.log('handleAddForm');

        // Je vérifie si le menu select de modifier est présent sur la page ou pas.
        // Si il est présent, je le cache
        if(!quest.divSelect.classList.contains('is-hidden')){
            quest.divSelect.classList.add('is-hidden');
        }
        if (!quest.formModify.classList.contains('is-hidden')){
            quest.formModify.classList.add('is-hidden');
        }

        // const addButton = document.getElementById('form-add-button');
        // const formData = new FormData(quest.formAdd);
        quest.formAdd.classList.toggle("is-hidden");
        quest.formAdd.addEventListener('submit', quest.addQuestInData);
        // addButton.addEventListener('submit', quest.addQuestInData )
    },

    addQuestInData: async function(event) {
        console.log('addQuestInData')

        event.preventDefault();
        // Je récupère les data du formulaire
        const formData = new FormData(event.target);
        // Je crée un objet vide qui acceuillera la donnée du formulaire
        const formObject = {};
        // Je crée un objet json dans mon objet vide crée au dessus
        formData.forEach((value, key) => formObject[key] = value);
        const json = JSON.stringify(formObject);
        
        if(!confirm("Voulez-vous vraiment ajouter cette quête ?")) { return };

        try {
            const response = await fetch(`http://localhost:3000/quest`, {
            method: 'POST',
            body: json,
            headers : { "Content-Type": "application/json"}
            });
            const jsonData = await response.json();
            if(!response.ok) {throw new Error("Impossible de créer la quête !")}
            console.log('Quête ajoutée')
            alert('Quête modifiée !');
            window.location.reload();
        } catch (error) {
            console.log(error);
            alert(error);
        }
    },

    handleSelect: function(event) {
        if(!quest.formAdd.classList.contains('is_hidden')){
            quest.formAdd.classList.add('is-hidden');
        }

        quest.divSelect.classList.toggle("is-hidden")
    },

    handleModifyForm: async function(event) {
        console.log('handleModifyForm')
        // On sélectionne les input, pour les remplir ensuite
        const descriptionInput = quest.formModify.querySelector('input[name="description"]')
        const difficultyInput = quest.formModify.querySelector('input[name="difficulty"]')
        const reward_expInput = quest.formModify.querySelector('input[name="reward_exp"]')
        const reward_coinInput = quest.formModify.querySelector('input[name="reward_coin"]')
        const reward_itemInput = quest.formModify.querySelector('input[name="reward_item"]')
        // console.log( descriptionInput, difficultyInput, reward_coinInput, reward_expInput)
        try {
            // on récupère l'id de la quête sélectionné
            let questId = parseInt(event.target.value);

            quest.questId = questId;

            
            // on récupère la donnée de la quête voulue 
            const selectedQuest = await fetch(`/quest/${questId}`);

            // on rend la donnée exploitable en json
            const questData = await selectedQuest.json();

            // ensuite on attribue a notre formulaire les valeurs de la quête sélectionné
            descriptionInput.value = questData.description;
            difficultyInput.value = questData.difficulty;
            reward_expInput.value = questData.reward_exp;
            reward_coinInput.value = questData.reward_coin;



            // J'affiche le formulaire de modification avec les données de la quête sélectionnée
            document.getElementById('quest-form-modify').classList.toggle("is-hidden")
            // console.log('DivSelect',document.getElementById('select-quest'))
            document.getElementById('select-quest').classList.toggle('is-hidden');
            
            quest.cancelButton.addEventListener('click', quest.hideForm)
            quest.formModify.addEventListener('submit', quest.changeQuestInData)

        } catch(error) {
            console.trace(error);
        }
    },

    hideForm: function(event) {
        console.log('Annulez');
        event.preventDefault();
        quest.formModify.classList.add('is-hidden');
    },

    changeQuestInData: async function(event) {
        console.log('changeQuestInData');

        event.preventDefault();

        // Je récupère les data du formulaire
        const formData = new FormData(event.target);
        // Je crée un objet vide qui acceuillera la donnée du formulaire
        const formObject = {};
        // Je crée un objet json dans mon objet vide crée au dessus
        formData.forEach((value, key) => formObject[key] = value);

        // delete formObject.family;
        const json = JSON.stringify(formObject);
        // console.log('json', json);
        

        if (confirm("Voulez vous vraiment modifier cet quête ?")) {
            try {
                const response = await fetch(`http://localhost:3000/quest/${quest.questId}`, {
                    method: 'PUT',
                    body:json,
                    headers : { "Content-Type": "application/json"}
                });
                const jsonData = await response.json();
                console.log('jsonData', jsonData);
                if(!response.ok) {throw new Error("Impossible de modifier la quête !")}
                console.log('Quête modifiée')
                alert("Quête modifiée !")
                // Une fois la modification faîte en BDD
                // Je réactualise mes données et réaffiche ce qu'il y a a afficher
                window.location.reload();
                user.formModify.style.display ='none'
                user.divSelect.classList.toggle("is-hidden");
            } catch (error) {
                console.trace(error);
            }
    }
    },
}
