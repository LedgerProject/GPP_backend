export const enum PermissionKeys {
    // GPP operator permissions
    GeneralOrganizationManagement = 'GeneralOrganizationManagement',
    GeneralUsersManagement = 'GeneralUsersManagement',
    GeneralStructuresManagement = 'GeneralStructuresManagement',
    GeneralContentManagement = 'GeneralContentManagement',
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
    ContentCreation = 'ContentCreation',
    ContentUpdate = 'ContentUpdate',
    ContentDetail = 'ContentDetail',
    ContentsList = 'ContentsList',
    CategoriesList = 'CategoriesList',
    CountriesList = 'CountriesList',
    CountryDetail = 'CountryDetail',
    NationalitiesList = 'NationalitiesList',

    // Operator + user permissions
    StructureList = 'StructureList',
    StructureDetail = 'StructureDetail',

    // GPP operator + operator + user permissions
    AuthFeatures = 'AuthFeatures',
    ProfileEdit = 'ProfileEdit'
}
