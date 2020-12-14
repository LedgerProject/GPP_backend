export const enum PermissionKeys {
    // GPP operator permissions
    GeneralOrganizationManagement = 'GeneralOrganizationManagement',
    GeneralUsersManagement = 'GeneralUsersManagement',
    GeneralStructuresManagement = 'GeneralStructuresManagement',
    GeneralCountriesManagement = 'GeneralCountriesManagement',
    GeneralIconsManagement = 'GeneralIconsManagement',
    GeneralCategoriesManagement = 'GeneralCategoriesManagement',
    GeneralNationalitiesManagement = 'GeneralNationalitiesManagement',

    // Operator permissions
    OrganizationAdministrator = 'OrganizationAdministrator', 
    OrganizationUsersManagement = 'OrganizationUsersManagement',
    OrganizationStructuresManagement = 'OrganizationStructuresManagement',
    StructureCreation = 'StructureCreation',
    StructureUpdate = 'StructureUpdate',
    StructureList = 'StructureList',
    StructureDetail = 'StructureDetail',
    StructureDelete = 'StructureDelete',

    // GPP operator + operator permissions
    CheckTokenDocWallet = 'CheckTokenDocWallet',
    OrganizationCreation = 'OrganizationCreation',
    OrganizationUpdate = 'OrganizationUpdate',
    OrganizationDetail = 'OrganizationDetail',
    OrganizationDelete = 'OrganizationDelete',
    MyOrganizationList = 'MyOrganizationList',

    // User permissions
    DocWalletManagement = 'DocWalletManagement',
    StructuresList = 'StructuresList',

    // GPP operator + operator + user permissions
    AuthFeatures = 'AuthFeatures',
    ProfileEdit = 'ProfileEdit'
}
