export const enum PermissionKeys {
    // GPP operator permissions
    GeneralOrganizationManagement = 'GeneralOrganizationManagement', //Managed: permette di visualizzare la sezione di gestione organizzazioni
    GeneralUsersManagement = 'GeneralUsersManagement', //Managed: permette di visualizzare la sezione di gestione operatori
    GeneralStructuresManagement = 'GeneralStructuresManagement', //Managed: permette di visualizzare la sezione di gestione strutture
    GeneralCountriesManagement = 'GeneralCountriesManagement', //Managed: permette di gestire le informazioni delle nazioni
    GeneralIconsManagement = 'GeneralIconsManagement', //Managed: permette di gestire le icone
    GeneralCategoriesManagement = 'GeneralCategoriesManagement', //Managed: permette di gestire le categorie
    GeneralNationalitiesManagement = 'GeneralNationalitiesManagement', //Managed: permette di gestire le nazionalità

    // Operator permissions
    OrganizationAdministrator = 'OrganizationAdministrator', 
    OrganizationUsersManagement = 'OrganizationUsersManagement',
    OrganizationStructuresManagement = 'OrganizationStructuresManagement',
    StructureCreation = 'StructureCreation', //Managed: permette di creare nuove strutture
    StructureUpdate = 'StructureUpdate', //Managed: permette di modificare le strutture
    StructureList = 'StructureList',  //Managed: permette di visualizzare l'elenco delle strutture
    StructureDetail = 'StructureDetail', //Managed: permette di visualizzare il dettaglio di una struttura
    StructureDelete = 'StructureDelete', //Managed: permette di eliminare la struttura

    // GPP operator + operator permissions
    CheckTokenDocWallet = 'CheckTokenDocWallet',
    OrganizationCreation = 'OrganizationCreation', //Managed: permette la creazione di nuove organizzazioni
    OrganizationUpdate = 'OrganizationUpdate', //Managed: permette la modifica delle organizzazioni
    OrganizationDetail = 'OrganizationDetail', //Managed: permette di visualizzare il dettaglio di una organizzazione
    OrganizationDelete = 'OrganizationDelete', //Managed: permette l'eliminazione delle organizzazioni
    MyOrganizationList = 'MyOrganizationList', //Managed: permette di visualizzare le proprie organizzazioni

    // User permissions
    DocWalletManagement = 'DocWalletManagement', //Managed: permette di gestire il proprio DocWallet
    StructuresList = 'StructuresList',

    // GPP operator + operator + user permissions
    AuthFeatures = 'AuthFeatures', //Managed: permette la visualizzazione
    ProfileEdit = 'ProfileEdit'
}
