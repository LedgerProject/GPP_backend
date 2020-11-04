export const enum PermissionKeys {
    // GPP operator permissions
    CountriesManagement = 'CountriesManagement',
    GeneralUsersManagement = 'GeneralUsersManagement',
    GeneralStructuresManagement = 'GeneralStructuresManagement',
    GeneralIconsManagement = 'GeneralIconsManagement', //Managed: permette di gestire le icone
    GeneralCategoriesManagement = 'GeneralCategoriesManagement', //Managed: permette di gestire le categorie

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
    MyOrganizationList = 'MyOrganizationList', //Managed: permette di visualizzare le proprie organizzazioni

    // User permissions
    DocWalletManagement = 'DocWalletManagement',
    StructuresList = 'StructuresList',

    // GPP operator + operator + user permissions
    AuthFeatures = 'AuthFeatures', //Managed: permette la visualizzazione
    ProfileEdit = 'ProfileEdit'
}
