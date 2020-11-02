export const enum PermissionKeys {
    // GPP operator permissions
    CountriesManagement = 'CountriesManagement',
    GeneralUsersManagement = 'GeneralUsersManagement',
    GeneralStructuresManagement = 'GeneralStructuresManagement',

    // Operator permissions
    OrganizationAdministrator = 'OrganizationAdministrator',
    OrganizationUsersManagement = 'OrganizationUsersManagement',
    OrganizationStructuresManagement = 'OrganizationStructuresManagement',
    StructureCreation = 'StructureCreation', //Managed: permette di creare nuove strutture
    StructureList = 'StructureList',  //Managed: permette di visualizzare l'elenco delle strutture

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
