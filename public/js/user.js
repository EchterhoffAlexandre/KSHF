const user = {
    current_page: 1,
    rows: 10,
    list_element: document.getElementById('list'),
    pagination_element: document.getElementById('pagination'),
    modal: document.getElementById('modal'),
    modifyForm: document.getElementById('modal-form'),
    submitButton: document.getElementById('submit-button'),
    cancelButton: document.getElementById('cancel-button'),
    elementId: '',
    init: function () {
        if (document.body.classList.contains('user-page')) {
            console.log('Init users !')
            user.getUserFromData();
        }
    },
    getUserFromData: async function () {
        try {
            console.log('getUserFromData')
            // Je récupère toute la donnée 
            users = await fetch('/users');
            // Je la rend exploitable
            const data = await users.json();
            // console.log(data);
            // Ensuite j'affiche la donnée grace a displayList 
            user.DisplayList(data, user.list_element, user.rows, user.current_page);
            user.SetupPagination(data, user.pagination_element, user.rows)

        } catch (error) {
            console.trace(error);
        }
    },
    DisplayList: function (items, wrapper, rows_per_page, page) {
        console.log('DisplayList')
        wrapper.innerHTML = "";
        page--;

        let start = rows_per_page * page;
        let end = start + rows_per_page;
        let paginatedItems = items.slice(start, end);

        // Création de la table
        let table = document.createElement('table');
        table.classList.add('item-table');

        // Création de l'en-tête de table
        let table_head = document.createElement('thead');
        let head_row = document.createElement('tr');
        head_row.classList.add('title-row');

        let title_cell1 = document.createElement('th');
        title_cell1.innerText = "Email";

        let title_cell2 = document.createElement('th');
        title_cell2.innerText = "Firstname";

        let title_cell3 = document.createElement('th');
        title_cell3.innerText = "Lastname";

        let title_cell4 = document.createElement('th');
        title_cell4.innerText = "Level";

        let title_cell5 = document.createElement('th');
        title_cell5.innerText = "Wallet";

        let title_cell6 = document.createElement('th');
        title_cell6.innerText = "Family";

        let title_cell7 = document.createElement('th');
        title_cell7.innerText = "isAdmin";


        let title_cell8 = document.createElement('th');
        title_cell9 = document.createElement('th');
        head_row.appendChild(title_cell1);
        head_row.appendChild(title_cell2);
        head_row.appendChild(title_cell3);
        head_row.appendChild(title_cell4);
        head_row.appendChild(title_cell5);
        head_row.appendChild(title_cell6);
        head_row.appendChild(title_cell7);
        head_row.appendChild(title_cell8);
        head_row.appendChild(title_cell9);
        table_head.appendChild(head_row);
        table.appendChild(table_head);

        // Création du corps de table
        let table_body = document.createElement('tbody');
        for (let i = 0; i < paginatedItems.length; i++) {
            let item = paginatedItems[i];
            let item_element = document.createElement('tr');
            item_element.classList.add('item');

            // Ajoute la email
            let email = document.createElement('td');
            email.classList.add('email');
            email.innerText = item.email;
            item_element.appendChild(email);

            // Ajoute la firstname
            let firstname = document.createElement('td');
            firstname.classList.add('firstname');
            firstname.innerText = item.firstname;
            item_element.appendChild(firstname);

            // Ajoute le lastname
            let lastname = document.createElement('td');
            lastname.classList.add('lastname');
            lastname.innerText = item.lastname;
            item_element.appendChild(lastname);

            // Ajoute le level
            let level = document.createElement('td');
            level.classList.add('level');
            level.innerText = item.level;
            item_element.appendChild(level);

            // Ajoute le wallet
            let wallet = document.createElement('td');
            wallet.classList.add('wallet');
            wallet.innerText = item.wallet;
            item_element.appendChild(wallet);

            // Ajoute le family
            let family = document.createElement('td');
            family.classList.add('family');
            family.innerText = item.family_id;
            item_element.appendChild(family);

            // Ajoute le isAdmin
            let isAdmin = document.createElement('td');
            isAdmin.classList.add('isAdmin');
            isAdmin.innerText = item.isAdmin;
            item_element.appendChild(isAdmin);

            // Ajoute le bouton Supprimer
            let delete_button = document.createElement('button');
            delete_button.classList.add('delete-button');
            delete_button.innerText = 'Supprimer';
            delete_button.addEventListener('click', async function (event) {
                console.log('Supprimer', item.id);
                if (confirm("Voulez vous vraiment supprimer cet utilisateur ?")) {
                    try {
                        const response = await fetch(`/user/${item.id}`, {
                            method: 'DELETE',
                        });
                        if (!response.ok) {
                            throw new Error("Impossible de supprimer l'utilisateur")
                        };
                        alert("Element supprimé !")
                        window.location.reload();

                    } catch (error) {

                    }
                };
            });
            let delete_cell = document.createElement('td');
            delete_cell.appendChild(delete_button);
            item_element.appendChild(delete_cell);

            // Ajoute le bouton Modifier
            let edit_button = document.createElement('button');
            edit_button.classList.add('edit-button');
            edit_button.innerText = 'Modifier';
            edit_button.value = item.id;
            edit_button.addEventListener('click', user.displayModal);
            let edit_cell = document.createElement('td');
            edit_cell.appendChild(edit_button);
            item_element.appendChild(edit_cell);

            table_body.appendChild(item_element);
        }
        table.appendChild(table_body);

        wrapper.appendChild(table);
    },
    SetupPagination: function (items, wrapper, rows_per_page) {
        console.log('SetupPagination');
        wrapper.innerHTML = '';

        let page_count = Math.ceil(items.length / rows_per_page);

        for (let i = 1; i < page_count + 1; i++) {
            let btn = user.PaginationButton(i, items);
            wrapper.appendChild(btn);
        }

    },

    PaginationButton: function (page, items) {
        console.log('PaginationButton');
        let button = document.createElement('button')
        button.innerText = page;
        if (user.current_page == page) button.classList.add('active');

        button.addEventListener('click', function () {
            user.current_page = page;
            user.DisplayList(items, user.list_element, user.rows, user.current_page);

            let current_btn = document.querySelector('.pagenumbers button.active');
            current_btn.classList.remove('active');

            button.classList.add('active');
        })
        return button
    },
    displayModal: async function (event) {
        console.log("displayModal")

        // on récupère les éléments du formulaire
        const emailInput = user.modifyForm.querySelector('input[name="email"]');
        const firstnameInput = user.modifyForm.querySelector('input[name="firstname"]');
        const lastnameInput = user.modifyForm.querySelector('input[name="lastname"]');
        const levelInput = user.modifyForm.querySelector('input[name="level"]');
        const walletInput = user.modifyForm.querySelector('input[name="wallet"]');
        const familyInput = user.modifyForm.querySelector('input[name="family"]');
        const isAdminInput = user.modifyForm.querySelector('input[name="isAdmin"]');


        try {
            item = await fetch(`/user/${event.target.value}`)
            const data = await item.json();
            console.log('isADmin', data)
            emailInput.value = data.email;
            firstnameInput.value = data.firstname;
            lastnameInput.value = data.lastname;
            levelInput.value = data.level;
            walletInput.value = data.wallet;
            familyInput.value = data.require_level;
            isAdminInput.value = data.isAdmin;

            user.elementId = event.target.value;
            user.modal.classList.toggle('is-hidden');
            user.modifyForm.addEventListener('submit', user.changeItemInData);
            user.cancelButton.addEventListener('click', user.hideModal);

        } catch (error) {
            console.trace(error);
        }

    },
    hideModal: function () {
        user.modal.classList.toggle('is-hidden');
    },
    changeItemInData: async function (event) {
        console.log('changeItemInData');

        event.preventDefault();
        // Je récupère les data du formulaire
        const formData = new FormData(event.target);
        // Je crée un objet vide qui acceuillera la donnée du formulaire
        const formObject = {};
        // Je crée un objet json dans mon objet vide crée au dessus
        formData.forEach((value, key) => formObject[key] = value);
        const json = JSON.stringify(formObject);


        if (confirm("Voulez vous vraiment modifier cet élément ?")) {
            try {
                const response = await fetch(`/user/${user.elementId}`, {
                    method: 'PUT',
                    body: json,
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if (!response.ok) {
                    throw new Error("Impossible de modifier cet élément !")
                } else {
                    alert("Elément modifié !")
                }
                window.location.reload();
            } catch (error) {
                console.trace(error);
            }
        }

    },







}