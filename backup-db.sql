PGDMP     1                
    x            gpp_db    13.0    13.0 ]    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    32787    gpp_db    DATABASE     Q   CREATE DATABASE gpp_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';
    DROP DATABASE gpp_db;
                postgres    false                        3079    32788 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                   false            �           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                        false    2            �            1259    32799 
   categories    TABLE     �   CREATE TABLE public.categories (
    "idCategory" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identifier character varying(50) NOT NULL,
    type character varying(20) NOT NULL
);
    DROP TABLE public.categories;
       public         heap    gpp_user    false    2            �            1259    32803    categoriesLanguages    TABLE       CREATE TABLE public."categoriesLanguages" (
    "idCategoryLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCategory" uuid NOT NULL,
    alias character varying(50) NOT NULL,
    category character varying(50) NOT NULL,
    language character(2) NOT NULL
);
 )   DROP TABLE public."categoriesLanguages";
       public         heap    gpp_user    false    2            �            1259    32807 	   countries    TABLE     �   CREATE TABLE public.countries (
    "idCountry" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identifier character varying(50) NOT NULL,
    completed boolean DEFAULT false
);
    DROP TABLE public.countries;
       public         heap    gpp_user    false    2            �            1259    32812    countriesLanguages    TABLE       CREATE TABLE public."countriesLanguages" (
    "idCountryLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCountry" uuid NOT NULL,
    alias character varying(50) NOT NULL,
    country character varying(50) NOT NULL,
    language character(2) NOT NULL
);
 (   DROP TABLE public."countriesLanguages";
       public         heap    gpp_user    false    2            �            1259    32816    countriesTopics    TABLE     �   CREATE TABLE public."countriesTopics" (
    "idCountryTopic" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCountry" uuid NOT NULL,
    identifier character varying(100) NOT NULL
);
 %   DROP TABLE public."countriesTopics";
       public         heap    gpp_user    false    2            �            1259    32820    countriesTopicsLanguages    TABLE       CREATE TABLE public."countriesTopicsLanguages" (
    "idCountryTopicLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCountryTopic" uuid NOT NULL,
    topic character varying(100) NOT NULL,
    description text NOT NULL,
    language character(2) NOT NULL
);
 .   DROP TABLE public."countriesTopicsLanguages";
       public         heap    gpp_user    false    2            �            1259    32827 	   documents    TABLE     E  CREATE TABLE public.documents (
    "idDocument" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idUser" uuid NOT NULL,
    title character varying(50) NOT NULL,
    filename character varying(100) NOT NULL,
    "mimeType" character varying(20),
    size integer,
    "widthPixel" integer,
    "heightPixel" integer
);
    DROP TABLE public.documents;
       public         heap    gpp_user    false    2            �            1259    33079    documentsEncryptedChunks    TABLE     2  CREATE TABLE public."documentsEncryptedChunks" (
    "idDocumentEncryptedChunk" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idDocument" uuid NOT NULL,
    "chunkIndexId" integer,
    checksum character varying(32),
    header character varying(50),
    iv character varying(50),
    text text
);
 .   DROP TABLE public."documentsEncryptedChunks";
       public         heap    postgres    false    2            �            1259    32831    encryptedChunk    TABLE     l  CREATE TABLE public."encryptedChunk" (
    id integer NOT NULL,
    "idUser" uuid NOT NULL,
    name character varying(50) NOT NULL,
    "chunkIndexId" character varying(32),
    checksum character varying(32),
    header character varying(50),
    iv character varying(50),
    text text,
    contenttype character varying(50),
    "uploadReferenceId" integer
);
 $   DROP TABLE public."encryptedChunk";
       public         heap    gpp_user    false            �            1259    32837    encryptedChunk_id_seq    SEQUENCE     �   ALTER TABLE public."encryptedChunk" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."encryptedChunk_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          gpp_user    false    208            �            1259    32839    icons    TABLE     �   CREATE TABLE public.icons (
    "idIcon" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(30) NOT NULL,
    image text NOT NULL,
    marker text NOT NULL
);
    DROP TABLE public.icons;
       public         heap    gpp_user    false    2            �            1259    32846    nationalities    TABLE     �   CREATE TABLE public.nationalities (
    "idNationality" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identifier character varying(50) NOT NULL
);
 !   DROP TABLE public.nationalities;
       public         heap    gpp_user    false    2            �            1259    32850    nationalitiesLanguages    TABLE       CREATE TABLE public."nationalitiesLanguages" (
    "idNationalityLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idNationality" uuid NOT NULL,
    alias character varying(50) NOT NULL,
    nationality character varying(50) NOT NULL,
    language character(2) NOT NULL
);
 ,   DROP TABLE public."nationalitiesLanguages";
       public         heap    gpp_user    false    2            �            1259    32854    organizations    TABLE     �   CREATE TABLE public.organizations (
    "idOrganization" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL
);
 !   DROP TABLE public.organizations;
       public         heap    gpp_user    false    2            �            1259    32858    organizationsUsers    TABLE       CREATE TABLE public."organizationsUsers" (
    "idOrganizationUser" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idOrganization" uuid NOT NULL,
    "idUser" uuid NOT NULL,
    permissions text NOT NULL,
    confirmed boolean DEFAULT false NOT NULL
);
 (   DROP TABLE public."organizationsUsers";
       public         heap    gpp_user    false    2            �            1259    32866    users    TABLE     S  CREATE TABLE public.users (
    "idUser" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "userType" character varying(30) NOT NULL,
    "firstName" character varying(50) NOT NULL,
    "lastName" character varying(50) NOT NULL,
    email character varying(150) NOT NULL,
    "emailConfirmed" boolean DEFAULT false,
    password character varying(150) NOT NULL,
    "passwordRecoveryToken" character varying(150),
    "passwordRecoveryDate" timestamp without time zone,
    permissions text,
    "idNationality" uuid,
    gender character varying(10),
    birthday date,
    "idIcon" uuid
);
    DROP TABLE public.users;
       public         heap    gpp_user    false    2            �            1259    32874    organizationsUsersView    VIEW     �  CREATE VIEW public."organizationsUsersView" AS
 SELECT "organizationsUsers"."idOrganizationUser",
    "organizationsUsers"."idOrganization",
    "organizationsUsers"."idUser",
    organizations.name,
    users."firstName",
    users."lastName"
   FROM ((public."organizationsUsers"
     JOIN public.organizations ON (("organizationsUsers"."idOrganization" = organizations."idOrganization")))
     JOIN public.users ON (("organizationsUsers"."idUser" = users."idUser")));
 +   DROP VIEW public."organizationsUsersView";
       public          gpp_user    false    215    215    215    214    214    214    213    213            �            1259    32878 
   structures    TABLE     -  CREATE TABLE public.structures (
    "idStructure" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idOrganization" uuid,
    alias character varying(100) NOT NULL,
    name character varying(100) NOT NULL,
    address character varying(50) NOT NULL,
    city character varying(50) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    email character varying(150),
    "phoneNumberPrefix" character(3),
    "phoneNumber" character varying(50),
    website character varying(150),
    "idIcon" uuid NOT NULL
);
    DROP TABLE public.structures;
       public         heap    gpp_user    false    2            �            1259    32885    structuresCategories    TABLE     �   CREATE TABLE public."structuresCategories" (
    "idStructureCategory" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idStructure" uuid NOT NULL,
    "idCategory" uuid NOT NULL
);
 *   DROP TABLE public."structuresCategories";
       public         heap    gpp_user    false    2            �            1259    33063    structuresCategoriesView    VIEW     ^  CREATE VIEW public."structuresCategoriesView" AS
 SELECT "structuresCategories"."idStructureCategory",
    "structuresCategories"."idStructure",
    "structuresCategories"."idCategory",
    categories.identifier
   FROM (public."structuresCategories"
     JOIN public.categories ON (("structuresCategories"."idCategory" = categories."idCategory")));
 -   DROP VIEW public."structuresCategoriesView";
       public          postgres    false    218    218    218    201    201            �            1259    32889    structuresImages    TABLE     D  CREATE TABLE public."structuresImages" (
    "idStructureImage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idStructure" uuid NOT NULL,
    folder character varying(100) NOT NULL,
    filename character varying(100) NOT NULL,
    "mimeType" character varying(20),
    size integer,
    sorting integer NOT NULL
);
 &   DROP TABLE public."structuresImages";
       public         heap    gpp_user    false    2            �            1259    32893    structuresLanguages    TABLE     �   CREATE TABLE public."structuresLanguages" (
    "idStructureLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idStructure" uuid NOT NULL,
    description text,
    language character(2) NOT NULL
);
 )   DROP TABLE public."structuresLanguages";
       public         heap    gpp_user    false    2            �            1259    32900    structuresView    VIEW     �  CREATE VIEW public."structuresView" AS
 SELECT structures."idStructure",
    structures."idOrganization",
    organizations.name AS organizationname,
    structures.alias,
    structures.name AS structurename,
    structures.address,
    structures.city,
    structures.latitude,
    structures.longitude,
    structures.email,
    structures."phoneNumberPrefix",
    structures."phoneNumber",
    structures.website,
    structures."idIcon",
    icons.image AS iconimage,
    icons.marker AS iconmarker
   FROM ((public.structures
     LEFT JOIN public.organizations ON ((structures."idOrganization" = organizations."idOrganization")))
     JOIN public.icons ON ((structures."idIcon" = icons."idIcon")));
 #   DROP VIEW public."structuresView";
       public          gpp_user    false    217    210    210    217    217    217    210    217    217    217    217    217    217    217    217    213    213    217            �            1259    32905    usersInvitations    TABLE     
  CREATE TABLE public."usersInvitations" (
    "idUserInvitation" uuid NOT NULL,
    "idUserSender" uuid NOT NULL,
    "idUserRecipient" uuid NOT NULL,
    message text,
    "accessLevel" character varying(100) NOT NULL,
    accepted boolean DEFAULT false NOT NULL
);
 &   DROP TABLE public."usersInvitations";
       public         heap    gpp_user    false            �            1259    32912    usersTokens    TABLE     �   CREATE TABLE public."usersTokens" (
    "idUserToken" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idUser" uuid NOT NULL,
    token character varying NOT NULL,
    "validUntil" time without time zone NOT NULL
);
 !   DROP TABLE public."usersTokens";
       public         heap    gpp_user    false    2            w          0    32799 
   categories 
   TABLE DATA           D   COPY public.categories ("idCategory", identifier, type) FROM stdin;
    public          gpp_user    false    201   >�       x          0    32803    categoriesLanguages 
   TABLE DATA           n   COPY public."categoriesLanguages" ("idCategoryLanguage", "idCategory", alias, category, language) FROM stdin;
    public          gpp_user    false    202          y          0    32807 	   countries 
   TABLE DATA           G   COPY public.countries ("idCountry", identifier, completed) FROM stdin;
    public          gpp_user    false    203   ӎ       z          0    32812    countriesLanguages 
   TABLE DATA           j   COPY public."countriesLanguages" ("idCountryLanguage", "idCountry", alias, country, language) FROM stdin;
    public          gpp_user    false    204   x�       {          0    32816    countriesTopics 
   TABLE DATA           V   COPY public."countriesTopics" ("idCountryTopic", "idCountry", identifier) FROM stdin;
    public          gpp_user    false    205   �       |          0    32820    countriesTopicsLanguages 
   TABLE DATA           ~   COPY public."countriesTopicsLanguages" ("idCountryTopicLanguage", "idCountryTopic", topic, description, language) FROM stdin;
    public          gpp_user    false    206   ��       }          0    32827 	   documents 
   TABLE DATA           {   COPY public.documents ("idDocument", "idUser", title, filename, "mimeType", size, "widthPixel", "heightPixel") FROM stdin;
    public          gpp_user    false    207   �       �          0    33079    documentsEncryptedChunks 
   TABLE DATA           �   COPY public."documentsEncryptedChunks" ("idDocumentEncryptedChunk", "idDocument", "chunkIndexId", checksum, header, iv, text) FROM stdin;
    public          postgres    false    225   	�       ~          0    32831    encryptedChunk 
   TABLE DATA           �   COPY public."encryptedChunk" (id, "idUser", name, "chunkIndexId", checksum, header, iv, text, contenttype, "uploadReferenceId") FROM stdin;
    public          gpp_user    false    208   &�       �          0    32839    icons 
   TABLE DATA           >   COPY public.icons ("idIcon", name, image, marker) FROM stdin;
    public          gpp_user    false    210   C�       �          0    32846    nationalities 
   TABLE DATA           D   COPY public.nationalities ("idNationality", identifier) FROM stdin;
    public          gpp_user    false    211   �       �          0    32850    nationalitiesLanguages 
   TABLE DATA           z   COPY public."nationalitiesLanguages" ("idNationalityLanguage", "idNationality", alias, nationality, language) FROM stdin;
    public          gpp_user    false    212   ��       �          0    32854    organizations 
   TABLE DATA           ?   COPY public.organizations ("idOrganization", name) FROM stdin;
    public          gpp_user    false    213   D�       �          0    32858    organizationsUsers 
   TABLE DATA           x   COPY public."organizationsUsers" ("idOrganizationUser", "idOrganization", "idUser", permissions, confirmed) FROM stdin;
    public          gpp_user    false    214   ��       �          0    32878 
   structures 
   TABLE DATA           �   COPY public.structures ("idStructure", "idOrganization", alias, name, address, city, latitude, longitude, email, "phoneNumberPrefix", "phoneNumber", website, "idIcon") FROM stdin;
    public          gpp_user    false    217   s�       �          0    32885    structuresCategories 
   TABLE DATA           d   COPY public."structuresCategories" ("idStructureCategory", "idStructure", "idCategory") FROM stdin;
    public          gpp_user    false    218   r�       �          0    32889    structuresImages 
   TABLE DATA           |   COPY public."structuresImages" ("idStructureImage", "idStructure", folder, filename, "mimeType", size, sorting) FROM stdin;
    public          gpp_user    false    219   8�       �          0    32893    structuresLanguages 
   TABLE DATA           l   COPY public."structuresLanguages" ("idStructureLanguage", "idStructure", description, language) FROM stdin;
    public          gpp_user    false    220   n�       �          0    32866    users 
   TABLE DATA           �   COPY public.users ("idUser", "userType", "firstName", "lastName", email, "emailConfirmed", password, "passwordRecoveryToken", "passwordRecoveryDate", permissions, "idNationality", gender, birthday, "idIcon") FROM stdin;
    public          gpp_user    false    215   y�       �          0    32905    usersInvitations 
   TABLE DATA           �   COPY public."usersInvitations" ("idUserInvitation", "idUserSender", "idUserRecipient", message, "accessLevel", accepted) FROM stdin;
    public          gpp_user    false    222   ��       �          0    32912    usersTokens 
   TABLE DATA           U   COPY public."usersTokens" ("idUserToken", "idUser", token, "validUntil") FROM stdin;
    public          gpp_user    false    223   ��       �           0    0    encryptedChunk_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."encryptedChunk_id_seq"', 2, true);
          public          gpp_user    false    209            �           2606    32922 ,   categoriesLanguages categoriesLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."categoriesLanguages"
    ADD CONSTRAINT "categoriesLanguages_pkey" PRIMARY KEY ("idCategoryLanguage");
 Z   ALTER TABLE ONLY public."categoriesLanguages" DROP CONSTRAINT "categoriesLanguages_pkey";
       public            gpp_user    false    202            �           2606    32924    categories categories_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY ("idCategory");
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            gpp_user    false    201            �           2606    32926 *   countriesLanguages countriesLanguages_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY public."countriesLanguages"
    ADD CONSTRAINT "countriesLanguages_pkey" PRIMARY KEY ("idCountryLanguage");
 X   ALTER TABLE ONLY public."countriesLanguages" DROP CONSTRAINT "countriesLanguages_pkey";
       public            gpp_user    false    204            �           2606    32928 6   countriesTopicsLanguages countriesTopicsLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."countriesTopicsLanguages"
    ADD CONSTRAINT "countriesTopicsLanguages_pkey" PRIMARY KEY ("idCountryTopicLanguage");
 d   ALTER TABLE ONLY public."countriesTopicsLanguages" DROP CONSTRAINT "countriesTopicsLanguages_pkey";
       public            gpp_user    false    206            �           2606    32930 $   countriesTopics countriesTopics_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public."countriesTopics"
    ADD CONSTRAINT "countriesTopics_pkey" PRIMARY KEY ("idCountryTopic");
 R   ALTER TABLE ONLY public."countriesTopics" DROP CONSTRAINT "countriesTopics_pkey";
       public            gpp_user    false    205            �           2606    32932    countries countries_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY ("idCountry");
 B   ALTER TABLE ONLY public.countries DROP CONSTRAINT countries_pkey;
       public            gpp_user    false    203            �           2606    33086 6   documentsEncryptedChunks documentsEncryptedChunks_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."documentsEncryptedChunks"
    ADD CONSTRAINT "documentsEncryptedChunks_pkey" PRIMARY KEY ("idDocumentEncryptedChunk");
 d   ALTER TABLE ONLY public."documentsEncryptedChunks" DROP CONSTRAINT "documentsEncryptedChunks_pkey";
       public            postgres    false    225            �           2606    32934    documents documents_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY ("idDocument");
 B   ALTER TABLE ONLY public.documents DROP CONSTRAINT documents_pkey;
       public            gpp_user    false    207            �           2606    32936 "   encryptedChunk encryptedChunk_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."encryptedChunk"
    ADD CONSTRAINT "encryptedChunk_pkey" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public."encryptedChunk" DROP CONSTRAINT "encryptedChunk_pkey";
       public            gpp_user    false    208            �           2606    32938    icons icons_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.icons
    ADD CONSTRAINT icons_pkey PRIMARY KEY ("idIcon");
 :   ALTER TABLE ONLY public.icons DROP CONSTRAINT icons_pkey;
       public            gpp_user    false    210            �           2606    32940 2   nationalitiesLanguages nationalitiesLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."nationalitiesLanguages"
    ADD CONSTRAINT "nationalitiesLanguages_pkey" PRIMARY KEY ("idNationalityLanguage");
 `   ALTER TABLE ONLY public."nationalitiesLanguages" DROP CONSTRAINT "nationalitiesLanguages_pkey";
       public            gpp_user    false    212            �           2606    32942     nationalities nationalities_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.nationalities
    ADD CONSTRAINT nationalities_pkey PRIMARY KEY ("idNationality");
 J   ALTER TABLE ONLY public.nationalities DROP CONSTRAINT nationalities_pkey;
       public            gpp_user    false    211            �           2606    32944 *   organizationsUsers organizationsUsers_pkey 
   CONSTRAINT     ~   ALTER TABLE ONLY public."organizationsUsers"
    ADD CONSTRAINT "organizationsUsers_pkey" PRIMARY KEY ("idOrganizationUser");
 X   ALTER TABLE ONLY public."organizationsUsers" DROP CONSTRAINT "organizationsUsers_pkey";
       public            gpp_user    false    214            �           2606    32946     organizations organizations_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY ("idOrganization");
 J   ALTER TABLE ONLY public.organizations DROP CONSTRAINT organizations_pkey;
       public            gpp_user    false    213            �           2606    32948 .   structuresCategories structuresCategories_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."structuresCategories"
    ADD CONSTRAINT "structuresCategories_pkey" PRIMARY KEY ("idStructureCategory");
 \   ALTER TABLE ONLY public."structuresCategories" DROP CONSTRAINT "structuresCategories_pkey";
       public            gpp_user    false    218            �           2606    32950 &   structuresImages structuresImages_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public."structuresImages"
    ADD CONSTRAINT "structuresImages_pkey" PRIMARY KEY ("idStructureImage");
 T   ALTER TABLE ONLY public."structuresImages" DROP CONSTRAINT "structuresImages_pkey";
       public            gpp_user    false    219            �           2606    32952 ,   structuresLanguages structuresLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."structuresLanguages"
    ADD CONSTRAINT "structuresLanguages_pkey" PRIMARY KEY ("idStructureLanguage");
 Z   ALTER TABLE ONLY public."structuresLanguages" DROP CONSTRAINT "structuresLanguages_pkey";
       public            gpp_user    false    220            �           2606    32954    structures structures_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.structures
    ADD CONSTRAINT structures_pkey PRIMARY KEY ("idStructure");
 D   ALTER TABLE ONLY public.structures DROP CONSTRAINT structures_pkey;
       public            gpp_user    false    217            �           2606    32956 &   usersInvitations usersInvitations_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public."usersInvitations"
    ADD CONSTRAINT "usersInvitations_pkey" PRIMARY KEY ("idUserInvitation");
 T   ALTER TABLE ONLY public."usersInvitations" DROP CONSTRAINT "usersInvitations_pkey";
       public            gpp_user    false    222            �           2606    32958    usersTokens usersTokens_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public."usersTokens"
    ADD CONSTRAINT "usersTokens_pkey" PRIMARY KEY ("idUserToken");
 J   ALTER TABLE ONLY public."usersTokens" DROP CONSTRAINT "usersTokens_pkey";
       public            gpp_user    false    223            �           2606    32960    users users_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY ("idUser");
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            gpp_user    false    215            �           2606    32961 7   categoriesLanguages categoriesLanguages_idCategory_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."categoriesLanguages"
    ADD CONSTRAINT "categoriesLanguages_idCategory_fkey" FOREIGN KEY ("idCategory") REFERENCES public.categories("idCategory") ON DELETE CASCADE NOT VALID;
 e   ALTER TABLE ONLY public."categoriesLanguages" DROP CONSTRAINT "categoriesLanguages_idCategory_fkey";
       public          gpp_user    false    202    3254    201            �           2606    32966 4   countriesLanguages countriesLanguages_idCountry_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."countriesLanguages"
    ADD CONSTRAINT "countriesLanguages_idCountry_fkey" FOREIGN KEY ("idCountry") REFERENCES public.countries("idCountry") ON DELETE CASCADE;
 b   ALTER TABLE ONLY public."countriesLanguages" DROP CONSTRAINT "countriesLanguages_idCountry_fkey";
       public          gpp_user    false    204    3258    203            �           2606    32971 E   countriesTopicsLanguages countriesTopicsLanguages_idCountryTopic_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."countriesTopicsLanguages"
    ADD CONSTRAINT "countriesTopicsLanguages_idCountryTopic_fkey" FOREIGN KEY ("idCountryTopic") REFERENCES public."countriesTopics"("idCountryTopic") ON DELETE CASCADE;
 s   ALTER TABLE ONLY public."countriesTopicsLanguages" DROP CONSTRAINT "countriesTopicsLanguages_idCountryTopic_fkey";
       public          gpp_user    false    3262    206    205            �           2606    32976 .   countriesTopics countriesTopics_idCountry_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."countriesTopics"
    ADD CONSTRAINT "countriesTopics_idCountry_fkey" FOREIGN KEY ("idCountry") REFERENCES public.countries("idCountry") ON DELETE CASCADE NOT VALID;
 \   ALTER TABLE ONLY public."countriesTopics" DROP CONSTRAINT "countriesTopics_idCountry_fkey";
       public          gpp_user    false    205    203    3258            �           2606    33087 A   documentsEncryptedChunks documentsEncryptedChunks_idDocument_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."documentsEncryptedChunks"
    ADD CONSTRAINT "documentsEncryptedChunks_idDocument_fkey" FOREIGN KEY ("idDocument") REFERENCES public.documents("idDocument") ON DELETE CASCADE NOT VALID;
 o   ALTER TABLE ONLY public."documentsEncryptedChunks" DROP CONSTRAINT "documentsEncryptedChunks_idDocument_fkey";
       public          postgres    false    207    3266    225            �           2606    32981    documents documents_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.documents
    ADD CONSTRAINT "documents_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 K   ALTER TABLE ONLY public.documents DROP CONSTRAINT "documents_idUser_fkey";
       public          gpp_user    false    3280    215    207            �           2606    32986 @   nationalitiesLanguages nationalitiesLanguages_idNationality_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."nationalitiesLanguages"
    ADD CONSTRAINT "nationalitiesLanguages_idNationality_fkey" FOREIGN KEY ("idNationality") REFERENCES public.nationalities("idNationality") ON DELETE CASCADE NOT VALID;
 n   ALTER TABLE ONLY public."nationalitiesLanguages" DROP CONSTRAINT "nationalitiesLanguages_idNationality_fkey";
       public          gpp_user    false    3272    212    211            �           2606    32991 9   organizationsUsers organizationsUsers_idOrganization_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."organizationsUsers"
    ADD CONSTRAINT "organizationsUsers_idOrganization_fkey" FOREIGN KEY ("idOrganization") REFERENCES public.organizations("idOrganization") ON DELETE CASCADE NOT VALID;
 g   ALTER TABLE ONLY public."organizationsUsers" DROP CONSTRAINT "organizationsUsers_idOrganization_fkey";
       public          gpp_user    false    213    214    3276            �           2606    32996 1   organizationsUsers organizationsUsers_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."organizationsUsers"
    ADD CONSTRAINT "organizationsUsers_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 _   ALTER TABLE ONLY public."organizationsUsers" DROP CONSTRAINT "organizationsUsers_idUser_fkey";
       public          gpp_user    false    214    215    3280            �           2606    33001 9   structuresCategories structuresCategories_idCategory_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresCategories"
    ADD CONSTRAINT "structuresCategories_idCategory_fkey" FOREIGN KEY ("idCategory") REFERENCES public.categories("idCategory") ON DELETE CASCADE;
 g   ALTER TABLE ONLY public."structuresCategories" DROP CONSTRAINT "structuresCategories_idCategory_fkey";
       public          gpp_user    false    201    218    3254            �           2606    33006 :   structuresCategories structuresCategories_idStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresCategories"
    ADD CONSTRAINT "structuresCategories_idStructure_fkey" FOREIGN KEY ("idStructure") REFERENCES public.structures("idStructure") ON DELETE CASCADE;
 h   ALTER TABLE ONLY public."structuresCategories" DROP CONSTRAINT "structuresCategories_idStructure_fkey";
       public          gpp_user    false    218    217    3282            �           2606    33011 2   structuresImages structuresImages_idStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresImages"
    ADD CONSTRAINT "structuresImages_idStructure_fkey" FOREIGN KEY ("idStructure") REFERENCES public.structures("idStructure") ON DELETE CASCADE;
 `   ALTER TABLE ONLY public."structuresImages" DROP CONSTRAINT "structuresImages_idStructure_fkey";
       public          gpp_user    false    217    3282    219            �           2606    33016 8   structuresLanguages structuresLanguages_idStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresLanguages"
    ADD CONSTRAINT "structuresLanguages_idStructure_fkey" FOREIGN KEY ("idStructure") REFERENCES public.structures("idStructure") ON DELETE CASCADE;
 f   ALTER TABLE ONLY public."structuresLanguages" DROP CONSTRAINT "structuresLanguages_idStructure_fkey";
       public          gpp_user    false    220    217    3282            �           2606    33021 !   structures structures_idIcon_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.structures
    ADD CONSTRAINT "structures_idIcon_fkey" FOREIGN KEY ("idIcon") REFERENCES public.icons("idIcon") NOT VALID;
 M   ALTER TABLE ONLY public.structures DROP CONSTRAINT "structures_idIcon_fkey";
       public          gpp_user    false    3270    210    217            �           2606    33026 )   structures structures_idOrganization_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.structures
    ADD CONSTRAINT "structures_idOrganization_fkey" FOREIGN KEY ("idOrganization") REFERENCES public.organizations("idOrganization") ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.structures DROP CONSTRAINT "structures_idOrganization_fkey";
       public          gpp_user    false    213    3276    217            �           2606    33031 6   usersInvitations usersInvitations_idUserRecipient_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersInvitations"
    ADD CONSTRAINT "usersInvitations_idUserRecipient_fkey" FOREIGN KEY ("idUserRecipient") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 d   ALTER TABLE ONLY public."usersInvitations" DROP CONSTRAINT "usersInvitations_idUserRecipient_fkey";
       public          gpp_user    false    222    3280    215            �           2606    33036 3   usersInvitations usersInvitations_idUserSender_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersInvitations"
    ADD CONSTRAINT "usersInvitations_idUserSender_fkey" FOREIGN KEY ("idUserSender") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 a   ALTER TABLE ONLY public."usersInvitations" DROP CONSTRAINT "usersInvitations_idUserSender_fkey";
       public          gpp_user    false    3280    215    222            �           2606    33041 #   usersTokens usersTokens_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersTokens"
    ADD CONSTRAINT "usersTokens_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 Q   ALTER TABLE ONLY public."usersTokens" DROP CONSTRAINT "usersTokens_idUser_fkey";
       public          gpp_user    false    223    215    3280            �           2606    33046    users users_idNationality_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_idNationality_fkey" FOREIGN KEY ("idNationality") REFERENCES public.nationalities("idNationality") NOT VALID;
 J   ALTER TABLE ONLY public.users DROP CONSTRAINT "users_idNationality_fkey";
       public          gpp_user    false    211    215    3272            w   t   x�U�1! �^q�C wHycc�l�ԙ��o�>`�i�j�L@+p�
�$�V���ܸ���:�n�k�B�F0����diP�UնU���^|,��1�������y'      x     x���1n�0Eg�� R�%k,�t�ֵE�M ��\*���*gɚ����Y0���*�%B�^�e�]�ڢթ���)H-
�[�KMDa�;o;��.����!G���[X.C.qNj
���~�d(V%�[��h�i��N��������Y��9aX�WV�}?�W����a��O÷�[���`1
�7�
��׼4�9�k�'dOҸ�o��lJ�&�۱�� 2 5�9sF˯=��^O�r����Ǐc�~ކa��C�      y   �   x��;
B1 ��.+��'��bmk��dAЇ�����v��5K2M��
hFЛ1>��^�e}^���G��C�< �X�2��^�g��������
��-�L��>�'�V����X����P�>�Z	:M_�d����_}�S���;2/      z   z   x�����0 ki�LJ��!_�@�"H��c����pg,.���S�UV�������:O�H�L���Z�^��<�(����ڔ%�� �:07w��e���>~�ī>n��/�4       {   �   x��̻1��\<�ɒ� $�li����ᶀ�:֌r�ɂިk��hq�T'�)1(���2�d�s�8�����G+ikLKG�TP*�s�pVj{����f�#�m��
��`��r��ʝ���YJ���B      |   E  x���=n�0Fk�<�h`Y��@�I�rZ��<#��9��.R��I���|�4�޸ޭ����`��Y�sh�svƪkD�8��t���4��im�Nm=Y�>�{��k:i�*'/e�x�x_�K��]��1�|B��"��»Ĉ;P��ҩ+��A_Wx;�°e|���Ii͔�e�����e�Ң�QK�܅�<?�:�
�^�q�}f��1]����z�v�������_�x�@����3�(�N�xf�L
���x�,"ߖTD$O	��icu�i俐�z�ߗ�L9�ɴ�D�~J���c��ZQ�]��!=�      }      x������ � �      �      x������ � �      ~      x������ � �      �      x���ǖ�PbD����9�d/�"��w�,r�z�3�݋Vh	�{���6��0���� �Ē4�gZ��?1J�<M0�H��U����ͺ%���G�l�5CR����;Mւ����Y�>!�S����;^-x�{��{Ȝ�7l���ީ�����DaVe�r�C��!��K���R�<�g��w]��T0{\v��N !��S����-�̵��B$0RV�>��xb�C�9+���^"���\��C�8	bn��-~� Z�� ��K�h��2��N@�/˿o�BG��ȕ ��,�r� H@�l���=o��%J:��^/A�EV� ��U}�=�BxL�NٵQ�O��-ks�z�.j<K��\lg2,���Ğ�;x�F�0p� |0h>4 T{x�V�`���v	�Z
���0BtI3\����u��>�۱c|@e�4`=⁛��(��ɲ��ĉ��r�jyXfG����B)��	�� o�U���	�^�1m��� Ljl4�s��~*�ێ/mף�N�$�����k�碗+l�uZ�Y�	,l�-"��� �U9�+�`�R��!����Z��pЋv�&^{�����җ�
�)D �.ha����ߴ:�7���O�A����� �;(��f9~#O�
*�dGw�)�q���R�&�aɔ�I�eT��>�5N������/,�a�Җ4��ߩEv�c?��.h�����9�=P������ei���� 꾟�MI�Y�����inM�vM8#h ��ꔙ�(
N��0��D�}4_56Ɏ�zH�SY�9mcp�ޙ��aP?��@�t�UcA"v�t(��_ى���=7�F�x�%G�cx�r �!G��{��/�9��ն��)�&�%�J�(������K���ڢ�{����N0��j��r�,2~���a4N��{�6QY��°{ʧ�C"�����q��p� �Ϣ��S�I��������w�U�^���'jρ���6�	�X��{� 
��z�@���e�<�T��DkU���t��s��~ϔыnP�E (p醂g/xV:�A��*N�:�Y�~����M��*cv����Ϣ�*�m��	߭�O��8镼�f3T%���A����T�,x�F�f'L�͛�B��P2X᳉���
�!i�J�N�4ߚ^A��E���QÎ+�e� ��V�#���0Z��β�4��M��N>K��k��d��B���{�#���a���z��G�M��;~W����v|�p�%N{�Uٸ}�L��{�k��V�&���e&����[��&ğ"�[�{�gS&�f�s��,��?�;�a���E�N�>s����M���X s�����W�?	��,\�������ݏ~� g�S�T׽��-e�`�~�'
�h�>As�:�:�mgl}�Ƴhk��I�ַT�v�A�`ʯS�8�kC�#ܚ�Ѫ���^[�����j*�u@k,f]�	�s��XQ8����&o@.�g ��oq�>���5�d�`�u�o$z�� �(�o`H+Z`�"!t���9nZl�J�g�䐲���֟t��M����FC�1���6��~r�0#�G�X�w4*M/�e�
zx�������1���ԯ
1o�K��'�v������u5h��[e��*b��h�A�>�IW��".js��ο\���Zy��i3� �|>�yG��^̌����5W��<4%k�`\���z�~q��_����%����>nx�m�ha�U�9���sZ��~��"��T]�ح������c�����Ǟo���'X~�0��/2�3��`0���ݩ��@~i�+S�	�K`�ܝP�� � �=�I@�1��V����wa"�H9�g[� ���M�֥uv�VRKY���g��7#�qbH�G_>��c���)�Q	�ժ[���_� T�ȚnJ�uN�e���>�m Ӄ[�W1,W��	\���'��MPs�k�26UL�t[GH�}�o`��0*&�1C1T+3Оt<��]��a��EC�Z��ephշ����b�x�R�JV"���������@�*�*ӂc1��X�w?��ѧ��j�}�$��VV�3��㩁�y�7�
���n����X�^!T#\�|-R���#/0؇�Z2iE��M@J�iT+�BW$��x�_����a/U��H?����r�YM�آ��)� ``S K1Eޜq��ȧ�A��=9i��G���޽c����8���r���I���W��"cA�~��O���In��jP��P�"�l񱺎â� �;[�}!�~��}u.�x��&�5:�Sp<�Yj�̚��D���s��!����v��� 9E�$yǦ:��e�e�1,�좰\���;���m�LvDXkd��o����g\C��S8����d����p���*D�k��r@_aq��&wՉY����o"Ů󻯑W�4��RX��]EԔ�n�Y\��C!q�E�Mj�t�u����e���Q�e�r{�e���L�X㠅(�s(���+
�6�8�-?^��q��A��(φ)���ܟkQet���0��K����E��"�L�E��[> �9�+l9�X�+���q1�D�,R=�I'~���ҕR�LO���|�gC|�O�V����YҶn�G��U[�::T��# ,Ȟ�U����=l�H�<j�S[�V`��x���@q�gB��_��6�ԦSh�<w?B�O�^�־�?\���6�L��=����E��R1}lB�`4"��rԉ�N�D�#��0�_b.��-t~��W_e.EA��_UgA(�qz��Y�;eB������y�JMvE�
��E���ifگA�B�L��ס]��	Ozb���̥!�[Yk}F���J��o�V��b��~ ��o���u�dڛ�`����(f`ݒ�+�1�J����q$3�g�ʬ�K�����_�7�]��OG}��gv&̿KV4��W��2��%����xZ3���T(�O�%X�t��e��Q�x�hǒ1Ms~��n8"v�q����4X������-J�kT^�?�f�ݷ�G���Q׻6�C"ʵ@���S!Q��׭���
=��b+�%n[���M��YiT�)wܛC-����~��v�����D(��8%A�����6bL�&�[f�׷��N�%�����<�d7^s��GD' �ݏ�q�I�~%�O��[͒tk��3������RC�
a��".q�v�|��eR�-��Љ՝e����Պ�����X�;{�O�>@X�p����c�Xja@�s�Zy�N)̨�{Q� �%�,�Cz&��n7��~�W�L�~+/˿	rnjN#FRJ�=b� k��`�լ(�I�K��-��a�+Ĕ��v>�k�=��>P|vV��)u~�C�z�d��؊��nF��t��7q�g�Pvԙ&�:n�@~D#��&_��^�8��!�I؇��趣��b1�����>#}K��=dT��)n�_?��o�~�uv��Ȋ|,@���,Qi�g���}EO��J�wC�ºq�T�3~ŵ�;T�����&he�:x�qӭz���:�]��J?˂�9�]UU$Ð� �ʩ����h�z��_E��{!;���o2k��8p��)�>�O1yeb5�U��ٌ�Dw��/"�����Fw���.�6e_'o|���G;׵��n��M:�ԡ2ɭ�~(vh�o҆���([?��69�8���mU ���տF,	�f�R�h<��Ht�h�,u��6��Of��(�H��I�Ü;X�6�p.����G��oHŒbp~�����G��3�+]r{�|��~���W͏;��R%�Gj��@�2�6������@���t�Y��y?����իOSƧ�=)~��Agj�[�L�+��(D�ʊ��a1H���0�Pv���̛+���������m��k�������Hޓ�˛��Ł�&y�3]��{�nh!���LN��[Ú��I�����[(�&�/o9)vi���h�He�'C�B��Iű���g���    $���5]�G-�'�k#���J=��k�	�#2+B�������iT`�Χ�C��Z[/�i�GB�<#R�0��N��F�(���-� v�����o�Q��������Qi�'<����0�o򽈥�,�kH���>�K�rv
��e>P�yG?~:d{��wX�t����এ��K�3r��qݾ~2|X�@����Yʘ�!�cJkJ6�D;���i���`��1m��lxq��<2x=(�6�YB!���pFZ(Z1 XV۳��W�1SN
���!~�0�O��y�
A��~W�ț�ʘ�,e�`U���_����%|�{ln��W�A�����x�XBK�</]�%��MG�]pҳB-�7<��I�L^\	���=rydsr�%��mm4�1a`�	F?�(��Ր)��U����|#%DQ2�ĈI�'_N���Ⓜ�z�׼5�ܛ�^��-��O�(m���Η���G ��M�u�����T���O������i��V&-����%W5ޕ�~jv�՞��?f �k�V�
�=E|3{ޮayo�[w��ɷ���ʟ�u��E,���w��z�h�z�f�J�2��Ȫ�����[k�A�d�82Q�h�B"���jBf�)6;�K`xnwA��K�J�9�~gO�oz���T�~{د.3 y���#x+�U���|�w�Bna�t,%d烫OG�픺�Rb,�s���$�88R�����;�Η �b����M��'�&%�Tه:����d
"���b���ry��xM��}X,ioK������jN�Aq� �s;�/�[78�K����ֶY�?���h��)��SKZ��p_�f���S�t�6%�#{m�(-ܱ�:E���VH0�EY���FUة��S�O�s�L����ծ�yC�SdC��MT�*�AaG�)�@󒧕�x)�:2�l��S��<��A ��~r
��q�ɻ��~A\��S��w�/"1`�����#�H�X�֙^��"F���y	�J�P*�fa�-�y��6IBxY��H���X|ѷ��I����bLFʲY#c�S�'ߪꄧn��n��"#�
���� / �0�A�]�>�-
o����D�3�c��`�m��778�U/0ֳ���.J۹��IK��˴�#f�fޅ�_ץ�Q��3OZ�q&ȇz9_�rU���)�J�Su��6H�T����ϸ{j��l�v�jϧx�����H��W&ӳg��%m2Pr��.P�ȩ��Hw$��>6R�œi:���Y�gn�(gw@�(K0)S���o�s|r���s�*��$$�a�4�Mj�>���k:l-K�F>�3�Ϛ��z������e��y�mk�q�l�H_�������BF��ך a�XB�����0N�������%b�p�;�J:٧�t�<��Ӭ �$����&UGI�G�]�*��O�T�r-��('�nLDxx�M`���vj��})r���vA��~F/�Ļ������76��mB��&��&�2�}��F����	Je|_lA����y=�<�:���c�a�}P����HZ��g�V+����VY+���fڂI��8��c�ctO�>���tg/D��_'���b�_���4a4�S�V��ɏl�g����kntN����4�X.�ԼX(�f<���|v����h����m�nq���h_)�<�܌E�g�5�Y��݉�`��cV* ў��dLF����73�XP�_���l��p��6�5��j��uQ ���m�`9��}�ѸTXfΰ�5�g��C�'|���5�`?��>"($}��3ȴl��m���=~��O�SP�w\u����Ԑ9��f0`P�(�������l�X�Q�y��{�}$��Fo�2"o�} ���f�6���]F2�#�|�c7 �X�w�U�������ͷ�����?�{z5A��fF�N0��ՇS_��X|B��P
�td~ƌ 8��^ؔ�|��	��ʟG�A&��XK_�Zn��I��� �?j�-"�T.<'�ã��1���Ӷ����q�_�X#F�u���V|x��?�O��A�%}\6(��	@R.��r�҆q�˕t�x���\��<��ڛ�/����Nn9p��A�QH@�e�_b>uЄX`�Y�> 3 Q��LP�@��ж��>�DC�B1�y����Р;v���"��cv�:���KX�cI��v���?b"��`̏-�1>h,u��k^�>�Wr�p��W�����'#�ۄ� ���t;e:���?Y^�a�K`�Θ�&��i67��sF���W9�<����gM���!D�`g$>|՜I�@�I�{�^���6)L����e�d�Z&��X���a�\~|���Y�Q'bk=�D~iG�����Il����7'���CAI���H�ӻ�hYOf�]���3������x�ht�[ݺ 3f$jS��m��W��`�XU�_���ؼ�5<P��p��qw�]V�(���"rh!"�J3}���ҍ�P�8�%�}ϑcr�G !v��(o��\>=���Z�����s��ѩá��G6AS�vA9b�$co~�*I�.%�� ���z[c��A�n�'�������+I|�1,[L_<�I�H͘r��;�v��A���m�6L���p*��t��@�*��`���GƮj>	�>R��H��M�ު-�f��6��$/�İ#%qOl���
�`�I.d�(�d4�}E��'�>�����լ�A;8�!�3�2����_���`r�,�������*w��Y��tW�2#��e�1ۺ�����m�"�T��_��ρ�(V8�c؀���wHV&��9�����Zx2���#�T���ռ�[�c�p�H�d�6�S����i;lp��3���)�@L���\�o ��n�͓�xsV�]S�|1͋x���t���[�I\ἕ��Ψ'#�.��s�O�D�~�Wj��!�\�α�0�짚�,�6���'�W�.zt����Fʡ�}_�P*R��Vv�����c|b)4�e7��b�X�^�0\��w� ��;;͍w���7�V՟�zc����x9_��H�ؑ�z9�r:���z� A]4LG�g!����m;Ym���F�H*
�Fԇ��dKh�{����x��BĦ5���WX-�,)���ӟr�p�l߃ E�!�A�"�[?��17d��w�mr�J�[�on�<�v649FCs8��m�>z�pn� �����<93���H��P���$�~�nJ`-?L��Bq%��ä����m���ª�����]�/H���0��j�S��c�P�־�wP#�D	�n@���a�:�"ⲑ0���� ���B�Y�צ�pF����Sl@�@h�С�����a<�<1EoaP�]io�OI�C���D�gX����!X��d4;x�$�3S�d���(�}�Q��Tt�S��
ޕ��U/�%�#e8�vm���c�tJ�5��-��a�-ß<3RHl刱�����	� Bc�DN�Z�5z:@�^|��f
-H�E>AX�y#k;P�1��MJB�]uHO�f�o3���X�ɴ1M҆R�!I	�Q��H���[R��`��Y�l��Q�N".m0{&��^�*�'۸���5�����06[>�M|%�73E���iK�����x��qꜰ�|��E���Rt|��<�Eж� y������w�8�i��m�u�$�6��7���LQ�
.�AIʭ�"�;I��jB`�W�R��'�O�5�?�Km�x?Q���]C��с`���y�c-0�(��}�:��c��]D�u,�`"oa��84�d����aג��㐃��%	\m^]��4�V
%��ňb���%�;�Nޛ��c�a��_�$��|����y<���ZV8K���-�\!n������O@)����ڌ���i����YW����W�x��M��o�vA�BT��4�`����a(2����̈}�)ƚ4�/3:pD���q��U�I�J�TI�#�XV|�>�,7i	�/>���B'7�e �)�)��#v��c�Xq��}2����U�}N½����G8�8��g�\����    3��$�2]�=�����u%�j2���?��!f}<CP�k;��J��4ϗ �y{�C�I��L����g=�)ќi|�ѷʢJ�D��ޔ���tƈ��/N�U׽�K?�l�q�������&f�S6�i�������+����s�	�rvt�R�I2�����a�J�������5ز"���fI�/�����Z��0B���H�T~˄\�j}c�B�J�(t7(� v�p��;��(xl� ;�\\�4>4;T�_���B�4�[Fd�;� �\�h�4�������-�U,����ZS(ݹ�|BLv-p��/��l|�ѭSA��v��|n>��'�����qg���@��,�S�\��wč��]� \K^Cq*�ߩ��a����]�۫ʮ��������G7S�����ڙ~��&D@�ѽ$V��aܛ+�t����\�N�=���Z�j���3Zv֕�C����Ɨ�N�:�,�>;Fo��h5N���<{�b����3q�-�s�O� &G�L�7,W���4-o�W�ږ��Y��$���M}��쭩'�Z˂ ��HD���]�>S��[�1ڌ�G1`��g�;P���D�� �fT6��z(ި.u殟,��3������$RB�?T����O'�liF�=�T> _	l5yfB\�Ɠ)JD�'�T?5i/˩�Ɓr�1)<ypԐ_w�=ߟ��?�Mxsחe�9����r<XdKc�
VWl承k����l����d&�a��`�����O.NY�U����l�n/yE�R	�P��(����6�]���B^��Y�SL�:��?­lH2�r���~��e\�'�L��:�+:Aq�?	f?�����c�I���@ޖ��	I4�	����V���,~�Y��,�&���b�)p��##��v�_���Ll�퉠����rV?�s�m�Hk!�����[��~>9�(�<h#�z�^���'�R&b��&�
?9=OK{��
������ñ��9���Q퐦�*�c�&^6
��LQ����Q�X޸zCh�����P�T������)�ߵV�%`b�)n���Ԩ����������fx�̀a�e$X�r��AF��z���"�S���������n<�q?s��ı�ޠ�->R��i��Ҽ�I�����7� :��������j�0�S?NA��� �ߨE��5�l0���8w3��ϪX���\�w;=�T�1��at���V?bg#���	BMo$M��8��Eͮ��Z��T� �:4~�q�?ek�s.;�$a��fX�ZJo]5���͝�ʙ��u1��lq85��/��.b-��aI��M�@��6�d$��j��m��Z�Z����Q��C� ���|�_�
iT�=�Rz��:��W>�� �{�����v$�qv�m�v������ĕ��Z��T'Rp���xs/�(��4 ���l�Kz�BnZ� �5]��F>o�� 7([�GE	�+A�c�8µ����?F�/>`:X�=�<k�Y'q�����Glax]h��i��㚇N���vD	�b��(	������}�n4��ǲ/г�@��h���*<��m!ly��T������|�T��v�p�m���Ԝm�o^ֺD����{�;,����|(����[x�������}��*�OWn�6S"��!��n�B7T<٪�������*����/�mV�%�5�������|:��3���x);2���X1�K���<|m#->_���{>�_���pO��������O�wuG���E��i>H����@���!*�,�yx�����7����K�@�+bf��K�z~I��h���c�3�_FQ7Jl�Z��}������w�#D�H�ê���ܢ��}"�	C�C&_؃_�C��	�G���ڝ��KGN'4:򿧽1�e�k�����xG��n���o�J�K�(LS�<�����y��c�3��$-���E�)����#�ѓ�nB��'S�K�����I��(��0�S9��"��&�sۭp둆��}��&�KG ��;9s�s>���«���c`S�Y��a��ro� �D�A��9Ni�� 幔���9�Ϋ�
ơ��|�|�j�+��ݶ~e�.�١�(�<Y��+K���8_ *��2�w��t���#�VWD�]Y�T��LL����v���͑'-_ �vu��\ŨX�z(=���*HXg�R:Ʋ��$����ho����?�p|�;Ɏ.�q�⪑9��OdR����z���轆�Y�uM�(�_g�q+�q���J.k�ʶ��n���cF�,d�)�N{b]/�ӏ���6g�|�OF@�+Wض}lddv������FX�N�+��P�x�X*�m�r(GjA{M&�;����0�Y����c���YTS2�.�5��S|9��Hk/�q��Z��JS���L'~ñ2�?d�2��ģ��Ԙ��K� �}׍�h��x����
��i}1�8`�(IŇ�$(�|�W�Zle¯����\�-�7Y�[�9�C�"��Q��8�W�����+b;�p���y�:��|�����0eO���Yo:��Yj��2��Tl����6hc�8��5��N:��?(��K=���2�3��������xܚ4�+<��s�D�޾��jE�[�l�����z�_Z��9��ձHz\���!���=�)���Д��tE�l|<�R�=%�����P�-'��ݽu_���V���hj��\���O��Z�������x�j9�Pa�)"c.���.��0�
��k��y���)�q�*��H,��Ta�Kt������a6����?��[�,�RK�Ʋ�^H� |�^%	ox�� LE�3�o�sRG�$�̸��ɫ�Y�����했8��zNƣ+P�Ĝf_e7������1���_��]�J6����8/pp*���ڣһ�����n񖬒��͌����9ƽ�m6]wQ�m��������)iM*���������MK����~﷎��
���u�.h+�)���1t�x5�K��F6Yr[��ךh�)��*n�������Y0gQ��j7Ķ~�8��t���Cj�K߻L(�����?7v<I���/���>f^q�
c4T����w	Sc~��oi�`C26.� �6�I!���`�_�����W�/ޡ�o�_|�k�"*o����G��Ҋ8%P��i��b"���9�&�nF���ìsz��l����e�N���E�*i�5|�lR�u�	o�RA�y�Hu����u��BI'����U�"���P���V��ΒEn���ȃq]���d���V�8`�^>�9e8%��Vk��69"@��f\`�dL��O�PI�뙅�A�$7^�Ir�l��Z�ʅ�J��pzP�pe\-$4.�lw��Mcm��yx2���{�Ϧc��_P�8�o�*�E��?�����w��m���w��v���3\��A����o��a:�^$ ^/X��i&������D��H����Rs�*��;���&��;�g���o�
Y�m�eq��$����6�v�V��jV h�*��x�/��:��!��CNf8�C~g��K�|�l;�>�I�8����z���>j e��]�����\��@fcG�<F��CT�3��t>�1N�-�H���y�����8[)b���н�P.���#*�b�����kJf���jj�����P�[�c�;�|iƠ�ixW���3������hod\ JU+]��!T�`��}��(s~�4�'�~� �"ɇ���g\�T�ה�>QJ*�X���;,�x�O���/s���͠g��b\������@a�m�
`�+Э�������s�<�h�*�.N�XbDM��V�_��.F��`}_l�#6���]x��8Q�)�e����!�mbdf)����%;�V�˯�g���'i5p�FWɍ�4����8 �'3hL����Wi��H���H?:=�\��_xE��s��Gq���#�XI    Dv��$Q~
��C.�G�Zh
 �V,"|.����8�u��+�5@���ԧ(=ib�c����eZ���M򼊣A7e1���{TqU�6�H"Ս������+U�%��G-6Tv�%BE����ڲ�A���#l�0�c�ʮ��g����i��
����3^H
X���X%�HW��9���&PD�������S[������M�k;v�D������I��%q~����`�_�����/�,��z�ϭ����ig�jBi��ߡFK2h���GZe� �9�J+E���[�,մ��a����_[�R ��mЬ�ѡ.�HC���� |b����^����ʤs�s��tW�
�#%;n��+3 #`�2�eЁ�������/��W�q��_��5�E�w��#���s01Vs���e�X��^� 7�-/�c�LU�fA/���=1f��~.���=���<��p�j�-���-��op�m��c�@���͙[���5�i(ۘk͏#C�^G���3�&&��4l�|实��W������8.cZ��ޙ�Fȼ�}}�_�a�w4c3C��a��O|�(���"�����l��PT=�9v��H�s�B
�E��h�А�m��i�2���m�F�,��oC#���N��8;~L�	�9*,R�#�r�tn4�v��#yJ*�֖-ؽcE���)8�I�g�\��r�r#���:���|(�&��״����*��,������i�+�Sy&���ڡ�}Ǹ���޿��$���R�#h�*z>A?I��7qX�j���= �xE�� {��M�����iݬ~�I��n� CÛ�l2# �u�`p���^D_<ہ$f�b.=���?4��3f��ރQ�4�'��"��g���,dO����	`��{.B����32��@=�ƞ���n&�����-��i&�״�P�����뀚�R�
,���4�^A]����d���!=5�.g�k��߈�"B�, ������8��������@w�~�p'`P�������gB�,��ozVH�濷B(ے����%5�lq���
� *����z=�Xu���"��[����
�����3����/I$MjQ�� VV���h�	�[��C���N�ԍ��+7#$(QN�y�>J�HN
^E���������2�c�6�<�J��=�z��tF�i�5Y�~A8a���O�{� v��%ۋ<��65ħّ�3+r$�|t'�r��^�b��Jq'�q�]������{���:6�-97���磿Ad&@���.xu'�htiY�]w���Ӕef a8�KB2#<�,�Z�}mtY��4w��m�7��qnRm뺆M����A�=�8�c(�ڹ�I�?F��o?������m�����2mۺ��d�\  �"Hr�I)u�x7D�t�8y#�62@��/E�ٮ�t���s��$;�L�KJ�bE]�ƯrnĢ{f}���iNG֨�A��9!y��Mą��0A �͐H�A=i���O>��� �!��ax���#C�"=�(�4��  V�������B9��l���fQ��Ę���k;s*�9~v���ނ�z�ٺj�
�?���x�3��5�oq��:��� �:�s(�!R���a���c+�sl��݀O[La8��o�QQpvlD
�{Ua���B:t�o(Q���v�nO3���%]f�{)zsUD��Cl��'�P��+M���-"|ϐ4��@���Y�(��i�����ܜR��v|�X'��]�BZ#�&��C?�ե�׈�w˃Z-<��q������8	VC�����+-ZU��Zl5��{*�����x��ޔVh��zw��yKeD�}pD����<���fI��:՟񏣦�}����g�G�e}�e�D���F�Q֯T"d6!�H��s���-�ǔ��	}�W�/Q��$5u���l��b���s��	�C%3/����7g!�}�,e_>�A}f�$�Nu*)͠�>u3���~�L@�jç�U%a���@�an���v�[�t�*����{���B��ײ�PQ��;6Vtq1f/�[B=Xmӂ�3���c�J�x�q����E��V�֓Y�����T� JI�^n ̑�kK��Ϩ��m8hd<�jR|�"p�B.�1�9���"Ҥ}T���b�rc�3��oG�0�r0_:%�}O��"�ګ�_uggy�|9�>�0ٴ�떫�gp6�d����,?��JaY��
�G��R��T߅���J����S���!پ̧$v]1��R*6�N\�.��9]��?��r���k���;ޤ
S��~���L�֔�h`����b����܍k,� }?� 7���h�GI���Cֳ����ҵh��k/N�Eu����E{)3,�P7��=U����}׀�t	S;��-Nφ�2ڬjW�b愳\m[�a��WW�Yx�۶E2\�)	�����I�}�o�>*Mn���Uí����s�����b�C�)�H�"ö�5�K�Kb����yQ���e���~<�ZN�`K*���&���<��Q���
�:��0�Bnf�k��� ,��W��=̪�`����%������A!t��F/���[K�i(��sf��x��]�뺵!�|F�cah�*'P+���K���ֵ���叏�{U"��y��3e����|Em�U՗9�R���iA�/�S��q*� ��^eM�L�SU+"�ʂ�@]0.��b�MZ��w_�2��n�:+��mIȲ�~4� ��a�*�O$4cS�U��z��G��#��0�B�ؤ�mS�̵ۤ���&i�]sa�Oc2�)�����Uf�.�����B��-&�4�>'b0�A�B�0����,0,	���8��k�{N0}�.(?ʡ�=;��NQe��<iً�^�� 8���!�D��G�S|bI[N�|�B4`������P�\�ܺ-a��{r���O�q��o���o�e_������}�~_BJ$��i,4�����J��MU��^�of�&�V����Y�t�$��Xۜ]��ݵ����@���83��o��48^_���q�_RP���%���1�U�S�yO���O2@Dh���m[:+!y�\6�^G��ĪM� J��ɍq����>�G$k�ġZ�*[��E.x�yc�N{etq�`KS�j�Ͼ�s鑜���1�	�� �{���䮾���`��9��R�V�bQ*���K�ռ4%y�[�ڜ�WJF�䯥ٟ�?�~���4)fv�ٜ�������=fPY71K2w5w��y�T��_nzm>o⚫�S�j��_L�֭j���ܷf�9l�eXi�:��q6�:��@J�<z�rE���2����#z+幰���̾���u=�W<�b��z��2�	�I�ԕ�#�ޮ8x3����t\�Z��F|(b�q�y�M��w�;$�ME���F�^/��O-��5����g���bf��D$}P�r���ƞ�2��ľË}]K2|'���D�����I3��}|G��-J��;����eq���}�r�.��� �����3��ɺ0��"�}9M>���5��@�ϕܝ
�N�pM?�� ��g�����l@b�Ռ}c/p��ٶ%x��ހ	#��(mY�����r=!l�x�y��ퟳm� ��ЅTV���L��Z+����,���G��\ES����Ll��x4�tYvKm�@���Mlk%�"oP���U�И4�J��L���&�+�7\ܷ�Z����[0'v�Yo^��կ[���}/�J�G���j��P~��_�+wo�r����PJ`%��Ey٤ިI���� ��k��� �R9�4�/u�^�=�ڋ���]R�/D��b�d��4��H^QTtvro"��~���=��,��)�{œ��k���Ք�/�k�Zq��H'��ԅ��Ɍ5��3��g���k�{�l��Yp2�E���u�we%���Iѳjo�^�l�90�y	5fU3]c!0�6�X��w*C�Hq����U)��bGGP1�{h�Ŗ%��[M��
����~jC�Z@7�5L�    lњ�.DG����Ǯ�?��P}��T7z�u�TD~܆���?�έHAt	��k�:�4�� I!�e-
\s��u�A�G�-����F�}KK�z�\��3ԛ��޳>��Ԅ`�|;�'�}���/sK�߈�7Շ�/S��g�@M�u(�2��W�)�j��W�*ih�|��:�1�@�z7A��:p���'/����y����'�cȐ��F&�c�`��������Bԫn��M�'wd?m��Ь�	#��^��5!�U��i�ЭC�����̮�Ij8��,o��t̃�Vڷ9hl�^i������.��&�UiNQ/>~[x@�e �E�lwj坨�X$�Jվ<;y�ZDε{��*,�����F(l�6N�W��{T�W�9�u��95#0��K:V�*?k�E	+Pa�Dr��\\��$����[�����W�dJG�~PSR��ɸ�����}5%=�����������H_�!_+�Ǉ����ԉ9�O%�������_k!	�DV��R��䗛�K��U�P,<�K2���j���Uu�"g�`��5��&��M������y�|b���d�U�=���j��������^�;g��l�?�:�u�l�s���[�0�p�3ޱ<oq1c�z��f1�]�wJu�.���U�K�j�6�����.�e�ᤐ��WȪlB���;����_����j1עPTY~Dqz� �:�4�C0�U��ۗYG�񛾵�r��d�����=��]��0Z��f�~��Ջ㑝�Kz�k�L��-��A����F�V#1f c��f��0�M� ��Tf����g����ψ�vhZRq�NN[����O�'h?Q�0��YkG��t�lߒ�{�#Y�O����JA)X�|�A�+k�RL8�0hE�grm���.{NY��м�m�lg�e��e����¤�M��P��Yu���95�����lw��N�F�%ӵsV��yO����=-ϻ��D�o��6H��H� ��<�Hۖ�$��V��#~�՛��3�oW+G"���-������fL���ME#,cN��#�>ra�s��KԖww�EQ�/<��@������ێ0��
��2Ouna���e���,���`�Q���"Ř�mc��4Og�B>l��聯�Zݤ F����o~/1�w�y����Sns�����75�'ݛ���O%֓��(���hͷL�I9��X;��Z�`:j�}Ƒ;l #�v�����Mß���_�s1�����4~*���[ ��t�)>#�H���~��Vp���_S�rM����\L��I�f�u��f�,�߮vR�_�$�;�ˡ���b�>6�P���4O�� u�J<�=�%��7�a����1B��y̯T	��}��Y�W��e6�,����Ʒ��_����K�o5:&��"f��Q���9�ıK�j�b��o����T�[K�(���'�\����Y�g�����I��D�
�k�fr\ъDS%�U+�,��PUW4.%�B{����߰~Yሼ-6~���V���h�v*B_�?G��2y�,�E_��-7�0�Co�̂ᔂj��x�)@��į_!-�H�� L�Ґ#m^:��f���,�FUT�,7�{�v�Σ�@�_�Qɂ�o�B9�"�����%]d���������$%)��܋?�D��1���&9K�Y��:���0A���6mU)B�űf�\,���ݦ�i<�}�ƛА^Qɚ[8L%|�����y"�G���XF��~y�
C������@���W\H�)&M��)����dZiC)����|���q�.q�x��@^�b1� Gfع٣(���u��{Y��.���yMj�빊cmM/3�����'q,��z^���?�䝃+rW($��\�	Y�]Hx��ܚ�̅oH�|�oh6���90�G�I��v�&�]��gzE�0�c	%EȞ�E�g\��s@rGŨH>���9��:g/�'�z�?����o��_��!�؜�ְ�"�@�uӶW����O�<7T���d����B��eRlFT� ��!�Vr���XAyc��QIC�c^T8ޮ�}��f��LVp��μ>zB���h7} }���Gso�pkrS�0�/�: \�v��qZ��Fh���:yp����
����]x=��+�؃�^r�-�ݜ��Э�,�B,�ܣ�g�w0�Nvz<�`���u4H�7�V׀�IZJ!�o1�B���a�N+H���2M�X��Uw�˹X@=t��\W#4�<���KQ�!Ls�x�~��"����V?7@o�n��>�����z�	|<���6#]�Aqώ�O?���j'GX�$r����$^3.cD�6��S���/���4�	���#o�}���rDوWGX�R�1��������3,r�x�/|��`���y�9���i��O�-���/2�fD��S<.��sy4Z�x�{�F�I=c��bO��Y39Y�%`��ƕ?�f�V�j̙nmw�6|7��o|����˄��i�NZ��S~�<Y^�lE�7&����B��SBYclh�/ ��E��pZa�%!����,d�����kո]#^���E�c��»�B{�L'�X�*V]S0*�N��>�����S��r3��>����}����HE: �Y�5��En���~;i��9���S��=�	Xt�:y�(���^���p]GB��}��/�e����v �^?�o�
bQy�Nv����.��hT�l�T�H���F��gX���xG���r�*�]/@�8����]��Va���n�:L7��z|�-W�<�P�S�kA�u��>��=�D(�L[<�Gr.����D����ձ��;8d[�ֺ�f�j�b7v#Gٲ���ds����O�����$�!*2&�l��ؿO����9@ÏT8!��d��6�t��񚋏���j��@�ֳ��aha~vg��Ec���l��x-&���:��N�W��r��R�x�>��`��v�̨�X-۽њ�D`��zC�����G���b���r�`��x��F��̌������vj�C��6��tI�����^#���)�ux�>�4��6�c�']���֩��t��ѐ.������z{`�(��~˴笝�6yAZV3�Ǩ�8$�=�����[����b�%�Qr�@��E��5-R8��q@�Ʉ�D06#�C����=#����]T	I��W=�n�}��?��kq�,�}ۇ�,k���&�W�]"����	t��X�BZ.�:�.�Rբ��Ar1�j��(�Z4�3q����ĒO� ���V�/`�7Z�=�����e��C`8L|���g�A��t��]�cw-����B�������fp��X5��e !)�%���Dנ��������/�*3�w4�.=���E 9�"���t���*�Gj�<�İ�@���>���qqD��$�'��[J�t�O`���3p�WL@���ɗ2nT#uP��u9q3J�?Kd��^Ow�W\11}�;=�:�}���Q�x���+F��2E�P���L��	L���57�[�f���j�X k{���׬ur�y��_PE��W�2�y��t�n�PZ �0�o������ǳ��G��*~����/����3 �ן�������Fح	����\:���ZZ'�d]
�4tׁtt|'�!@%8��P�&�p� � ���#����Na,�7 W���x��0E;Z�	J��?q	���)�����rnK�tA��@m�\�P�ڒ��q��0�4$W�w8�w8����h�Y_-�m@���~8��k��	I
F }�=�7���w��唯0�h��k)H4��xU<}$Р���m��/L����hD�b@���X���M���|�UvxM�>H�
M3R8^r�Y{Y�az���Ʊ���_'-S��|����
��YS�H'�XҚ��d1�� K�I���c�j��)��M��I�tB��;�AˬW#�P�=��PPg�*�a�oo8Pq��
�<9�Ι �  O
jr�����Jݺ��iN��� ����0��
���mՒ���L��UnO�CFQ��I�.��+�^�lD�� 87^\���a���'Z{�
� �yN�<��$�\&��#GuP)��p����$CR�2F��|���T���ip�$AB\^3Tl㱂%` 	p}�x�y�Y��H����P��$q;zr�s}E�짂^�Jv�6H�-x��Nq��ci�|q����ഔ��x��B��F�j�?H:o�˹s�-��>	�_z#��t$��Q���0�%�pP�%몰����7��o���N�5��T.���x�@
�����F�y�/r�r�	��g�3O����1�5����L3�i960���o�O�/�Ec[��C8���P. �W"\�.�O�;4Ԫ��1$�jy)���R�D��)F?��DhßX��R^A��qS,E�޿W�]�N�'B�M��h�w�y'��`�ƃ:Ʃ9���ec��5��,��5pl=�F,�z-��2�#��(�V ތn�yh�؃ �����H���Tj��@(�|X�����G�����\�慾q��/ f� �at��uGv���sre��2Y9ƍY�,���Og�>�s���u�T?CHɾz��/�ɞ	�E�kM/���&�嫾�}$�*�<�"�˵�o���qy�L�[΋�SbO���h=�M�d{�yݗ��eg��;���T7��Mk�nї��$������wo1h�TJȣ��<��������|c�ۀE��jy��kRj�W���h�ۓ���*���#����Ѱ�]�3%�w�ص���N�tzQ}?���S���C�/� �aW��c��"��i�p�gAeP���$.��āӞ�f˗��b"@�N�	��Op���g�QH] ��K�3�/����Y����z���������a����fv����>~�� щ������f�Dq�@�������vh5�H�|��_�8��6� �'�Ȃ.݌g��&\�f>�l<So� �@ӫ�DD�[�MF�uzL���+�`^� 5�y<�
~<
l5�����T-��;���������f���=����z�?乻��{����B�1��p���qw��n�L2�tf؃��B�,�R�_;�U���3��L�!o$�s��YbW̲P��:�_m�hn��ZŎ$*����S���S��w>�����3B+����bã2,�*����4���L25���P��<B���E�_z�)�1t�ju�?�P�9�B�����ky���|��?CY�\� a�AI�p�PP��PK� ��D�`OU��]��)|�qa{kL\�!߮2:W� v���҅����x����3g�a��>�Ev�0�38e7�]������c����m�5 ��R�f��h�b�ӫ�Ɉ�y?�!a���dp�y%��;DQ��:�j9�ޢ}ͅCt�}�Q���@��S\�r�yk{���k���Ӳ�>�?��H���|�������xy,��$���P\�v����Z��T�.}L��o'H������y�+=��p�E���gH^H"lhRo��q���u .�ɛ�f�q�g�{�>���4$|&���ىD��=���	�6l�?��}3
^[UB�g$�9_������\I'9]��gW;��4�L��t����RJh���*�@�a�TT߸�H�v��kC䖰kl?}�ӂ�^I/���K���_�	>J����q����,R�a����B�����u���eE�7�P�+�����%�O�y�7ZW߼���x(�Je]궴�$�xgD|X�ȩ���f�6I����
�"UC.z�r��~�V����O���}�En�,]�;���c(��ɇK����^��}SO_�,���*~���
L���ݏ�pߏ�2�l��͞�#���RϺ
�nS�8�g��*��2Z�׹�-�$G{TT���[�y��ٽ^����;P�!�şk�}�w���I��9�m>�\E�pq)V��-�\�c��għev/�U%�j��8�3����C}�r�c�V�X�z`X��uE��<'-���S����#�d��cbm�
�vL�N;��Qd�-��΀!(D�	
z��x�II�d�_�֘л�*6���R��kN��*�5��}
8{��ZbJ�Ru�9q:�������T`	����c^��E�ߺ�����:@+"���S���#|\��܀azyS��K�`WF� �g�1֕�����s��z#m�����R+�����ԓT5�Gפ�W±���X;�;s)s���'J����E��S�w��m�,��aV|��Av��a/^�C*o�'����(5���|]��"��7�n�>�(�	V�L���*�Ws�21��2��Yվ~�u)����9*���_L�x�-x�Sm��51/-��@^q��Ċ�4�fΧ���v\1o:��D��Z��ʰ������EQ����!҄$H�Ή0I��	4�'�	��2�p�ߌj���0�B�!̿�_�/����a��0�B�!̿�_�/����a��0�B�!̿�_�/����a��0�B�!̿�_�/����a��0�B�!̿�_�/����a��0�B�!̿sƿsƿ�_�/����a��0�B�!̿�_�/����a��0�?��K[��-�Җi˿��_����i�t�$��� A��3�:��H4Eӌ��,J��ɖ�����0~<������0~<������0~<������0~<������0~<������0~<������0~<������0~<������0~<������0~<������0~<������0~<������0~<������0~<������0~<������0~<������0�/�0���׿��_ 7Xhp      �   �   x��1�  �9�ŕǘ�t16n"E�j�U�n:�.X� �)P��J�fs�V3������v-�DB�D:c�%;)��n�ˎd"Û�	D5`�l���G�����uǎm�j;����������#������ԕ����&�2F      �   }   x���1
1��_d�l�O��ld��������f�a�-$�
����;A�I��)r-�6؊�^h�v?� 5c�>"���x�q̵�v�Y<��M��F!��n�
���1]1�����ɹ��Rz�85�      �   \   x�Eʱ�@ �:L���2��6�6�����e~����݉=LQJ?̊$�J��u��r���0X�;2jBiT�1ɭ��X���� 5 �      �   �   x���=n�0���>F���$�Ǟ�H:��	<�O=}�;d��5���	�K���(L��袙�&êzG�*�!K�6b��I�DM+K���P�G͐�S�M���~�m��c}n���n����x��阃�F}G�#����s	��Lz^�T$1�#X�d�L��������<���DOp      �   �   x����n�0Eg�+��4D���h�6-2tʢW����WnҢc����c��@��@&��v6@$��3Z��t�z�ɏ��M�Z�<C���������?f������2]�G����ĝC�-kҴ�&ĨC J]U���u)�Ш�����:��V��@}�`���(p�hz���)����c�e%�u'�U>MK��<n���z�y,�TkY��	���s��ㄲ(5�����m��y�e�      �   �   x����q1��\�"�@.r����U�1U=�N6�6�8���"�0�jݙ�Qq��`|��;��%wc�	�ON5�E�
Aj?�D�}�������� B<�����^��������yG(�'�X��]���H��6���R��D���C��$t����5`j	%��2Q������y�?�VWK      �   &  x���1NE1뼻�؎����N�!�?����7),e5���O� ^� 7gg�uTكg-�p���a�LvY�6�Ю��8�p�}�0F a��zy�ϯ�:^�o���n���}�
���I��3a�`QWGPt�d]�����,���ZQg��i���HW��������3�Z��
]�?�ρ�����\�VJ�hz �W��ܹ�U}{�$гg��Mf�:gyLV��7���W���຤SkNR2��8������v���P�_ ��8&儞������j      �   �  x��Tˎ�6<�_�`�d��c��&H$�\Z$��"�|��)J��@$Q�]���en&mzu��N]����Q�a�{��y74���������ڪ��:5^�Μu��8�~�%gr�K�%8����[o���i�+	O��-�30�
/G�=��&������h���S�m�!�l�dP��o���K^���9��e��zʠ��[���k1��#�9��-����>����ҲWl�Q�''�"�,����u��gQ,�;;W��_��9�o@o�|x6�Z�@�H���ar�d����w�Z$��f2u�3-S1$о20E*�d��vws�ϗ�9��N�O�^]x���U;�s?��E���g�����⋥kS�at$6s4$�$o2�#��`�$�]�:�$A�#�	�� Tit�7�غJ%�P>��=��o0��n�^�{�5���lIK^i���ea���a⪵�?���Xn ���_�~���".,9���|ܭ��se��y�Y�6��V���&H�0ɂ��l��x$j*�,urRb��C9]��9Ђ*5��5�H��d��֏���5��[��bX	�_�d���:��fg����N��6
wV�f��t��O����������<�F�)����6LJ_N�{k�fj��6���϶\�r��՝g��.?�Uy�����ɺ�T�����ć[���O���ǁ��1����HfI7�")Y��&�ЈB�rXS�,W'����qP���������      �   &  x�u��r�@E��wx;b��v&1��e���B�z���7��خ�^t�թ�W9ʕ�a�u��� ���������r�B�AWД
��,��RM�� xC����7{HsK�{d�� �(�"�[���(��x3ar11*���fӑ�	��K#v�#��KC�/f�-z���D�Xڄ`n|�=�6܀VJ2Ļq�S�F�+($�<t���:/�R��n�NA5��ɹy�'����	�OQO���}qW�<b�[�+o�M/��tl������T*�}s�.�C)1�!��u��P��B�g�-�[�g��8w��`r�^��Jv� d9k��r��n���Q��t�%��U��×a�ll�b�S�l���1*|��R�9��y�5�@Q�!�
��J���Y�]�m����J�w�z�L�š�yŉ��W�oJ�m�lN*��6c6]�������[&�_�/{{�K�<F4��` �1[�����k����ceӢi�.=7YV���?�/�o�®�]�͏~˟� i��扗�B;;?���6Y�~=�"�G�����      �      x������ � �      �      x������ � �     