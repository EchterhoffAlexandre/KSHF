const utilModule = {

    base_url: process.env.API_BASE_URL || "http://localhost:3000",
    DisplayList: function(items, wrapper, rows_per_page, page) {
        console.log('DisplayList')
        wrapper.innerHTML = "";
        page--;

        let start = rows_per_page * page;
        let end = start + rows_per_page;
        let paginatedItems = items.slice(start, end);

        
        for (let i = 0; i < paginatedItems.length; i++) {
            let item = paginatedItems[i];
            let item_element = document.createElement('div');
            item_element.classList.add('item');

            // Ajoute la description
            let description = document.createElement('div');
            description.classList.add('description');
            description.innerText = item.description;
            item_element.appendChild(description);

            // Ajoute la catégorie
            let category = document.createElement('div');
            category.classList.add('category');
            category.innerText = item.category;
            item_element.appendChild(category);

            // Ajoute le niveau requis
            let level = document.createElement('div');
            level.classList.add('level');
            level.innerText = `Niveau requis : ${item.level}`;
            item_element.appendChild(level);

            // Ajoute le bouton Supprimer
            let delete_button = document.createElement('button');
            delete_button.classList.add('delete-button');
            delete_button.innerText = 'Supprimer';
            delete_button.addEventListener('click', function(event) {
                console.log('Supprimer', item.id);
                // Ajouter ici le code pour supprimer l'élément correspondant dans la base de données
                // et dans le tableau shop.items
            });
            item_element.appendChild(delete_button);

            // Ajoute le bouton Modifier
            let edit_button = document.createElement('button');
            edit_button.classList.add('edit-button');
            edit_button.innerText = 'Modifier';
            edit_button.addEventListener('click', function(event) {
                console.log('Modifier', item.id);
                // Ajouter ici le code pour modifier l'élément correspondant dans la base de données
                // et dans le tableau shop.items
            });
            item_element.appendChild(edit_button);

            wrapper.appendChild(item_element);
        }

        
    },
    SetupPagination: function(items, wrapper, rows_per_page) {
        console.log('SetupPagination');
        wrapper.innerHTML='';

        let page_count = Math.ceil(items.length / rows_per_page);

        for (let i = 1; i < page_count + 1; i++) {
            let btn = shop.PaginationButton(i, items);
            wrapper.appendChild(btn);
        }

    },
    PaginationButton: function ( page, items) {
        console.log('PaginationButton');
        let button = document.createElement('button')
        button.innerText = page;
        if (shop.current_page == page)  button.classList.add('active'); 

        button.addEventListener('click', function() {
            shop.current_page = page;
            shop.DisplayList(items, shop.list_element, shop.rows, shop.current_page);

            let current_btn = document.querySelector('.pagenumbers button.active');
            current_btn.classList.remove('active');

            button.classList.add('active');
        })
        return button
    }
}

module.exports = utilModule;