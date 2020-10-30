export const enum PermissionKeys {
    // GPP operator permissions
    CountriesManagement = 'CountriesManagement',
    GeneralUsersManagement = 'GeneralUsersManagement',
    GeneralStructuresManagement = 'GeneralStructuresManagement',

    // Operator permissions
    OrganizationUsersManagement = 'OrganizationUsersManagement',
    OrganizationStructuresManagement = 'OrganizationStructuresManagement',

    // GPP operator + operator permissions
    CheckTokenDocWallet = 'CheckTokenDocWallet',
    OrganizationCreation = 'OrganizationCreation', //Managed: permette la creazione di nuove organizzazioni

    // User permissions
    DocWalletManagement = 'DocWalletManagement',
    StructuresList = 'StructuresList',

    // GPP operator + operator + user permissions
    AuthFeatures = 'AuthFeatures', //Managed: permette la visualizzazione
    ProfileEdit = 'ProfileEdit'
}
