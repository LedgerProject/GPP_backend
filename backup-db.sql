PGDMP         9                y           gpp_db    13.1    13.0 q    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            �           1262    16735    gpp_db    DATABASE     Q   CREATE DATABASE gpp_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'C';
    DROP DATABASE gpp_db;
                postgres    false                        3079    16736 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                   false            �           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                        false    2                        1247    17207    publicationStatus    TYPE     �   CREATE TYPE public."publicationStatus" AS ENUM (
    'requestPublication',
    'published',
    'rejected',
    'modification'
);
 &   DROP TYPE public."publicationStatus";
       public          postgres    false            �           1247    16748    status    TYPE     R   CREATE TYPE public.status AS ENUM (
    'INIT',
    'PENDING',
    'COMMITTED'
);
    DROP TYPE public.status;
       public          postgres    false            �            1259    16755 
   categories    TABLE     �   CREATE TABLE public.categories (
    "idCategory" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identifier character varying(50) NOT NULL,
    type character varying(20) NOT NULL
);
    DROP TABLE public.categories;
       public         heap    postgres    false    2            �            1259    16759    categoriesLanguages    TABLE       CREATE TABLE public."categoriesLanguages" (
    "idCategoryLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCategory" uuid NOT NULL,
    alias character varying(50) NOT NULL,
    category character varying(50) NOT NULL,
    language character(2) NOT NULL
);
 )   DROP TABLE public."categoriesLanguages";
       public         heap    postgres    false    2            �            1259    17140    contents    TABLE     �  CREATE TABLE public.contents (
    "idContent" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idUser" uuid NOT NULL,
    title character varying(50) NOT NULL,
    description text,
    "sharePosition" boolean NOT NULL,
    "positionLatitude" double precision,
    "positionLongitude" double precision,
    "shareName" boolean NOT NULL,
    "contentType" character varying(30) NOT NULL,
    "insertDate" timestamp without time zone NOT NULL
);
    DROP TABLE public.contents;
       public         heap    postgres    false    2            �            1259    17173    contentsMedia    TABLE     ?  CREATE TABLE public."contentsMedia" (
    "idContentMedia" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idContent" uuid NOT NULL,
    filename character varying(100) NOT NULL,
    "mimeType" text,
    size integer,
    "widthPixel" integer,
    "heightPixel" integer,
    key character varying(10) NOT NULL
);
 #   DROP TABLE public."contentsMedia";
       public         heap    postgres    false    2            �            1259    17148    contentsMediaEncryptedChunks    TABLE     �  CREATE TABLE public."contentsMediaEncryptedChunks" (
    "idContentMediaEncryptedChunk" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idContentMedia" uuid NOT NULL,
    "chunkIndexId" integer,
    checksum character varying(32),
    header character varying(50),
    iv character varying(50),
    text text,
    "ipfsPath" character varying(50),
    "transactionId" character varying(128),
    status public.status
);
 2   DROP TABLE public."contentsMediaEncryptedChunks";
       public         heap    postgres    false    2    663            �            1259    16763 	   countries    TABLE     �   CREATE TABLE public.countries (
    "idCountry" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identifier character varying(50) NOT NULL,
    completed boolean DEFAULT false
);
    DROP TABLE public.countries;
       public         heap    postgres    false    2            �            1259    16768    countriesLanguages    TABLE       CREATE TABLE public."countriesLanguages" (
    "idCountryLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCountry" uuid NOT NULL,
    alias character varying(50) NOT NULL,
    country character varying(50) NOT NULL,
    language character(2) NOT NULL
);
 (   DROP TABLE public."countriesLanguages";
       public         heap    postgres    false    2            �            1259    16772    countriesTopics    TABLE     �   CREATE TABLE public."countriesTopics" (
    "idCountryTopic" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCountry" uuid NOT NULL,
    identifier character varying(100) NOT NULL
);
 %   DROP TABLE public."countriesTopics";
       public         heap    postgres    false    2            �            1259    16776    countriesTopicsLanguages    TABLE       CREATE TABLE public."countriesTopicsLanguages" (
    "idCountryTopicLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCountryTopic" uuid NOT NULL,
    topic character varying(100) NOT NULL,
    description text NOT NULL,
    language character(2) NOT NULL
);
 .   DROP TABLE public."countriesTopicsLanguages";
       public         heap    postgres    false    2            �            1259    16783 	   documents    TABLE     4  CREATE TABLE public.documents (
    "idDocument" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idUser" uuid NOT NULL,
    title character varying(50) NOT NULL,
    filename character varying(100) NOT NULL,
    "mimeType" text,
    size integer,
    "widthPixel" integer,
    "heightPixel" integer
);
    DROP TABLE public.documents;
       public         heap    postgres    false    2            �            1259    17050    documentsEncryptedChunks    TABLE     �  CREATE TABLE public."documentsEncryptedChunks" (
    "idDocumentEncryptedChunk" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idDocument" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "chunkIndexId" integer,
    checksum character varying(32),
    header character varying(50),
    iv character varying(50),
    text text,
    "ipfsPath" character varying(50),
    "transactionId" character varying(128),
    status public.status
);
 .   DROP TABLE public."documentsEncryptedChunks";
       public         heap    postgres    false    2    2    663            �            1259    16790    encryptedChunk    TABLE     l  CREATE TABLE public."encryptedChunk" (
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
       public         heap    postgres    false            �            1259    16796    encryptedChunk_id_seq    SEQUENCE     �   ALTER TABLE public."encryptedChunk" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."encryptedChunk_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          postgres    false    208            �            1259    16798    icons    TABLE     �   CREATE TABLE public.icons (
    "idIcon" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(30) NOT NULL,
    image text NOT NULL,
    marker text NOT NULL
);
    DROP TABLE public.icons;
       public         heap    postgres    false    2            �            1259    16805    nationalities    TABLE     �   CREATE TABLE public.nationalities (
    "idNationality" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identifier character varying(50) NOT NULL
);
 !   DROP TABLE public.nationalities;
       public         heap    postgres    false    2            �            1259    16809    nationalitiesLanguages    TABLE       CREATE TABLE public."nationalitiesLanguages" (
    "idNationalityLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idNationality" uuid NOT NULL,
    alias character varying(50) NOT NULL,
    nationality character varying(50) NOT NULL,
    language character(2) NOT NULL
);
 ,   DROP TABLE public."nationalitiesLanguages";
       public         heap    postgres    false    2            �            1259    16813    organizations    TABLE     �   CREATE TABLE public.organizations (
    "idOrganization" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL
);
 !   DROP TABLE public.organizations;
       public         heap    postgres    false    2            �            1259    16817    organizationsUsers    TABLE     $  CREATE TABLE public."organizationsUsers" (
    "idOrganizationUser" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idOrganization" uuid NOT NULL,
    "idUser" uuid NOT NULL,
    permissions text NOT NULL,
    confirmed boolean NOT NULL,
    "invitationToken" character varying(100)
);
 (   DROP TABLE public."organizationsUsers";
       public         heap    postgres    false    2            �            1259    16824    users    TABLE     &  CREATE TABLE public.users (
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
    "idIcon" uuid,
    "confirmAccountToken" character varying(150),
    pbkdf character varying(500),
    "publicKey" character varying(250),
    "tokenAttempts" integer,
    "tokenCheckBlockedUntil" timestamp without time zone
);
    DROP TABLE public.users;
       public         heap    postgres    false    2            �            1259    16832    organizationsUsersView    VIEW     �  CREATE VIEW public."organizationsUsersView" AS
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
       public          postgres    false    214    214    215    214    215    213    215    213            �            1259    16837 
   structures    TABLE     �  CREATE TABLE public.structures (
    "idStructure" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idOrganization" uuid,
    alias character varying(100) NOT NULL,
    name character varying(100) NOT NULL,
    address character varying(150) NOT NULL,
    city character varying(50) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    email character varying(150),
    "phoneNumberPrefix" character varying(10),
    "phoneNumber" character varying(50),
    website character varying(150),
    "idIcon" uuid NOT NULL,
    "publicationStatus" public."publicationStatus",
    "rejectionDescription" text
);
    DROP TABLE public.structures;
       public         heap    postgres    false    2    768            �            1259    16844    structuresCategories    TABLE     �   CREATE TABLE public."structuresCategories" (
    "idStructureCategory" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idStructure" uuid NOT NULL,
    "idCategory" uuid NOT NULL
);
 *   DROP TABLE public."structuresCategories";
       public         heap    postgres    false    2            �            1259    16848    structuresCategoriesView    VIEW     ^  CREATE VIEW public."structuresCategoriesView" AS
 SELECT "structuresCategories"."idStructureCategory",
    "structuresCategories"."idStructure",
    "structuresCategories"."idCategory",
    categories.identifier
   FROM (public."structuresCategories"
     JOIN public.categories ON (("structuresCategories"."idCategory" = categories."idCategory")));
 -   DROP VIEW public."structuresCategoriesView";
       public          postgres    false    218    218    201    201    218            �            1259    16852    structuresLanguages    TABLE     �   CREATE TABLE public."structuresLanguages" (
    "idStructureLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idStructure" uuid NOT NULL,
    description text,
    language character(2) NOT NULL
);
 )   DROP TABLE public."structuresLanguages";
       public         heap    postgres    false    2            �            1259    17130    structuresExport    VIEW     �  CREATE VIEW public."structuresExport" AS
 SELECT structures."idStructure",
    structures."idOrganization",
    structures.alias,
    structures.name,
    structures.address,
    structures.city,
    structures.latitude,
    structures.longitude,
    structures.email,
    structures."phoneNumberPrefix",
    structures."phoneNumber",
    structures.website,
    structures."idIcon",
    icons.name AS icon,
    "structuresLanguages".description
   FROM ((public.structures
     LEFT JOIN public.icons ON ((structures."idIcon" = icons."idIcon")))
     LEFT JOIN public."structuresLanguages" ON ((structures."idStructure" = "structuresLanguages"."idStructure")))
  ORDER BY structures.name;
 %   DROP VIEW public."structuresExport";
       public          postgres    false    217    220    220    217    217    217    217    217    217    217    217    217    217    217    217    210    210            �            1259    16864    structuresImages    TABLE     D  CREATE TABLE public."structuresImages" (
    "idStructureImage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idStructure" uuid NOT NULL,
    folder character varying(100) NOT NULL,
    filename character varying(100) NOT NULL,
    "mimeType" character varying(20),
    size integer,
    sorting integer NOT NULL
);
 &   DROP TABLE public."structuresImages";
       public         heap    postgres    false    2            �            1259    17135    structuresView    VIEW     �  CREATE VIEW public."structuresView" AS
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
       public          postgres    false    217    217    217    217    217    217    217    217    210    210    210    213    213    217    217    217    217    217            �            1259    16873    usersInvitations    TABLE     
  CREATE TABLE public."usersInvitations" (
    "idUserInvitation" uuid NOT NULL,
    "idUserSender" uuid NOT NULL,
    "idUserRecipient" uuid NOT NULL,
    message text,
    "accessLevel" character varying(100) NOT NULL,
    accepted boolean DEFAULT false NOT NULL
);
 &   DROP TABLE public."usersInvitations";
       public         heap    postgres    false            �            1259    16880    usersTokens    TABLE     L  CREATE TABLE public."usersTokens" (
    "idUserToken" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idUser" uuid NOT NULL,
    token character varying NOT NULL,
    key character varying,
    checksum character varying,
    header character varying,
    iv character varying,
    "validUntil" timestamp without time zone
);
 !   DROP TABLE public."usersTokens";
       public         heap    postgres    false    2            �            1259    17073    usersTokensDocuments    TABLE     �   CREATE TABLE public."usersTokensDocuments" (
    "idUserTokenDocument" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idUserToken" uuid NOT NULL,
    "idDocument" uuid NOT NULL
);
 *   DROP TABLE public."usersTokensDocuments";
       public         heap    postgres    false    2            �          0    16755 
   categories 
   TABLE DATA           D   COPY public.categories ("idCategory", identifier, type) FROM stdin;
    public          postgres    false    201   E�       �          0    16759    categoriesLanguages 
   TABLE DATA           n   COPY public."categoriesLanguages" ("idCategoryLanguage", "idCategory", alias, category, language) FROM stdin;
    public          postgres    false    202   b�       �          0    17140    contents 
   TABLE DATA           �   COPY public.contents ("idContent", "idUser", title, description, "sharePosition", "positionLatitude", "positionLongitude", "shareName", "contentType", "insertDate") FROM stdin;
    public          postgres    false    228   �       �          0    17173    contentsMedia 
   TABLE DATA           �   COPY public."contentsMedia" ("idContentMedia", "idContent", filename, "mimeType", size, "widthPixel", "heightPixel", key) FROM stdin;
    public          postgres    false    230   ��       �          0    17148    contentsMediaEncryptedChunks 
   TABLE DATA           �   COPY public."contentsMediaEncryptedChunks" ("idContentMediaEncryptedChunk", "idContentMedia", "chunkIndexId", checksum, header, iv, text, "ipfsPath", "transactionId", status) FROM stdin;
    public          postgres    false    229   ��       �          0    16763 	   countries 
   TABLE DATA           G   COPY public.countries ("idCountry", identifier, completed) FROM stdin;
    public          postgres    false    203   ֳ       �          0    16768    countriesLanguages 
   TABLE DATA           j   COPY public."countriesLanguages" ("idCountryLanguage", "idCountry", alias, country, language) FROM stdin;
    public          postgres    false    204   �       �          0    16772    countriesTopics 
   TABLE DATA           V   COPY public."countriesTopics" ("idCountryTopic", "idCountry", identifier) FROM stdin;
    public          postgres    false    205   �       �          0    16776    countriesTopicsLanguages 
   TABLE DATA           ~   COPY public."countriesTopicsLanguages" ("idCountryTopicLanguage", "idCountryTopic", topic, description, language) FROM stdin;
    public          postgres    false    206   -�       �          0    16783 	   documents 
   TABLE DATA           {   COPY public.documents ("idDocument", "idUser", title, filename, "mimeType", size, "widthPixel", "heightPixel") FROM stdin;
    public          postgres    false    207   J�       �          0    17050    documentsEncryptedChunks 
   TABLE DATA           �   COPY public."documentsEncryptedChunks" ("idDocumentEncryptedChunk", "idDocument", "chunkIndexId", checksum, header, iv, text, "ipfsPath", "transactionId", status) FROM stdin;
    public          postgres    false    224   g�       �          0    16790    encryptedChunk 
   TABLE DATA           �   COPY public."encryptedChunk" (id, "idUser", name, "chunkIndexId", checksum, header, iv, text, contenttype, "uploadReferenceId") FROM stdin;
    public          postgres    false    208   ��       �          0    16798    icons 
   TABLE DATA           >   COPY public.icons ("idIcon", name, image, marker) FROM stdin;
    public          postgres    false    210   ��       �          0    16805    nationalities 
   TABLE DATA           D   COPY public.nationalities ("idNationality", identifier) FROM stdin;
    public          postgres    false    211   ��       �          0    16809    nationalitiesLanguages 
   TABLE DATA           z   COPY public."nationalitiesLanguages" ("idNationalityLanguage", "idNationality", alias, nationality, language) FROM stdin;
    public          postgres    false    212   ۴       �          0    16813    organizations 
   TABLE DATA           ?   COPY public.organizations ("idOrganization", name) FROM stdin;
    public          postgres    false    213   ��       �          0    16817    organizationsUsers 
   TABLE DATA           �   COPY public."organizationsUsers" ("idOrganizationUser", "idOrganization", "idUser", permissions, confirmed, "invitationToken") FROM stdin;
    public          postgres    false    214   �       �          0    16837 
   structures 
   TABLE DATA           �   COPY public.structures ("idStructure", "idOrganization", alias, name, address, city, latitude, longitude, email, "phoneNumberPrefix", "phoneNumber", website, "idIcon", "publicationStatus", "rejectionDescription") FROM stdin;
    public          postgres    false    217   2�       �          0    16844    structuresCategories 
   TABLE DATA           d   COPY public."structuresCategories" ("idStructureCategory", "idStructure", "idCategory") FROM stdin;
    public          postgres    false    218   O�       �          0    16864    structuresImages 
   TABLE DATA           |   COPY public."structuresImages" ("idStructureImage", "idStructure", folder, filename, "mimeType", size, sorting) FROM stdin;
    public          postgres    false    221   l�       �          0    16852    structuresLanguages 
   TABLE DATA           l   COPY public."structuresLanguages" ("idStructureLanguage", "idStructure", description, language) FROM stdin;
    public          postgres    false    220   ��       �          0    16824    users 
   TABLE DATA           2  COPY public.users ("idUser", "userType", "firstName", "lastName", email, "emailConfirmed", password, "passwordRecoveryToken", "passwordRecoveryDate", permissions, "idNationality", gender, birthday, "idIcon", "confirmAccountToken", pbkdf, "publicKey", "tokenAttempts", "tokenCheckBlockedUntil") FROM stdin;
    public          postgres    false    215   ��       �          0    16873    usersInvitations 
   TABLE DATA           �   COPY public."usersInvitations" ("idUserInvitation", "idUserSender", "idUserRecipient", message, "accessLevel", accepted) FROM stdin;
    public          postgres    false    222   õ       �          0    16880    usersTokens 
   TABLE DATA           p   COPY public."usersTokens" ("idUserToken", "idUser", token, key, checksum, header, iv, "validUntil") FROM stdin;
    public          postgres    false    223   �       �          0    17073    usersTokensDocuments 
   TABLE DATA           d   COPY public."usersTokensDocuments" ("idUserTokenDocument", "idUserToken", "idDocument") FROM stdin;
    public          postgres    false    225   ��       �           0    0    encryptedChunk_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."encryptedChunk_id_seq"', 4, true);
          public          postgres    false    209            �           2606    16913 ,   categoriesLanguages categoriesLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."categoriesLanguages"
    ADD CONSTRAINT "categoriesLanguages_pkey" PRIMARY KEY ("idCategoryLanguage");
 Z   ALTER TABLE ONLY public."categoriesLanguages" DROP CONSTRAINT "categoriesLanguages_pkey";
       public            postgres    false    202            �           2606    16915    categories categories_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY ("idCategory");
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            postgres    false    201                       2606    17152 =   contentsMediaEncryptedChunks contentsMediaEncryptedChunk_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."contentsMediaEncryptedChunks"
    ADD CONSTRAINT "contentsMediaEncryptedChunk_pkey" PRIMARY KEY ("idContentMediaEncryptedChunk");
 k   ALTER TABLE ONLY public."contentsMediaEncryptedChunks" DROP CONSTRAINT "contentsMediaEncryptedChunk_pkey";
       public            postgres    false    229                       2606    17181     contentsMedia contentsMedia_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public."contentsMedia"
    ADD CONSTRAINT "contentsMedia_pkey" PRIMARY KEY ("idContentMedia");
 N   ALTER TABLE ONLY public."contentsMedia" DROP CONSTRAINT "contentsMedia_pkey";
       public            postgres    false    230                       2606    17147    contents contents_pkey 
   CONSTRAINT     ]   ALTER TABLE ONLY public.contents
    ADD CONSTRAINT contents_pkey PRIMARY KEY ("idContent");
 @   ALTER TABLE ONLY public.contents DROP CONSTRAINT contents_pkey;
       public            postgres    false    228            �           2606    16917 *   countriesLanguages countriesLanguages_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY public."countriesLanguages"
    ADD CONSTRAINT "countriesLanguages_pkey" PRIMARY KEY ("idCountryLanguage");
 X   ALTER TABLE ONLY public."countriesLanguages" DROP CONSTRAINT "countriesLanguages_pkey";
       public            postgres    false    204            �           2606    16919 6   countriesTopicsLanguages countriesTopicsLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."countriesTopicsLanguages"
    ADD CONSTRAINT "countriesTopicsLanguages_pkey" PRIMARY KEY ("idCountryTopicLanguage");
 d   ALTER TABLE ONLY public."countriesTopicsLanguages" DROP CONSTRAINT "countriesTopicsLanguages_pkey";
       public            postgres    false    206            �           2606    16921 $   countriesTopics countriesTopics_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public."countriesTopics"
    ADD CONSTRAINT "countriesTopics_pkey" PRIMARY KEY ("idCountryTopic");
 R   ALTER TABLE ONLY public."countriesTopics" DROP CONSTRAINT "countriesTopics_pkey";
       public            postgres    false    205            �           2606    16923    countries countries_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY ("idCountry");
 B   ALTER TABLE ONLY public.countries DROP CONSTRAINT countries_pkey;
       public            postgres    false    203            �           2606    17059 6   documentsEncryptedChunks documentsEncryptedChunks_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."documentsEncryptedChunks"
    ADD CONSTRAINT "documentsEncryptedChunks_pkey" PRIMARY KEY ("idDocumentEncryptedChunk");
 d   ALTER TABLE ONLY public."documentsEncryptedChunks" DROP CONSTRAINT "documentsEncryptedChunks_pkey";
       public            postgres    false    224            �           2606    16925    documents documents_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY ("idDocument");
 B   ALTER TABLE ONLY public.documents DROP CONSTRAINT documents_pkey;
       public            postgres    false    207            �           2606    16927 "   encryptedChunk encryptedChunk_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."encryptedChunk"
    ADD CONSTRAINT "encryptedChunk_pkey" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public."encryptedChunk" DROP CONSTRAINT "encryptedChunk_pkey";
       public            postgres    false    208            �           2606    16929    icons icons_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.icons
    ADD CONSTRAINT icons_pkey PRIMARY KEY ("idIcon");
 :   ALTER TABLE ONLY public.icons DROP CONSTRAINT icons_pkey;
       public            postgres    false    210            �           2606    16931 2   nationalitiesLanguages nationalitiesLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."nationalitiesLanguages"
    ADD CONSTRAINT "nationalitiesLanguages_pkey" PRIMARY KEY ("idNationalityLanguage");
 `   ALTER TABLE ONLY public."nationalitiesLanguages" DROP CONSTRAINT "nationalitiesLanguages_pkey";
       public            postgres    false    212            �           2606    16933     nationalities nationalities_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.nationalities
    ADD CONSTRAINT nationalities_pkey PRIMARY KEY ("idNationality");
 J   ALTER TABLE ONLY public.nationalities DROP CONSTRAINT nationalities_pkey;
       public            postgres    false    211            �           2606    16935 *   organizationsUsers organizationsUsers_pkey 
   CONSTRAINT     ~   ALTER TABLE ONLY public."organizationsUsers"
    ADD CONSTRAINT "organizationsUsers_pkey" PRIMARY KEY ("idOrganizationUser");
 X   ALTER TABLE ONLY public."organizationsUsers" DROP CONSTRAINT "organizationsUsers_pkey";
       public            postgres    false    214            �           2606    16937     organizations organizations_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY ("idOrganization");
 J   ALTER TABLE ONLY public.organizations DROP CONSTRAINT organizations_pkey;
       public            postgres    false    213            �           2606    16939 .   structuresCategories structuresCategories_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."structuresCategories"
    ADD CONSTRAINT "structuresCategories_pkey" PRIMARY KEY ("idStructureCategory");
 \   ALTER TABLE ONLY public."structuresCategories" DROP CONSTRAINT "structuresCategories_pkey";
       public            postgres    false    218            �           2606    16941 &   structuresImages structuresImages_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public."structuresImages"
    ADD CONSTRAINT "structuresImages_pkey" PRIMARY KEY ("idStructureImage");
 T   ALTER TABLE ONLY public."structuresImages" DROP CONSTRAINT "structuresImages_pkey";
       public            postgres    false    221            �           2606    16943 ,   structuresLanguages structuresLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."structuresLanguages"
    ADD CONSTRAINT "structuresLanguages_pkey" PRIMARY KEY ("idStructureLanguage");
 Z   ALTER TABLE ONLY public."structuresLanguages" DROP CONSTRAINT "structuresLanguages_pkey";
       public            postgres    false    220            �           2606    16945    structures structures_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.structures
    ADD CONSTRAINT structures_pkey PRIMARY KEY ("idStructure");
 D   ALTER TABLE ONLY public.structures DROP CONSTRAINT structures_pkey;
       public            postgres    false    217            �           2606    16947 &   usersInvitations usersInvitations_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public."usersInvitations"
    ADD CONSTRAINT "usersInvitations_pkey" PRIMARY KEY ("idUserInvitation");
 T   ALTER TABLE ONLY public."usersInvitations" DROP CONSTRAINT "usersInvitations_pkey";
       public            postgres    false    222                        2606    17078 .   usersTokensDocuments usersTokensDocuments_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."usersTokensDocuments"
    ADD CONSTRAINT "usersTokensDocuments_pkey" PRIMARY KEY ("idUserTokenDocument");
 \   ALTER TABLE ONLY public."usersTokensDocuments" DROP CONSTRAINT "usersTokensDocuments_pkey";
       public            postgres    false    225            �           2606    16949    usersTokens usersTokens_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public."usersTokens"
    ADD CONSTRAINT "usersTokens_pkey" PRIMARY KEY ("idUserToken");
 J   ALTER TABLE ONLY public."usersTokens" DROP CONSTRAINT "usersTokens_pkey";
       public            postgres    false    223            �           2606    16951    users users_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY ("idUser");
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            postgres    false    215                       2606    16952 7   categoriesLanguages categoriesLanguages_idCategory_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."categoriesLanguages"
    ADD CONSTRAINT "categoriesLanguages_idCategory_fkey" FOREIGN KEY ("idCategory") REFERENCES public.categories("idCategory") ON DELETE CASCADE NOT VALID;
 e   ALTER TABLE ONLY public."categoriesLanguages" DROP CONSTRAINT "categoriesLanguages_idCategory_fkey";
       public          postgres    false    201    3286    202                       2606    17182 M   contentsMediaEncryptedChunks contentsMediaEncryptedChunks_idContentMedia_pkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."contentsMediaEncryptedChunks"
    ADD CONSTRAINT "contentsMediaEncryptedChunks_idContentMedia_pkey" FOREIGN KEY ("idContentMedia") REFERENCES public."contentsMedia"("idContentMedia") ON DELETE CASCADE NOT VALID;
 {   ALTER TABLE ONLY public."contentsMediaEncryptedChunks" DROP CONSTRAINT "contentsMediaEncryptedChunks_idContentMedia_pkey";
       public          postgres    false    229    3334    230                       2606    17187 *   contentsMedia contentsMedia_idContent_pkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."contentsMedia"
    ADD CONSTRAINT "contentsMedia_idContent_pkey" FOREIGN KEY ("idContent") REFERENCES public.contents("idContent") ON DELETE CASCADE NOT VALID;
 X   ALTER TABLE ONLY public."contentsMedia" DROP CONSTRAINT "contentsMedia_idContent_pkey";
       public          postgres    false    3330    230    228                       2606    17168    contents contents_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.contents
    ADD CONSTRAINT "contents_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 I   ALTER TABLE ONLY public.contents DROP CONSTRAINT "contents_idUser_fkey";
       public          postgres    false    228    3312    215                       2606    16957 4   countriesLanguages countriesLanguages_idCountry_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."countriesLanguages"
    ADD CONSTRAINT "countriesLanguages_idCountry_fkey" FOREIGN KEY ("idCountry") REFERENCES public.countries("idCountry") ON DELETE CASCADE;
 b   ALTER TABLE ONLY public."countriesLanguages" DROP CONSTRAINT "countriesLanguages_idCountry_fkey";
       public          postgres    false    3290    204    203            
           2606    16962 E   countriesTopicsLanguages countriesTopicsLanguages_idCountryTopic_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."countriesTopicsLanguages"
    ADD CONSTRAINT "countriesTopicsLanguages_idCountryTopic_fkey" FOREIGN KEY ("idCountryTopic") REFERENCES public."countriesTopics"("idCountryTopic") ON DELETE CASCADE;
 s   ALTER TABLE ONLY public."countriesTopicsLanguages" DROP CONSTRAINT "countriesTopicsLanguages_idCountryTopic_fkey";
       public          postgres    false    206    205    3294            	           2606    16967 .   countriesTopics countriesTopics_idCountry_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."countriesTopics"
    ADD CONSTRAINT "countriesTopics_idCountry_fkey" FOREIGN KEY ("idCountry") REFERENCES public.countries("idCountry") ON DELETE CASCADE NOT VALID;
 \   ALTER TABLE ONLY public."countriesTopics" DROP CONSTRAINT "countriesTopics_idCountry_fkey";
       public          postgres    false    203    205    3290                       2606    17060 A   documentsEncryptedChunks documentsEncryptedChunks_idDocument_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."documentsEncryptedChunks"
    ADD CONSTRAINT "documentsEncryptedChunks_idDocument_fkey" FOREIGN KEY ("idDocument") REFERENCES public.documents("idDocument") ON DELETE CASCADE;
 o   ALTER TABLE ONLY public."documentsEncryptedChunks" DROP CONSTRAINT "documentsEncryptedChunks_idDocument_fkey";
       public          postgres    false    224    207    3298                       2606    16972    documents documents_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.documents
    ADD CONSTRAINT "documents_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 K   ALTER TABLE ONLY public.documents DROP CONSTRAINT "documents_idUser_fkey";
       public          postgres    false    3312    207    215                       2606    16977 @   nationalitiesLanguages nationalitiesLanguages_idNationality_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."nationalitiesLanguages"
    ADD CONSTRAINT "nationalitiesLanguages_idNationality_fkey" FOREIGN KEY ("idNationality") REFERENCES public.nationalities("idNationality") ON DELETE CASCADE NOT VALID;
 n   ALTER TABLE ONLY public."nationalitiesLanguages" DROP CONSTRAINT "nationalitiesLanguages_idNationality_fkey";
       public          postgres    false    212    211    3304                       2606    16982 9   organizationsUsers organizationsUsers_idOrganization_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."organizationsUsers"
    ADD CONSTRAINT "organizationsUsers_idOrganization_fkey" FOREIGN KEY ("idOrganization") REFERENCES public.organizations("idOrganization") ON DELETE CASCADE NOT VALID;
 g   ALTER TABLE ONLY public."organizationsUsers" DROP CONSTRAINT "organizationsUsers_idOrganization_fkey";
       public          postgres    false    214    3308    213                       2606    16987 1   organizationsUsers organizationsUsers_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."organizationsUsers"
    ADD CONSTRAINT "organizationsUsers_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 _   ALTER TABLE ONLY public."organizationsUsers" DROP CONSTRAINT "organizationsUsers_idUser_fkey";
       public          postgres    false    215    214    3312                       2606    16992 9   structuresCategories structuresCategories_idCategory_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresCategories"
    ADD CONSTRAINT "structuresCategories_idCategory_fkey" FOREIGN KEY ("idCategory") REFERENCES public.categories("idCategory") ON DELETE CASCADE;
 g   ALTER TABLE ONLY public."structuresCategories" DROP CONSTRAINT "structuresCategories_idCategory_fkey";
       public          postgres    false    3286    201    218                       2606    16997 :   structuresCategories structuresCategories_idStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresCategories"
    ADD CONSTRAINT "structuresCategories_idStructure_fkey" FOREIGN KEY ("idStructure") REFERENCES public.structures("idStructure") ON DELETE CASCADE;
 h   ALTER TABLE ONLY public."structuresCategories" DROP CONSTRAINT "structuresCategories_idStructure_fkey";
       public          postgres    false    3314    217    218                       2606    17002 2   structuresImages structuresImages_idStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresImages"
    ADD CONSTRAINT "structuresImages_idStructure_fkey" FOREIGN KEY ("idStructure") REFERENCES public.structures("idStructure") ON DELETE CASCADE;
 `   ALTER TABLE ONLY public."structuresImages" DROP CONSTRAINT "structuresImages_idStructure_fkey";
       public          postgres    false    217    221    3314                       2606    17007 8   structuresLanguages structuresLanguages_idStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresLanguages"
    ADD CONSTRAINT "structuresLanguages_idStructure_fkey" FOREIGN KEY ("idStructure") REFERENCES public.structures("idStructure") ON DELETE CASCADE;
 f   ALTER TABLE ONLY public."structuresLanguages" DROP CONSTRAINT "structuresLanguages_idStructure_fkey";
       public          postgres    false    217    220    3314                       2606    17012 !   structures structures_idIcon_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.structures
    ADD CONSTRAINT "structures_idIcon_fkey" FOREIGN KEY ("idIcon") REFERENCES public.icons("idIcon") NOT VALID;
 M   ALTER TABLE ONLY public.structures DROP CONSTRAINT "structures_idIcon_fkey";
       public          postgres    false    3302    217    210                       2606    17017 )   structures structures_idOrganization_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.structures
    ADD CONSTRAINT "structures_idOrganization_fkey" FOREIGN KEY ("idOrganization") REFERENCES public.organizations("idOrganization") ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.structures DROP CONSTRAINT "structures_idOrganization_fkey";
       public          postgres    false    217    3308    213                       2606    17022 6   usersInvitations usersInvitations_idUserRecipient_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersInvitations"
    ADD CONSTRAINT "usersInvitations_idUserRecipient_fkey" FOREIGN KEY ("idUserRecipient") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 d   ALTER TABLE ONLY public."usersInvitations" DROP CONSTRAINT "usersInvitations_idUserRecipient_fkey";
       public          postgres    false    222    3312    215                       2606    17027 3   usersInvitations usersInvitations_idUserSender_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersInvitations"
    ADD CONSTRAINT "usersInvitations_idUserSender_fkey" FOREIGN KEY ("idUserSender") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 a   ALTER TABLE ONLY public."usersInvitations" DROP CONSTRAINT "usersInvitations_idUserSender_fkey";
       public          postgres    false    3312    222    215                       2606    17118 9   usersTokensDocuments usersTokensDocuments_idDocument_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersTokensDocuments"
    ADD CONSTRAINT "usersTokensDocuments_idDocument_fkey" FOREIGN KEY ("idDocument") REFERENCES public.documents("idDocument") ON DELETE CASCADE NOT VALID;
 g   ALTER TABLE ONLY public."usersTokensDocuments" DROP CONSTRAINT "usersTokensDocuments_idDocument_fkey";
       public          postgres    false    225    3298    207                       2606    17113 :   usersTokensDocuments usersTokensDocuments_idUserToken_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersTokensDocuments"
    ADD CONSTRAINT "usersTokensDocuments_idUserToken_fkey" FOREIGN KEY ("idUserToken") REFERENCES public."usersTokens"("idUserToken") ON DELETE CASCADE NOT VALID;
 h   ALTER TABLE ONLY public."usersTokensDocuments" DROP CONSTRAINT "usersTokensDocuments_idUserToken_fkey";
       public          postgres    false    225    3324    223                       2606    17032 #   usersTokens usersTokens_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersTokens"
    ADD CONSTRAINT "usersTokens_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 Q   ALTER TABLE ONLY public."usersTokens" DROP CONSTRAINT "usersTokens_idUser_fkey";
       public          postgres    false    215    223    3312                       2606    17037    users users_idNationality_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_idNationality_fkey" FOREIGN KEY ("idNationality") REFERENCES public.nationalities("idNationality") NOT VALID;
 J   ALTER TABLE ONLY public.users DROP CONSTRAINT "users_idNationality_fkey";
       public          postgres    false    3304    211    215            �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �      �      x������ � �     