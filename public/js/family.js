document.addEventListener("DOMContentLoaded", function () {

    const Family = {

        /* ---------- Propriétés ---------- */
        // Boutons
        showFamilyInfoBtn: document.querySelector('#show-family-info-btn'),
        createButton: document.querySelector('#create-button'),
        deleteButton: document.querySelector('#delete-button'),

        // Liste des familles
        familyInfos: document.querySelector('.family-info'),
        familyName: document.querySelector('.family-name'),


        // Information des familles
        familyBlock: document.querySelector('.family-block'),
        familyBlockName: document.querySelector('.family-block-name'),
        familyBloCkMembers: document.querySelector('.family-members'),
        familyBlockLevel: document.querySelector('.family-level'),

        // Création d'une famille 
        createForm: document.querySelector('.create-family'),
        familyLevelInput: document.querySelector('#family-level'),
        familyNameInput: document.querySelector('#family-name'),

        // Supprimer une famille
        familySelectDelete: document.querySelector('#family-select'),
        deleteFamilyBtn: document.querySelector('.delete-family-select-btn'),
        showFamilyDeleteBtn: document.querySelector('.select-wrapper-delete'),

        // Paramètres de pagination
        limit: 5, // Nombre d'éléments par page
        currentPage: 1, // Page actuelle
        offset: 0, // Offset de la requête

        /* ---------- CSS & HTML ---------- */
        resetFamilyInfos: function () {
            this.familyInfos.style.display = 'none';
            this.familyBlock.style.display = 'none';
        },
        
        flexFamilyInfos: function () {
            this.familyInfos.style.display = 'flex';
        },

        resetCreateFamily: function () {
            this.createForm.style.display = 'none';
            this.familyLevelInput.value = 1;
            this.familyNameInput.value = '';
        },

        resetDeleteFamily: function () {
            this.showFamilyDeleteBtn.style.display = 'none';
            this.familySelectDelete.selectedIndex = 0;
        },
    
        /* ---------- Méthodes ---------- */
        init: function () {
            // Liste des familles
            this.showFamilyInfoBtn.addEventListener('click', () => {
                // Afficher la pagination pour la première page
                this.displayFamiliesPage(1);
                // Et enfin on affiche la div qui était cachée
                this.showFamilyList();
            });

            this.createButton.addEventListener('click', () => {
                this.showCreateFamily();
            });

            // Infos des familles
            this.familyName.addEventListener('click', this.showFamilyInfos.bind(this));

            // Création d'une famille
            this.createForm.addEventListener('submit', this.handleCreateFamily.bind(this));

            // Suppression d'une famille
            this.deleteButton.addEventListener('click', this.showDeleteFamily.bind(this));
            this.familySelectDelete.addEventListener('change', this.handleDeleteFamily.bind(this));
        },

        getFamiliesPage: async function() {
            try {
                // On va chercher la liste des familles gràce à une des routes de notre API
                const families = await fetch('/families');
                // On extrait les données JSON de la réponse
                const allData = await families.json();

                return allData;
            } catch (error) {
                console.error(error);
            }
        },

        displayFamiliesPage: async function(page) {
            try  {
                const allData = await this.getFamiliesPage();
                const totalPages = Math.ceil(allData.length / this.limit);

                // Filtrage des familles pour n'en récupérer que celles de la page demandée
                const families = allData.slice((page-1)*this.limit, page*this.limit);

                // Mettre à jour l'affichage des familles
                this.familyName.textContent = '';
                families.forEach(family => {
                    const li = document.createElement('li');
                    li.textContent = family.name;
                    li.value = family.id;
                    this.familyName.appendChild(li);
                    });

                const pagination = document.querySelector('.pagination');
                pagination.textContent = '';
                for (let i = 1; i <= totalPages; i++) {
                    const button = document.createElement('button');
                    button.textContent = i;
                    if (i === page) {
                        button.disabled = true;
                    } else {
                        button.addEventListener('click', () => this.displayFamiliesPage(i));
                    }
                    pagination.appendChild(button);
                }
            } catch (error) {
                console.error(error);
            }
        },

        showFamilyList: function () {
            if (this.familyInfos.style.display === 'flex') {
                this.resetFamilyInfos();
            } else {
                this.flexFamilyInfos();
                this.resetDeleteFamily();
                this.resetCreateFamily();
            }
        },

        showFamilyInfos: async function(event) {
            try {

                if (event.target.matches('.family-name > li')) {
                    // Récupération de l'id de la famille 
                    const familyId = parseInt(event.target.value);
                    // On va chercher la liste des familles gràce à une des routes de notre API
                    const families = await fetch('/families');
                    // On extrait les données JSON de la réponse
                    const data = await families.json();
                    // Puis on utilise find() pour rechercher la famille sélectionnée
                    const selectedFamily = data.find((family) => family.id === familyId);
        
                    // Nom de la famille
                    this.familyBlockName.textContent = `Nom: ${selectedFamily.name}`;
                    // Membres de la famille
                    this.familyBloCkMembers.textContent = '';
                    selectedFamily.members.forEach(member => {
                        const li = document.createElement('li');
                        li.textContent = `${member.lastname} ${member.firstname} ${member.level}`;
                        this.familyBloCkMembers.appendChild(li);
                    });
                    // Niveau de la famille
                    this.familyBlockLevel.textContent = `Niveau: ${selectedFamily.level}`;
    
                    // Et on affiche la div cachée
                    this.familyBlock.style.display = 'flex';
                }

            } catch (error) {
                console.error(error);
            }
        },

        showCreateFamily: function () {
            if (this.createForm.style.display === 'flex') {
                this.resetCreateFamily();
            } else {
                this.createForm.style.display = 'flex';
                this.resetFamilyInfos();
                this.resetDeleteFamily();
            }
        },

        handleCreateFamily: async function (event) {
            event.preventDefault();

            // Valeurs possible (ici j'ai fait en sorte qu'un niveau de famille soit compris entre 1 et 20)
            if (parseInt(this.familyLevelInput.value) > 20) {
                this.familyLevelInput.value = 20;
            }
            if (parseInt(this.familyLevelInput.value) < 1) {
                this.familyLevelInput.value = 1;
            }

            const data = {
                name: this.familyNameInput.value,
                level: parseInt(this.familyLevelInput.value),
                members: []
            };

            try  {
                const response = await fetch('/family', {
                    method: "POST",
                    headers: {
                        'Content-Type':  'application/json'
                    },
                    body: JSON.stringify(data)
                });
        
                if (response.ok) {
                    console.log('Successfully created family');
                    // On remasque le form après la création
                    this.createForm.style.display = 'none';
                    // On actualise la page pour que la nouvelle famille soit prise en compte dans la liste des familles
                    window.location.reload();
                } else {
                    console.error('Error creating family');
                }
            } catch (error) {
                console.error(error);
            }
        },

        showDeleteFamily: function () {
            if (this.showFamilyDeleteBtn.style.display === 'flex') {
                this.resetDeleteFamily();
            } else {
                this.resetCreateFamily();
                this.resetFamilyInfos();
                this.showFamilyDeleteBtn.style.display = 'flex';
            }
        },

        handleDeleteFamily: function (event) {
            const familyId = parseInt(event.target.value);
            this.deleteFamilyBtn.addEventListener('click', () => {
                this.confirmDelete(familyId);
            });
        },

        confirmDelete: async function (familyId) {
            const confirmed = confirm("Do you confirm the deletion of the family?");
            if (confirmed) {
                try {
                    const response = await fetch(`/family/${familyId}`, { method: 'DELETE'});
                    if (response.ok) {
                        console.log('Deleted family');
                        // Rechargement de la page pour mettre à jour la liste des familles
                        window.location.reload();
                    } else {
                        console.error('Error deleting family')
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        },

    };
    Family.init();
});