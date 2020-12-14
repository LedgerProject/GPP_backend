PGDMP     
                    x            gpp_db    13.1    13.0 ]    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16394    gpp_db    DATABASE     b   CREATE DATABASE gpp_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'Italian_Italy.1252';
    DROP DATABASE gpp_db;
                postgres    false                        3079    16395 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                   false            �           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                        false    2            �            1259    16406 
   categories    TABLE     �   CREATE TABLE public.categories (
    "idCategory" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identifier character varying(50) NOT NULL,
    type character varying(20) NOT NULL
);
    DROP TABLE public.categories;
       public         heap    postgres    false    2            �            1259    16410    categoriesLanguages    TABLE       CREATE TABLE public."categoriesLanguages" (
    "idCategoryLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCategory" uuid NOT NULL,
    alias character varying(50) NOT NULL,
    category character varying(50) NOT NULL,
    language character(2) NOT NULL
);
 )   DROP TABLE public."categoriesLanguages";
       public         heap    postgres    false    2            �            1259    16414 	   countries    TABLE     �   CREATE TABLE public.countries (
    "idCountry" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identifier character varying(50) NOT NULL,
    completed boolean DEFAULT false
);
    DROP TABLE public.countries;
       public         heap    postgres    false    2            �            1259    16419    countriesLanguages    TABLE       CREATE TABLE public."countriesLanguages" (
    "idCountryLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCountry" uuid NOT NULL,
    alias character varying(50) NOT NULL,
    country character varying(50) NOT NULL,
    language character(2) NOT NULL
);
 (   DROP TABLE public."countriesLanguages";
       public         heap    postgres    false    2            �            1259    16423    countriesTopics    TABLE     �   CREATE TABLE public."countriesTopics" (
    "idCountryTopic" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCountry" uuid NOT NULL,
    identifier character varying(100) NOT NULL
);
 %   DROP TABLE public."countriesTopics";
       public         heap    postgres    false    2            �            1259    16427    countriesTopicsLanguages    TABLE       CREATE TABLE public."countriesTopicsLanguages" (
    "idCountryTopicLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCountryTopic" uuid NOT NULL,
    topic character varying(100) NOT NULL,
    description text NOT NULL,
    language character(2) NOT NULL
);
 .   DROP TABLE public."countriesTopicsLanguages";
       public         heap    postgres    false    2            �            1259    16434 	   documents    TABLE     E  CREATE TABLE public.documents (
    "idDocument" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idUser" uuid NOT NULL,
    title character varying(50) NOT NULL,
    filename character varying(100) NOT NULL,
    "mimeType" character varying(50),
    size integer,
    "widthPixel" integer,
    "heightPixel" integer
);
    DROP TABLE public.documents;
       public         heap    postgres    false    2            �            1259    16438    documentsEncryptedChunks    TABLE     T  CREATE TABLE public."documentsEncryptedChunks" (
    "idDocumentEncryptedChunk" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idDocument" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "chunkIndexId" integer,
    checksum character varying(32),
    header character varying(50),
    iv character varying(50),
    text text
);
 .   DROP TABLE public."documentsEncryptedChunks";
       public         heap    postgres    false    2    2            �            1259    16446    encryptedChunk    TABLE     l  CREATE TABLE public."encryptedChunk" (
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
       public         heap    postgres    false            �            1259    16452    encryptedChunk_id_seq    SEQUENCE     �   ALTER TABLE public."encryptedChunk" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."encryptedChunk_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    209            �            1259    16454    icons    TABLE     �   CREATE TABLE public.icons (
    "idIcon" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(30) NOT NULL,
    image text NOT NULL,
    marker text NOT NULL
);
    DROP TABLE public.icons;
       public         heap    postgres    false    2            �            1259    16461    nationalities    TABLE     �   CREATE TABLE public.nationalities (
    "idNationality" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identifier character varying(50) NOT NULL
);
 !   DROP TABLE public.nationalities;
       public         heap    postgres    false    2            �            1259    16465    nationalitiesLanguages    TABLE       CREATE TABLE public."nationalitiesLanguages" (
    "idNationalityLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idNationality" uuid NOT NULL,
    alias character varying(50) NOT NULL,
    nationality character varying(50) NOT NULL,
    language character(2) NOT NULL
);
 ,   DROP TABLE public."nationalitiesLanguages";
       public         heap    postgres    false    2            �            1259    16469    organizations    TABLE     �   CREATE TABLE public.organizations (
    "idOrganization" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL
);
 !   DROP TABLE public.organizations;
       public         heap    postgres    false    2            �            1259    16473    organizationsUsers    TABLE       CREATE TABLE public."organizationsUsers" (
    "idOrganizationUser" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idOrganization" uuid NOT NULL,
    "idUser" uuid NOT NULL,
    permissions text NOT NULL,
    confirmed boolean DEFAULT false NOT NULL
);
 (   DROP TABLE public."organizationsUsers";
       public         heap    postgres    false    2            �            1259    16481    users    TABLE     S  CREATE TABLE public.users (
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
       public         heap    postgres    false    2            �            1259    16489    organizationsUsersView    VIEW     �  CREATE VIEW public."organizationsUsersView" AS
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
       public          postgres    false    214    214    216    215    215    216    216    215            �            1259    16493 
   structures    TABLE     .  CREATE TABLE public.structures (
    "idStructure" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idOrganization" uuid,
    alias character varying(100) NOT NULL,
    name character varying(100) NOT NULL,
    address character varying(150) NOT NULL,
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
       public         heap    postgres    false    2            �            1259    16500    structuresCategories    TABLE     �   CREATE TABLE public."structuresCategories" (
    "idStructureCategory" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idStructure" uuid NOT NULL,
    "idCategory" uuid NOT NULL
);
 *   DROP TABLE public."structuresCategories";
       public         heap    postgres    false    2            �            1259    16504    structuresCategoriesView    VIEW     ^  CREATE VIEW public."structuresCategoriesView" AS
 SELECT "structuresCategories"."idStructureCategory",
    "structuresCategories"."idStructure",
    "structuresCategories"."idCategory",
    categories.identifier
   FROM (public."structuresCategories"
     JOIN public.categories ON (("structuresCategories"."idCategory" = categories."idCategory")));
 -   DROP VIEW public."structuresCategoriesView";
       public          postgres    false    219    219    219    201    201            �            1259    16508    structuresImages    TABLE     D  CREATE TABLE public."structuresImages" (
    "idStructureImage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idStructure" uuid NOT NULL,
    folder character varying(100) NOT NULL,
    filename character varying(100) NOT NULL,
    "mimeType" character varying(20),
    size integer,
    sorting integer NOT NULL
);
 &   DROP TABLE public."structuresImages";
       public         heap    postgres    false    2            �            1259    16512    structuresLanguages    TABLE     �   CREATE TABLE public."structuresLanguages" (
    "idStructureLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idStructure" uuid NOT NULL,
    description text,
    language character(2) NOT NULL
);
 )   DROP TABLE public."structuresLanguages";
       public         heap    postgres    false    2            �            1259    16519    structuresView    VIEW     �  CREATE VIEW public."structuresView" AS
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
       public          postgres    false    218    214    214    211    211    211    218    218    218    218    218    218    218    218    218    218    218    218            �            1259    16524    usersInvitations    TABLE     
  CREATE TABLE public."usersInvitations" (
    "idUserInvitation" uuid NOT NULL,
    "idUserSender" uuid NOT NULL,
    "idUserRecipient" uuid NOT NULL,
    message text,
    "accessLevel" character varying(100) NOT NULL,
    accepted boolean DEFAULT false NOT NULL
);
 &   DROP TABLE public."usersInvitations";
       public         heap    postgres    false            �            1259    16531    usersTokens    TABLE     �   CREATE TABLE public."usersTokens" (
    "idUserToken" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idUser" uuid NOT NULL,
    token character varying NOT NULL,
    "validUntil" time without time zone NOT NULL
);
 !   DROP TABLE public."usersTokens";
       public         heap    postgres    false    2            m          0    16406 
   categories 
   TABLE DATA           D   COPY public.categories ("idCategory", identifier, type) FROM stdin;
    public          postgres    false    201   n�       n          0    16410    categoriesLanguages 
   TABLE DATA           n   COPY public."categoriesLanguages" ("idCategoryLanguage", "idCategory", alias, category, language) FROM stdin;
    public          postgres    false    202   ��       o          0    16414 	   countries 
   TABLE DATA           G   COPY public.countries ("idCountry", identifier, completed) FROM stdin;
    public          postgres    false    203   ��       p          0    16419    countriesLanguages 
   TABLE DATA           j   COPY public."countriesLanguages" ("idCountryLanguage", "idCountry", alias, country, language) FROM stdin;
    public          postgres    false    204   ō       q          0    16423    countriesTopics 
   TABLE DATA           V   COPY public."countriesTopics" ("idCountryTopic", "idCountry", identifier) FROM stdin;
    public          postgres    false    205   �       r          0    16427    countriesTopicsLanguages 
   TABLE DATA           ~   COPY public."countriesTopicsLanguages" ("idCountryTopicLanguage", "idCountryTopic", topic, description, language) FROM stdin;
    public          postgres    false    206   ��       s          0    16434 	   documents 
   TABLE DATA           {   COPY public.documents ("idDocument", "idUser", title, filename, "mimeType", size, "widthPixel", "heightPixel") FROM stdin;
    public          postgres    false    207   �       t          0    16438    documentsEncryptedChunks 
   TABLE DATA           �   COPY public."documentsEncryptedChunks" ("idDocumentEncryptedChunk", "idDocument", "chunkIndexId", checksum, header, iv, text) FROM stdin;
    public          postgres    false    208   9�       u          0    16446    encryptedChunk 
   TABLE DATA           �   COPY public."encryptedChunk" (id, "idUser", name, "chunkIndexId", checksum, header, iv, text, contenttype, "uploadReferenceId") FROM stdin;
    public          postgres    false    209   V�       w          0    16454    icons 
   TABLE DATA           >   COPY public.icons ("idIcon", name, image, marker) FROM stdin;
    public          postgres    false    211   s�       x          0    16461    nationalities 
   TABLE DATA           D   COPY public.nationalities ("idNationality", identifier) FROM stdin;
    public          postgres    false    212   ��       y          0    16465    nationalitiesLanguages 
   TABLE DATA           z   COPY public."nationalitiesLanguages" ("idNationalityLanguage", "idNationality", alias, nationality, language) FROM stdin;
    public          postgres    false    213   ��       z          0    16469    organizations 
   TABLE DATA           ?   COPY public.organizations ("idOrganization", name) FROM stdin;
    public          postgres    false    214   ʎ       {          0    16473    organizationsUsers 
   TABLE DATA           x   COPY public."organizationsUsers" ("idOrganizationUser", "idOrganization", "idUser", permissions, confirmed) FROM stdin;
    public          postgres    false    215   �       }          0    16493 
   structures 
   TABLE DATA           �   COPY public.structures ("idStructure", "idOrganization", alias, name, address, city, latitude, longitude, email, "phoneNumberPrefix", "phoneNumber", website, "idIcon") FROM stdin;
    public          postgres    false    218   �       ~          0    16500    structuresCategories 
   TABLE DATA           d   COPY public."structuresCategories" ("idStructureCategory", "idStructure", "idCategory") FROM stdin;
    public          postgres    false    219   !�                 0    16508    structuresImages 
   TABLE DATA           |   COPY public."structuresImages" ("idStructureImage", "idStructure", folder, filename, "mimeType", size, sorting) FROM stdin;
    public          postgres    false    221   >�       �          0    16512    structuresLanguages 
   TABLE DATA           l   COPY public."structuresLanguages" ("idStructureLanguage", "idStructure", description, language) FROM stdin;
    public          postgres    false    222   [�       |          0    16481    users 
   TABLE DATA           �   COPY public.users ("idUser", "userType", "firstName", "lastName", email, "emailConfirmed", password, "passwordRecoveryToken", "passwordRecoveryDate", permissions, "idNationality", gender, birthday, "idIcon") FROM stdin;
    public          postgres    false    216   x�       �          0    16524    usersInvitations 
   TABLE DATA           �   COPY public."usersInvitations" ("idUserInvitation", "idUserSender", "idUserRecipient", message, "accessLevel", accepted) FROM stdin;
    public          postgres    false    224   ��       �          0    16531    usersTokens 
   TABLE DATA           U   COPY public."usersTokens" ("idUserToken", "idUser", token, "validUntil") FROM stdin;
    public          postgres    false    225   ��       �           0    0    encryptedChunk_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."encryptedChunk_id_seq"', 4, true);
          public          postgres    false    210            �           2606    16560 ,   categoriesLanguages categoriesLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."categoriesLanguages"
    ADD CONSTRAINT "categoriesLanguages_pkey" PRIMARY KEY ("idCategoryLanguage");
 Z   ALTER TABLE ONLY public."categoriesLanguages" DROP CONSTRAINT "categoriesLanguages_pkey";
       public            postgres    false    202            �           2606    16562    categories categories_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY ("idCategory");
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            postgres    false    201            �           2606    16564 *   countriesLanguages countriesLanguages_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY public."countriesLanguages"
    ADD CONSTRAINT "countriesLanguages_pkey" PRIMARY KEY ("idCountryLanguage");
 X   ALTER TABLE ONLY public."countriesLanguages" DROP CONSTRAINT "countriesLanguages_pkey";
       public            postgres    false    204            �           2606    16566 6   countriesTopicsLanguages countriesTopicsLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."countriesTopicsLanguages"
    ADD CONSTRAINT "countriesTopicsLanguages_pkey" PRIMARY KEY ("idCountryTopicLanguage");
 d   ALTER TABLE ONLY public."countriesTopicsLanguages" DROP CONSTRAINT "countriesTopicsLanguages_pkey";
       public            postgres    false    206            �           2606    16568 $   countriesTopics countriesTopics_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public."countriesTopics"
    ADD CONSTRAINT "countriesTopics_pkey" PRIMARY KEY ("idCountryTopic");
 R   ALTER TABLE ONLY public."countriesTopics" DROP CONSTRAINT "countriesTopics_pkey";
       public            postgres    false    205            �           2606    16570    countries countries_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY ("idCountry");
 B   ALTER TABLE ONLY public.countries DROP CONSTRAINT countries_pkey;
       public            postgres    false    203            �           2606    16572 6   documentsEncryptedChunks documentsEncryptedChunks_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."documentsEncryptedChunks"
    ADD CONSTRAINT "documentsEncryptedChunks_pkey" PRIMARY KEY ("idDocumentEncryptedChunk");
 d   ALTER TABLE ONLY public."documentsEncryptedChunks" DROP CONSTRAINT "documentsEncryptedChunks_pkey";
       public            postgres    false    208            �           2606    16574    documents documents_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY ("idDocument");
 B   ALTER TABLE ONLY public.documents DROP CONSTRAINT documents_pkey;
       public            postgres    false    207            �           2606    16576 "   encryptedChunk encryptedChunk_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."encryptedChunk"
    ADD CONSTRAINT "encryptedChunk_pkey" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public."encryptedChunk" DROP CONSTRAINT "encryptedChunk_pkey";
       public            postgres    false    209            �           2606    16578    icons icons_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.icons
    ADD CONSTRAINT icons_pkey PRIMARY KEY ("idIcon");
 :   ALTER TABLE ONLY public.icons DROP CONSTRAINT icons_pkey;
       public            postgres    false    211            �           2606    16580 2   nationalitiesLanguages nationalitiesLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."nationalitiesLanguages"
    ADD CONSTRAINT "nationalitiesLanguages_pkey" PRIMARY KEY ("idNationalityLanguage");
 `   ALTER TABLE ONLY public."nationalitiesLanguages" DROP CONSTRAINT "nationalitiesLanguages_pkey";
       public            postgres    false    213            �           2606    16582     nationalities nationalities_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.nationalities
    ADD CONSTRAINT nationalities_pkey PRIMARY KEY ("idNationality");
 J   ALTER TABLE ONLY public.nationalities DROP CONSTRAINT nationalities_pkey;
       public            postgres    false    212            �           2606    16584 *   organizationsUsers organizationsUsers_pkey 
   CONSTRAINT     ~   ALTER TABLE ONLY public."organizationsUsers"
    ADD CONSTRAINT "organizationsUsers_pkey" PRIMARY KEY ("idOrganizationUser");
 X   ALTER TABLE ONLY public."organizationsUsers" DROP CONSTRAINT "organizationsUsers_pkey";
       public            postgres    false    215            �           2606    16586     organizations organizations_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY ("idOrganization");
 J   ALTER TABLE ONLY public.organizations DROP CONSTRAINT organizations_pkey;
       public            postgres    false    214            �           2606    16588 .   structuresCategories structuresCategories_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."structuresCategories"
    ADD CONSTRAINT "structuresCategories_pkey" PRIMARY KEY ("idStructureCategory");
 \   ALTER TABLE ONLY public."structuresCategories" DROP CONSTRAINT "structuresCategories_pkey";
       public            postgres    false    219            �           2606    16590 &   structuresImages structuresImages_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public."structuresImages"
    ADD CONSTRAINT "structuresImages_pkey" PRIMARY KEY ("idStructureImage");
 T   ALTER TABLE ONLY public."structuresImages" DROP CONSTRAINT "structuresImages_pkey";
       public            postgres    false    221            �           2606    16592 ,   structuresLanguages structuresLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."structuresLanguages"
    ADD CONSTRAINT "structuresLanguages_pkey" PRIMARY KEY ("idStructureLanguage");
 Z   ALTER TABLE ONLY public."structuresLanguages" DROP CONSTRAINT "structuresLanguages_pkey";
       public            postgres    false    222            �           2606    16594    structures structures_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.structures
    ADD CONSTRAINT structures_pkey PRIMARY KEY ("idStructure");
 D   ALTER TABLE ONLY public.structures DROP CONSTRAINT structures_pkey;
       public            postgres    false    218            �           2606    16596 &   usersInvitations usersInvitations_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public."usersInvitations"
    ADD CONSTRAINT "usersInvitations_pkey" PRIMARY KEY ("idUserInvitation");
 T   ALTER TABLE ONLY public."usersInvitations" DROP CONSTRAINT "usersInvitations_pkey";
       public            postgres    false    224            �           2606    16598    usersTokens usersTokens_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public."usersTokens"
    ADD CONSTRAINT "usersTokens_pkey" PRIMARY KEY ("idUserToken");
 J   ALTER TABLE ONLY public."usersTokens" DROP CONSTRAINT "usersTokens_pkey";
       public            postgres    false    225            �           2606    16600    users users_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY ("idUser");
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    216            �           2606    16601 7   categoriesLanguages categoriesLanguages_idCategory_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."categoriesLanguages"
    ADD CONSTRAINT "categoriesLanguages_idCategory_fkey" FOREIGN KEY ("idCategory") REFERENCES public.categories("idCategory") ON DELETE CASCADE NOT VALID;
 e   ALTER TABLE ONLY public."categoriesLanguages" DROP CONSTRAINT "categoriesLanguages_idCategory_fkey";
       public          postgres    false    2988    201    202            �           2606    16606 4   countriesLanguages countriesLanguages_idCountry_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."countriesLanguages"
    ADD CONSTRAINT "countriesLanguages_idCountry_fkey" FOREIGN KEY ("idCountry") REFERENCES public.countries("idCountry") ON DELETE CASCADE;
 b   ALTER TABLE ONLY public."countriesLanguages" DROP CONSTRAINT "countriesLanguages_idCountry_fkey";
       public          postgres    false    2992    203    204            �           2606    16611 E   countriesTopicsLanguages countriesTopicsLanguages_idCountryTopic_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."countriesTopicsLanguages"
    ADD CONSTRAINT "countriesTopicsLanguages_idCountryTopic_fkey" FOREIGN KEY ("idCountryTopic") REFERENCES public."countriesTopics"("idCountryTopic") ON DELETE CASCADE;
 s   ALTER TABLE ONLY public."countriesTopicsLanguages" DROP CONSTRAINT "countriesTopicsLanguages_idCountryTopic_fkey";
       public          postgres    false    2996    205    206            �           2606    16616 .   countriesTopics countriesTopics_idCountry_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."countriesTopics"
    ADD CONSTRAINT "countriesTopics_idCountry_fkey" FOREIGN KEY ("idCountry") REFERENCES public.countries("idCountry") ON DELETE CASCADE NOT VALID;
 \   ALTER TABLE ONLY public."countriesTopics" DROP CONSTRAINT "countriesTopics_idCountry_fkey";
       public          postgres    false    203    2992    205            �           2606    16621 A   documentsEncryptedChunks documentsEncryptedChunks_idDocument_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."documentsEncryptedChunks"
    ADD CONSTRAINT "documentsEncryptedChunks_idDocument_fkey" FOREIGN KEY ("idDocument") REFERENCES public.documents("idDocument") ON DELETE CASCADE;
 o   ALTER TABLE ONLY public."documentsEncryptedChunks" DROP CONSTRAINT "documentsEncryptedChunks_idDocument_fkey";
       public          postgres    false    207    208    3000            �           2606    16626    documents documents_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.documents
    ADD CONSTRAINT "documents_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 K   ALTER TABLE ONLY public.documents DROP CONSTRAINT "documents_idUser_fkey";
       public          postgres    false    207    216    3016            �           2606    16631 @   nationalitiesLanguages nationalitiesLanguages_idNationality_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."nationalitiesLanguages"
    ADD CONSTRAINT "nationalitiesLanguages_idNationality_fkey" FOREIGN KEY ("idNationality") REFERENCES public.nationalities("idNationality") ON DELETE CASCADE NOT VALID;
 n   ALTER TABLE ONLY public."nationalitiesLanguages" DROP CONSTRAINT "nationalitiesLanguages_idNationality_fkey";
       public          postgres    false    3008    212    213            �           2606    16636 9   organizationsUsers organizationsUsers_idOrganization_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."organizationsUsers"
    ADD CONSTRAINT "organizationsUsers_idOrganization_fkey" FOREIGN KEY ("idOrganization") REFERENCES public.organizations("idOrganization") ON DELETE CASCADE NOT VALID;
 g   ALTER TABLE ONLY public."organizationsUsers" DROP CONSTRAINT "organizationsUsers_idOrganization_fkey";
       public          postgres    false    3012    214    215            �           2606    16641 1   organizationsUsers organizationsUsers_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."organizationsUsers"
    ADD CONSTRAINT "organizationsUsers_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 _   ALTER TABLE ONLY public."organizationsUsers" DROP CONSTRAINT "organizationsUsers_idUser_fkey";
       public          postgres    false    3016    215    216            �           2606    16646 9   structuresCategories structuresCategories_idCategory_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresCategories"
    ADD CONSTRAINT "structuresCategories_idCategory_fkey" FOREIGN KEY ("idCategory") REFERENCES public.categories("idCategory") ON DELETE CASCADE;
 g   ALTER TABLE ONLY public."structuresCategories" DROP CONSTRAINT "structuresCategories_idCategory_fkey";
       public          postgres    false    201    219    2988            �           2606    16651 :   structuresCategories structuresCategories_idStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresCategories"
    ADD CONSTRAINT "structuresCategories_idStructure_fkey" FOREIGN KEY ("idStructure") REFERENCES public.structures("idStructure") ON DELETE CASCADE;
 h   ALTER TABLE ONLY public."structuresCategories" DROP CONSTRAINT "structuresCategories_idStructure_fkey";
       public          postgres    false    218    219    3018            �           2606    16656 2   structuresImages structuresImages_idStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresImages"
    ADD CONSTRAINT "structuresImages_idStructure_fkey" FOREIGN KEY ("idStructure") REFERENCES public.structures("idStructure") ON DELETE CASCADE;
 `   ALTER TABLE ONLY public."structuresImages" DROP CONSTRAINT "structuresImages_idStructure_fkey";
       public          postgres    false    221    3018    218            �           2606    16661 8   structuresLanguages structuresLanguages_idStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresLanguages"
    ADD CONSTRAINT "structuresLanguages_idStructure_fkey" FOREIGN KEY ("idStructure") REFERENCES public.structures("idStructure") ON DELETE CASCADE;
 f   ALTER TABLE ONLY public."structuresLanguages" DROP CONSTRAINT "structuresLanguages_idStructure_fkey";
       public          postgres    false    218    222    3018            �           2606    16666 !   structures structures_idIcon_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.structures
    ADD CONSTRAINT "structures_idIcon_fkey" FOREIGN KEY ("idIcon") REFERENCES public.icons("idIcon") NOT VALID;
 M   ALTER TABLE ONLY public.structures DROP CONSTRAINT "structures_idIcon_fkey";
       public          postgres    false    218    211    3006            �           2606    16671 )   structures structures_idOrganization_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.structures
    ADD CONSTRAINT "structures_idOrganization_fkey" FOREIGN KEY ("idOrganization") REFERENCES public.organizations("idOrganization") ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.structures DROP CONSTRAINT "structures_idOrganization_fkey";
       public          postgres    false    3012    214    218            �           2606    16676 6   usersInvitations usersInvitations_idUserRecipient_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersInvitations"
    ADD CONSTRAINT "usersInvitations_idUserRecipient_fkey" FOREIGN KEY ("idUserRecipient") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 d   ALTER TABLE ONLY public."usersInvitations" DROP CONSTRAINT "usersInvitations_idUserRecipient_fkey";
       public          postgres    false    3016    224    216            �           2606    16681 3   usersInvitations usersInvitations_idUserSender_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersInvitations"
    ADD CONSTRAINT "usersInvitations_idUserSender_fkey" FOREIGN KEY ("idUserSender") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 a   ALTER TABLE ONLY public."usersInvitations" DROP CONSTRAINT "usersInvitations_idUserSender_fkey";
       public          postgres    false    216    3016    224            �           2606    16686 #   usersTokens usersTokens_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersTokens"
    ADD CONSTRAINT "usersTokens_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 Q   ALTER TABLE ONLY public."usersTokens" DROP CONSTRAINT "usersTokens_idUser_fkey";
       public          postgres    false    225    216    3016            �           2606    16691    users users_idNationality_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_idNationality_fkey" FOREIGN KEY ("idNationality") REFERENCES public.nationalities("idNationality") NOT VALID;
 J   ALTER TABLE ONLY public.users DROP CONSTRAINT "users_idNationality_fkey";
       public          postgres    false    216    3008    212            m      x������ � �      n      x������ � �      o      x������ � �      p      x������ � �      q      x������ � �      r      x������ � �      s      x������ � �      t      x������ � �      u      x������ � �      w      x������ � �      x      x������ � �      y      x������ � �      z      x������ � �      {      x������ � �      }      x������ � �      ~      x������ � �            x������ � �      �      x������ � �      |      x������ � �      �      x������ � �      �      x������ � �     