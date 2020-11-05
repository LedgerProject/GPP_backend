PGDMP         5            
    x            gpp_db    13.0    13.0 Y    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
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
       public         heap    gpp_user    false    2            �            1259    32820    countriesTopicsLanguages    TABLE     �   CREATE TABLE public."countriesTopicsLanguages" (
    "idCountryTopicLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCountryTopic" uuid NOT NULL,
    topic character varying(100) NOT NULL,
    description text NOT NULL
);
 .   DROP TABLE public."countriesTopicsLanguages";
       public         heap    gpp_user    false    2            �            1259    32827 	   documents    TABLE     �  CREATE TABLE public.documents (
    "idDocument" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idUser" uuid NOT NULL,
    title character varying(50) NOT NULL,
    bytes integer NOT NULL,
    "widthPixel" integer,
    "heightPixel" integer,
    "fileFolder" character varying(50) NOT NULL,
    "imageFolder" character varying(50) NOT NULL,
    extension character varying(5) NOT NULL
);
    DROP TABLE public.documents;
       public         heap    gpp_user    false    2            �            1259    32831    encryptedChunk    TABLE     S  CREATE TABLE public."encryptedChunk" (
    id integer NOT NULL,
    "idUser" uuid NOT NULL,
    name character varying(50) NOT NULL,
    "uploadReferenceId" character varying(50),
    "chunkIndexId" character varying(32),
    checksum character varying(32),
    header character varying(50),
    iv character varying(50),
    text text
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
       public          gpp_user    false    214    213    213    214    214    215    215    215            �            1259    32878 
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
       public          postgres    false    218    201    201    218    218            �            1259    32889    structuresImages    TABLE     �   CREATE TABLE public."structuresImages" (
    "idStructureImage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idStructure" uuid NOT NULL,
    image text NOT NULL,
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
       public          gpp_user    false    217    217    217    217    217    217    217    217    217    217    217    217    217    213    213    210    210    210            �            1259    32905    usersInvitations    TABLE     
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
       public         heap    gpp_user    false    2            o          0    32799 
   categories 
   TABLE DATA           D   COPY public.categories ("idCategory", identifier, type) FROM stdin;
    public          gpp_user    false    201   ��       p          0    32803    categoriesLanguages 
   TABLE DATA           n   COPY public."categoriesLanguages" ("idCategoryLanguage", "idCategory", alias, category, language) FROM stdin;
    public          gpp_user    false    202   @�       q          0    32807 	   countries 
   TABLE DATA           G   COPY public.countries ("idCountry", identifier, completed) FROM stdin;
    public          gpp_user    false    203   Q�       r          0    32812    countriesLanguages 
   TABLE DATA           j   COPY public."countriesLanguages" ("idCountryLanguage", "idCountry", alias, country, language) FROM stdin;
    public          gpp_user    false    204   ��       s          0    32816    countriesTopics 
   TABLE DATA           V   COPY public."countriesTopics" ("idCountryTopic", "idCountry", identifier) FROM stdin;
    public          gpp_user    false    205   ��       t          0    32820    countriesTopicsLanguages 
   TABLE DATA           t   COPY public."countriesTopicsLanguages" ("idCountryTopicLanguage", "idCountryTopic", topic, description) FROM stdin;
    public          gpp_user    false    206   ��       u          0    32827 	   documents 
   TABLE DATA           �   COPY public.documents ("idDocument", "idUser", title, bytes, "widthPixel", "heightPixel", "fileFolder", "imageFolder", extension) FROM stdin;
    public          gpp_user    false    207   ��       v          0    32831    encryptedChunk 
   TABLE DATA              COPY public."encryptedChunk" (id, "idUser", name, "uploadReferenceId", "chunkIndexId", checksum, header, iv, text) FROM stdin;
    public          gpp_user    false    208   ׈       x          0    32839    icons 
   TABLE DATA           >   COPY public.icons ("idIcon", name, image, marker) FROM stdin;
    public          gpp_user    false    210   �       y          0    32846    nationalities 
   TABLE DATA           D   COPY public.nationalities ("idNationality", identifier) FROM stdin;
    public          gpp_user    false    211   ��       z          0    32850    nationalitiesLanguages 
   TABLE DATA           z   COPY public."nationalitiesLanguages" ("idNationalityLanguage", "idNationality", alias, nationality, language) FROM stdin;
    public          gpp_user    false    212   ��       {          0    32854    organizations 
   TABLE DATA           ?   COPY public.organizations ("idOrganization", name) FROM stdin;
    public          gpp_user    false    213   �       |          0    32858    organizationsUsers 
   TABLE DATA           x   COPY public."organizationsUsers" ("idOrganizationUser", "idOrganization", "idUser", permissions, confirmed) FROM stdin;
    public          gpp_user    false    214   ��       ~          0    32878 
   structures 
   TABLE DATA           �   COPY public.structures ("idStructure", "idOrganization", alias, name, address, city, latitude, longitude, email, "phoneNumberPrefix", "phoneNumber", website, "idIcon") FROM stdin;
    public          gpp_user    false    217   J�                 0    32885    structuresCategories 
   TABLE DATA           d   COPY public."structuresCategories" ("idStructureCategory", "idStructure", "idCategory") FROM stdin;
    public          gpp_user    false    218   K�       �          0    32889    structuresImages 
   TABLE DATA           _   COPY public."structuresImages" ("idStructureImage", "idStructure", image, sorting) FROM stdin;
    public          gpp_user    false    219   �       �          0    32893    structuresLanguages 
   TABLE DATA           l   COPY public."structuresLanguages" ("idStructureLanguage", "idStructure", description, language) FROM stdin;
    public          gpp_user    false    220   .�       }          0    32866    users 
   TABLE DATA           �   COPY public.users ("idUser", "userType", "firstName", "lastName", email, "emailConfirmed", password, "passwordRecoveryToken", "passwordRecoveryDate", permissions, "idNationality", gender, birthday, "idIcon") FROM stdin;
    public          gpp_user    false    215   ��       �          0    32905    usersInvitations 
   TABLE DATA           �   COPY public."usersInvitations" ("idUserInvitation", "idUserSender", "idUserRecipient", message, "accessLevel", accepted) FROM stdin;
    public          gpp_user    false    222   l�       �          0    32912    usersTokens 
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
       public            gpp_user    false    203            �           2606    32934    documents documents_pkey 
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
       public          gpp_user    false    201    3249    202            �           2606    32966 4   countriesLanguages countriesLanguages_idCountry_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."countriesLanguages"
    ADD CONSTRAINT "countriesLanguages_idCountry_fkey" FOREIGN KEY ("idCountry") REFERENCES public.countries("idCountry") ON DELETE CASCADE;
 b   ALTER TABLE ONLY public."countriesLanguages" DROP CONSTRAINT "countriesLanguages_idCountry_fkey";
       public          gpp_user    false    204    203    3253            �           2606    32971 E   countriesTopicsLanguages countriesTopicsLanguages_idCountryTopic_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."countriesTopicsLanguages"
    ADD CONSTRAINT "countriesTopicsLanguages_idCountryTopic_fkey" FOREIGN KEY ("idCountryTopic") REFERENCES public."countriesTopics"("idCountryTopic") ON DELETE CASCADE;
 s   ALTER TABLE ONLY public."countriesTopicsLanguages" DROP CONSTRAINT "countriesTopicsLanguages_idCountryTopic_fkey";
       public          gpp_user    false    205    3257    206            �           2606    32976 .   countriesTopics countriesTopics_idCountry_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."countriesTopics"
    ADD CONSTRAINT "countriesTopics_idCountry_fkey" FOREIGN KEY ("idCountry") REFERENCES public.countries("idCountry") ON DELETE CASCADE NOT VALID;
 \   ALTER TABLE ONLY public."countriesTopics" DROP CONSTRAINT "countriesTopics_idCountry_fkey";
       public          gpp_user    false    205    3253    203            �           2606    32981    documents documents_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.documents
    ADD CONSTRAINT "documents_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 K   ALTER TABLE ONLY public.documents DROP CONSTRAINT "documents_idUser_fkey";
       public          gpp_user    false    3275    207    215            �           2606    32986 @   nationalitiesLanguages nationalitiesLanguages_idNationality_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."nationalitiesLanguages"
    ADD CONSTRAINT "nationalitiesLanguages_idNationality_fkey" FOREIGN KEY ("idNationality") REFERENCES public.nationalities("idNationality") ON DELETE CASCADE NOT VALID;
 n   ALTER TABLE ONLY public."nationalitiesLanguages" DROP CONSTRAINT "nationalitiesLanguages_idNationality_fkey";
       public          gpp_user    false    212    211    3267            �           2606    32991 9   organizationsUsers organizationsUsers_idOrganization_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."organizationsUsers"
    ADD CONSTRAINT "organizationsUsers_idOrganization_fkey" FOREIGN KEY ("idOrganization") REFERENCES public.organizations("idOrganization") ON DELETE CASCADE NOT VALID;
 g   ALTER TABLE ONLY public."organizationsUsers" DROP CONSTRAINT "organizationsUsers_idOrganization_fkey";
       public          gpp_user    false    213    3271    214            �           2606    32996 1   organizationsUsers organizationsUsers_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."organizationsUsers"
    ADD CONSTRAINT "organizationsUsers_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 _   ALTER TABLE ONLY public."organizationsUsers" DROP CONSTRAINT "organizationsUsers_idUser_fkey";
       public          gpp_user    false    3275    214    215            �           2606    33001 9   structuresCategories structuresCategories_idCategory_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresCategories"
    ADD CONSTRAINT "structuresCategories_idCategory_fkey" FOREIGN KEY ("idCategory") REFERENCES public.categories("idCategory") ON DELETE CASCADE;
 g   ALTER TABLE ONLY public."structuresCategories" DROP CONSTRAINT "structuresCategories_idCategory_fkey";
       public          gpp_user    false    218    3249    201            �           2606    33006 :   structuresCategories structuresCategories_idStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresCategories"
    ADD CONSTRAINT "structuresCategories_idStructure_fkey" FOREIGN KEY ("idStructure") REFERENCES public.structures("idStructure") ON DELETE CASCADE;
 h   ALTER TABLE ONLY public."structuresCategories" DROP CONSTRAINT "structuresCategories_idStructure_fkey";
       public          gpp_user    false    218    217    3277            �           2606    33011 2   structuresImages structuresImages_idStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresImages"
    ADD CONSTRAINT "structuresImages_idStructure_fkey" FOREIGN KEY ("idStructure") REFERENCES public.structures("idStructure") ON DELETE CASCADE;
 `   ALTER TABLE ONLY public."structuresImages" DROP CONSTRAINT "structuresImages_idStructure_fkey";
       public          gpp_user    false    3277    219    217            �           2606    33016 8   structuresLanguages structuresLanguages_idStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresLanguages"
    ADD CONSTRAINT "structuresLanguages_idStructure_fkey" FOREIGN KEY ("idStructure") REFERENCES public.structures("idStructure") ON DELETE CASCADE;
 f   ALTER TABLE ONLY public."structuresLanguages" DROP CONSTRAINT "structuresLanguages_idStructure_fkey";
       public          gpp_user    false    220    3277    217            �           2606    33021 !   structures structures_idIcon_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.structures
    ADD CONSTRAINT "structures_idIcon_fkey" FOREIGN KEY ("idIcon") REFERENCES public.icons("idIcon") NOT VALID;
 M   ALTER TABLE ONLY public.structures DROP CONSTRAINT "structures_idIcon_fkey";
       public          gpp_user    false    210    3265    217            �           2606    33026 )   structures structures_idOrganization_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.structures
    ADD CONSTRAINT "structures_idOrganization_fkey" FOREIGN KEY ("idOrganization") REFERENCES public.organizations("idOrganization") ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.structures DROP CONSTRAINT "structures_idOrganization_fkey";
       public          gpp_user    false    213    217    3271            �           2606    33031 6   usersInvitations usersInvitations_idUserRecipient_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersInvitations"
    ADD CONSTRAINT "usersInvitations_idUserRecipient_fkey" FOREIGN KEY ("idUserRecipient") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 d   ALTER TABLE ONLY public."usersInvitations" DROP CONSTRAINT "usersInvitations_idUserRecipient_fkey";
       public          gpp_user    false    3275    215    222            �           2606    33036 3   usersInvitations usersInvitations_idUserSender_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersInvitations"
    ADD CONSTRAINT "usersInvitations_idUserSender_fkey" FOREIGN KEY ("idUserSender") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 a   ALTER TABLE ONLY public."usersInvitations" DROP CONSTRAINT "usersInvitations_idUserSender_fkey";
       public          gpp_user    false    3275    222    215            �           2606    33041 #   usersTokens usersTokens_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersTokens"
    ADD CONSTRAINT "usersTokens_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 Q   ALTER TABLE ONLY public."usersTokens" DROP CONSTRAINT "usersTokens_idUser_fkey";
       public          gpp_user    false    215    223    3275            �           2606    33046    users users_idNationality_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_idNationality_fkey" FOREIGN KEY ("idNationality") REFERENCES public.nationalities("idNationality") NOT VALID;
 J   ALTER TABLE ONLY public.users DROP CONSTRAINT "users_idNationality_fkey";
       public          gpp_user    false    3267    215    211            o   t   x�U�1! �^q�C wHycc�l�ԙ��o�>`�i�j�L@+p�
�$�V���ܸ���:�n�k�B�F0����diP�UնU���^|,��1�������y'      p     x���1n�0Eg�� R�%k,�t�ֵE�M ��\*���*gɚ����Y0���*�%B�^�e�]�ڢթ���)H-
�[�KMDa�;o;��.����!G���[X.C.qNj
���~�d(V%�[��h�i��N��������Y��9aX�WV�}?�W����a��O÷�[���`1
�7�
��׼4�9�k�'dOҸ�o��lJ�&�۱�� 2 5�9sF˯=��^O�r����Ǐc�~ކa��C�      q   �   x��;
B1 ��.+��'��bmk��dAЇ�����v��5K2M��
hFЛ1>��^�e}^���G��C�< �X�2��^�g��������
��-�L��>�'�V����X����P�>�Z	:M_�d����_}�S���;2/      r   z   x�����0 ki�LJ��!_�@�"H��c����pg,.���S�UV�������:O�H�L���Z�^��<�(����ڔ%�� �:07w��e���>~�ī>n��/�4       s      x������ � �      t      x������ � �      u      x������ � �      v      x������ � �      x      x���ǖ�PbD����9�d/�"��w�,r�z�3�݋Vh	�{���6��0���� �Ē4�gZ��?1J�<M0�H��U����ͺ%���G�l�5CR����;Mւ����Y�>!�S����;^-x�{��{Ȝ�7l���ީ�����DaVe�r�C��!��K���R�<�g��w]��T0{\v��N !��S����-�̵��B$0RV�>��xb�C�9+���^"���\��C�8	bn��-~� Z�� ��K�h��2��N@�/˿o�BG��ȕ ��,�r� H@�l���=o��%J:��^/A�EV� ��U}�=�BxL�NٵQ�O��-ks�z�.j<K��\lg2,���Ğ�;x�F�0p� |0h>4 T{x�V�`���v	�Z
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
�#%;n��+3 #`�2�eЁ�������/��W�q��_��5�E�w��#���s01Vs���e�X��^� 7�-/�c�LU�fA/���=1f��~.���=���<��p�j�-���-��op�m��c�@���͙[���5�i(ۘk͏#C�^G���3�&&��4l�|实��W������8.cZ���y�V�t���W��̩��a<��!�9��_�k��ƅ��$@����g�%͌�ϕr���ǋ�FT�_^g֩��(����\�ZI�p�����"K��Y�`��BȘ�]��5u��=)Prut�b�ޓ�"�WL�CNDZ����΋��o��C|���\h��f��|�}4:��-�T�C+�y�k������> ��SR�o}�8��I�a��#h�_T�~�b~I��/ҸN�w�w�H6��� �#ڦ�Z�UuA��x�4���B{���v�D��	���>�>l�p�PN`{���z@̣'-���4��7_sx=4�@���*	W�+�eVr 
��v�0	|�飐�/�c��8h���(�� �_�<�&�F��O���=(6�
h`� �ϝP;R�T��y �H���=h(�~�|[c�2�7���z��9��I*&��FPo��͜�~0X�8�~| 	K� n�)�� �r�D�x������EGt�ЋJJ��{TB��&?�6��'Q_�( �~�Ϛ�����)��o����7����T�;�?�HM��㺧������B�)����.�������AIJF\g(I� 9�(x�����o���L��T��'�<*��C���9�d�����h���{\<�q ��RJw���ٱt$�ىor;ve�M>�qM}��%)^�|R��y�)�C՜b�#�c��Ȏ\Z��%��58U�������[��Z��l�u���x���
!�qYLD�u�#�q�i��>�}9�68u�K�}۶����u<�w'x�eӸ�:���,���q��kض�t��o��"�� Q7A�KB�Yd�m!
��5����4A�����(z���V�[Zeŝ�Z3*�j�ftaS
3��+:�\�o{��N�-�7΋�G+")M�	r��C3d��H�� ���/j�.�x�%a�~;���ЇD/�!�?�	 �5ef��mS�nP�`{�	�U�o�1ֳ���-|�*�NN���G��to�a��m�D��>B��w3(n�jD!�N`O�G��I�d����+m���eܗ~���.�ߒ��/Ew�ەs���c�'`��f���OP5�=��iBKI� ʌxr؃z͘�N����S���/uw�CT���b5�<?z�{L�)� ���EϫP<�bH�5�}v/L���蘜䬰^�R�2ĬAV]�B�~�5�0Љ.��l<
�i�Y���i8	�vK����;+;ML�FjE�8�{I9��z�����K=7�O�]ۏ�Sf|8'�P@�<��#�ۈHl����Ղ��Zf?�}�c���S��Xw=E�9�|qB_��2�Pؔ�cY��ݱ��<_)����pk S���uE�?l��rY��{
�K��𬑪Zį`!��x,�܁�Ef�4�/uk9ˡ�M;�=�A������w045e���@�eZ~º��_�l��6ʈ�5|G]��A�<�����XS���:6�Lt�0��GF}X��ø��?Dc�Z��q�5��C�W+�ȼ��
�K�+���0�L�����<T9��
�)�cz�!W����>N��1i�)��Ey	֛�t|�v5Z�A��0P�Hz��ε��N^����S!	�mgC��v��s5 �0mj���
c���	Vd��ag�|*�SZ,�)��ߌ�1�)����c�q�UU�Q�U��&��\-��D����^�0}�]*{��*-C)�Y�C2k�GW׳�uϿF�	K�������&����"ܞ�{2�3�e�� �o}9ŏ3�xLN��5��"xռftct�9u��Gӗ�7UC���4�O�ƽ&h�h6��a5�.W� ���	����f���C�ql��]M���&�Jh��-��c�L��%��O{�[I]0��+.;R՜�,�DR�$"�moN=*b����GeU��p/�r��Q+i�YI�p5$�z�+�ߘB��P1ֵ���Wr�ZA��a�C��Z�q�d��5�<���4�ޑ���*a84�xu����*��c������-���y}�o-��;*_Cs�D�P3u�ZOv��3�:�ij!WqV8�N�#T������m�\ꊋ�D��sѕ�%Ӂ�P	%��+���	���)�[*�ivLܵ���b|���b�mViٸ�P9���a^�|�}M[ȶ�a��0�q�W*o �e4g3��?A�6�%���U�/t>N�ؑj�r�u��=�cQ�6�bM�4�E��2ȷ���6��@�0r���'����6��:�\31�I� t��WO���6U��w�ʉ��/o ��r�g5?s`� 0(��M mg�;S} Ǔz��2�$u���j@�Y�q ܈����
[@@6�\���t n>�̞�r,�������L��˩nq�*�����ČHk�Yh�6답�R���}��I>��m"���>0���~7���e.�8�S�óռ�U�D���y+����u8�8A�<�)j��Yq�Rt��.�9��7�ꛎ�쨲g��@�.jD��OwƱ�I��R������G;͞s}!Ye�s����V��{�]��)��u�%�>*�=��[����)�9���BV0,O����y�JO�� Ȫat���^jՉ��Y����y�R�ZNWS��:ZN�ֲ�Z1ƭ�l����������m3�����'��C��w.>��^jU*d��f| ��%78�̅]���Vh�a� 	����VJrn���C�k�2�}ޡ7��UH�ۗ7mO�j}H 3�n�9�Z]+;=(,��lc��iq��Ha����������g.��S�p�aD�H���������P�.��2�ߘ�H<�m�1��sS.���
����������	3�Z� �1ja5��5`R��e�Bb��c_��HF��_�Xּ���	�hft�sH�Xd|��lI>l�M9�V���@47�+�L[�k ��p��E+����(��"�c�,!K��3��@��>�p�jzV�|Y�h��i�z�� ��f%�y��F:lׂr p�d�`���W�sJ_7�d�1�=_��&Y���{um�y���ې)S�[mR5Pᐭu|���*@�S��eJi�R�IL�GS,�U`���_?�N��^	�0 U;�<���Y��t��l[/5�~�~����v�V�>�5��(.F��w�p��T���ޝ�/������RA]$?���������HNa5��eu;��jik���"��k���0�3%�,���6���̛��KV��[Ύ�H��]Vj՜y8lͲ�5E�W��M�O}��8`k�"q�^�u������5�=����t|g2��{E��עn<�A_a�IX�1�KU�����f�舯�W ,,�<��lJ��`���:,�^4g��.�ɑIu�O�)����J��ya�f	~s�e����Tà�q}~'>Ú�>cw���E��z���%����͆���~Z��ز�~\����i�ǀ    ��p"=�,�k^�6�ԭ��|L�0�p��W���>c��W}Y�ha��b�+Z���1�;�j���W1�ɋ �0ǞU��e|v�3ԇy������6�h9B7N���:�� �*>����ynK��g��@-�;�l���J��P��MU44�Q��f�mތ 	a��"���\8J��N7eG�*������
�����j� ���/X�Z�f3� ���urW	��;N�.�(f?�;?BXU�Q��Q���&��	��>�ɝ&��Gm��w��J�0�",��X���W&Ƿ��4Nٽ7�lj{IF���܇��>d,��a��j�BU�n!�S��+������+Q/5X��I���P��c^Z�.��R�_��1��M�z� ��� '�W�-����d�9�ffn>BYK��G?��kFY׮`�kk��s@� l(�����|G,�^�����?R���{n���4�Tf�n*w�����x�kmf.�[���!����O�:H�b��%���� ���mmT�����aM� �P��s|�Dr�+Vl��0jb�Ԇ��_lI�o�{��@�$j�$�(>�X̔W}s��Xm��}V�z����.x��j�kv�/:�2��
3���oq���$�n3�S
OF��!��ԅu�ok��ֵ��=���Ȳʎ�rD�����xsS�������Wk+KUS������2x���ٟ���.�O��O���_$6�pF�U�OY�dkG\XM��O�(�;aN�\[�μ篍�C�:���A�N'1fO c�����1�M�0��LaΞ��w�.���nN�zZ�A�nW�(o��f�q�2���[O���\�Б�w�+ۻ�̶lp~���|���=�&�L�����;������f�l`l�u{�]�����A��~(��B��\��v��?K�S��/���ө�b�Ng������ָ�0����˻M��	�|�$ȉ
���+E���/�\�W��N���Zg���|<���8��G��f���_z���Aw��
5�-8�����E�=��QnI_?���ee�,�"�B�_ ������Qć����b�t�`�
>Uɲ����(`�S�~�2Ø��`���og�#!j�����z�f FH����	o�_�}�k"b��߽�w���m�%i�a�����[K�l�
��/�ˣ�����QVϱ9���\'LO�B��J��dl:��@�=~;~h��=y}�z/��}�6�DX�
<�y5`dI�O��o_C�NW"׏��a��!����W�R��Lַsb��/�y�������,��1(Yu,M0�
������eέh��T���>���
��!W?��Kq�p0j2b${��N#�}����-�0��6������|9���G�ϙ���{xRd=�aބbi�Ӑ���@Ճ]��c���|�̍�X��(d>j�I��~KlZ\�"7]��` �M�}����Iv,Yqlz5��w�ꦦq9�W�w=7h����ێ&�c��{���.��~���wL�Y��[&/˒~�SY�������n��"�n%jvj�/\"tL�}�9iQA"o2G`�9HGά�A0���Y�M�j�U�n�'ƙ��l�Kg ��Ən5��E�H���lh�hِ������W..�i&�/�έ �R5L��a}H�VV���^%Y����2�OI��)���)�k��Ɠ�5�_��-闵�{�����^Z|��|�x�ȡ�*V7�' vA� �[�F�����#��0yuP���,C���&�Z+ѓ��S�����S�[ēM�
z�HQ@�8����/>E�o�6�.U���<�;﷙۬��uApV����/�,YFQ`p���S���($9�Rs��J��$�ɫG�mC�/	�l����q����Kdr3{}ƆE)�T4�����j�����W���N�=N���+��V1�8�������?
T���q~�}c?�!L�YT�nr<�v}�Z}�cΥ𽡺o�@ek�-5|	�ߖI�9Q#�2���1�Vk�R9�埗(Җ<T׺�hz� P�*l�Lԅ���P�e{yB���i/��~�O�M�����=�&�i}�*�`�" �p�����L�YR�kn�Oq0�
d`�7���`*8�iT��(I�`<�;#k�+�����L�_ú����!��[��H[-�#ET�~��b,;�y�}BP�����@�A�����A���fF&��W� � ���鮖,�5�oP�J��J���>4$=�0����hd��q�6q�AJv�|�y
�_�9�%�;܂��� �^p#��N�G��hP�J˴f0xUە&���F#�jB٘7W\�J�))��N���;�J��`�B��ߏ`
���uG���go߭���F靚�����%�w��А��Z=�|x'�Y�Md�7y�J/�D��aɼ�wv�L׉r���ݡ<f�e��K.rR�g�1Ǿl����cb.�E �[T�X�%��"?�Ihzs�(�b���`1�ʎ��p2�JF��J�P�{ۖ{�^O�=�ۨ?�>�^Lo�� r��|�ƈ5�Ja�=g!��ٜ��տ�|�������'�h�3�L�����|Bb��[d��
�;�!�q���k�3`��g�R��!&��Q��+��+�ᦉ�,�"�!`�Xs>ϟSs\����a�>�5!:&���N�����!rh<i�j�?*Qe����`��aa����Rj���+�����Gne$���-�z����x���S:��`�@�Y���l�ǯs��g/�&P�x�L�R� �.���;#�kC���2�R��������'^�f��U�M�v[���o������)�
��bO�$x.��˼=A3�58%���Md����g�#tV��-�W��T�DW�U(c�U��8v��xAń�3r��(�o�Hi�풁u����=i��*ٱ/��	����&3	�(�`v��%� �cr�`����")H�&]�8���_*J6�}�Y��IXΠx����d�0��@�/���.{�%�����_���ߎ%t�����^��l}��ֹ�Þ���ё>ź������Gh�(�6A�tע_�>�aV�<$���7$*=G�vx�G�?��a��q�H��M��=�:R����@��ŁD06�b�K/��|3r֦
<T�Ƞ~6#��{�}����^�0O��	 6��d��Y�Ɠ�ȕ��
�+1����ϥ��B�xh�z��T��䤪��-�D��)�=��>�|��U����Va�,����<�|֒mMׅ��{}�6�P�r3�����m��4��[JT���#�u��M�6��2���0"��B�5�:� E�88����Cq��r`�EC�6bj�k0\E�Wnr�|	@W������zQ�x#ƍj��w����K2�@�I2��Q���1���@����4��b�0�%�e>�N���7�0�v�u=yKd������6\�0�0z#���sw�=P�|��4T�Hi�� H��o&p����O(M�Y��od�D��`*u`,�wC���w��{1�&������;��*�6h^U�2�t�Jn?�(-F���o�M�����ً�ֵI߳��GdA��'��淿�����[���,�6�.f���6�8�V��!=�]?�Oa�n�I�=:0�2I#���I�o9�[�+��-�'5����LѮ>�I����.�`|�r�������&	$�p(� վ����}��"r��ss�n���9a6���?7GWK#�|1����g@��{���6p���g����l���l�oL�M|yݑ�c���o���(|����s(V�%��\Y!��oH�w�'Iߑe�*/Ȯ���4L/�V�l�x��M�1u-WB�?�t)��d}$��pbH�1k�%KW�N��8H�９���TA��`)LB��O��Z�����}G�� uu�;p�Ӆʧ�T����rQP��kc�n�����M�pJM�8��� �	  ���8Oİ�9a~��bC8�;�V{��9E�/!���ިeg���4�@��i5kҁE�7.�����0�^�}��e�Zg�N����V�I�b4��ނb�#�A9��Cr ��� q� �1i�"_��Ȍ5���h�HB �<��~6�~`5�,��t~���]�)��@.Nal�����T[����G8��@(���>-�gz��*9������픢5��d��Aq�Zz����x�`�u03����'Y$��bp�%�w��r�XO�Ec�� |]�S�m�p+���<�
��I��%�#r,�����C�g�ď�� D���}%l�7�kc� �f6��lh���[�ҘO:^8�CGңS<���P>r.oƐ�R�M+\-X��5��U���I�r�X���_�[ct��o"LZk��"��z���<ɮE/3��
�vv�'��ÿB���I��ܞ?����@:q�Y����[�;DO��ȑ��Ѫ.���7N��w���Q;s�0�~�p�@9Q'�u8*W:�
�_�b��z���q���<º�.R��$3.�ᳰ�*��{Syͮ�NR��$������� �v��{M���p*�;F�h��Ńr��� ;�9���c,��X�G<&Ҫ�Gk�=��~	N����+���{)�,�ۥ"�'�+�B���j�h*��qǛn��[�?R S'I�3�4'�'��f�0��H@1�}�Q���ó���"��Bg�.��a�f�$��W�����Ǘ�������o�Ѳ��L%OO���(�|��e���}��|�w�~�!�P챻Q�5�� 6�R�,Fx���*��|jS���i�����;V9�ФɌ��7��)��;r�$fA�-9.T�B}��T	O~���"����پ}S����`(,��FF�N\<�ߴ��vG$e��1����}[H�G<��j="�	����Z���~M�!�]���;K�r�y|��d�>6�!���nԉ�H<��_�����跓w��"�Zaf~�.|�
~�[g�B�o���5=��o��L�a7"+�<♎�rc�?_�:<�	N���P�������8\���r"ܛG��;9�-����z�P"O����2�#u�c|���䃤C�P����f�y��D׵��f�nu�ʒZ��8�JQ({mK���E��#'�r�_W�Z5�q%4%���d/~dҹ��#��.��	�V�(��6^�ϱ�5��y��Fȭ����qD�����GD���U��9��U�U�iKAe?@��d�*A�)����L�:���3���)���x���a
8�[�m�K)�����sg�a�跽ܢ�w��\��[��c�M�����K�۱?:%��_)KZsI�t�)I���W2lY���|IX屼�pde`�t�(K�ӖM�& t�Gr�t�����:IB]=�+
d��:W�#�;�u��ӱS���
��ݙ1�W��x3?ـk"_��\��Eb[C�����C�$�:�ۥ2.]���=n�=Y�}���e��6zڮ�|���rH*�hZ����5�K1�s>:ȇ��������X�B����o}��&�,��=�@
|���1(n���R�7������B.�9�_>���H:-�:�|�>h_�f�ζ�n�TrJ3߄���QUK��v"��E4~܎(�4�q8�����~�1��4��҉s��$�jm��<����H�µ,x ���?����8��Ӷc����
5�\x�w��s����Xw4:� }�nk�U�F��NH k<97{���~�6mS��]��u��.3-4�rm���a��V����F�G#���:�|��������(Ӥ_>3r!(yb�<��Po_�m���:yQ�{�Vp>�$�hz����&?�'G���U�s@��w�4mj�u��V�0��׬�m���G��C�O����Љ�bV�q�6�����P�#�5X��>�х4nn�`GHgOU�|RIufbk�T����v���̞�=M6�j�N{+�=�:5.P��������0` òMb�Z�j<#
��Χ �>L�+��lt��V��:�Eݔ^�~����t�ni_!CP�x�������I�Q~t�3��u<�$�í��ϚAUS�{�P�q�J���Ԍ���p:y����pj�����l�k��{_ 8��9z`w�e�01{����G�Oz�2�H��[�`Ř����_���z���z�Ӯp�mɖ0�#jV�Ծ�v������||�Z<�L3Z��w��0W�bCBM�������8?����ҕ̚�_fd%��~-r�w��z�r�8�d/��ª6�$�-�����2�Ac�dP�R����w �]�\{n
����*�E�AU|m-��PB{�x*���9&g|���M�'�f��!E�K�ᗤv�@���K1/������]���4�h*�*��K��e�o��������Ͽʃ��      y      x������ � �      z      x������ � �      {   \   x�Eʱ�@ �:L���2��6�6�����e~����݉=LQJ?̊$�J��u��r���0X�;2jBiT�1ɭ��X���� 5 �      |   �   x���=n�0���>F���$�Ǟ�H:��	<�O=}�;d��5���	�K���(L��袙�&êzG�*�!K�6b��I�DM+K���P�G͐�S�M���~�m��c}n���n����x��阃�F}G�#����s	��Lz^�T$1�#X�d�L��������<���DOp      ~   �   x����N�0���)���8q��`���tK�]e�������܁���-��9�L�b�������O�fL�>��A���0�e�ϰ�v'�����iZ8����(Q�eY�j�U���5D�����x�Jm	��fĤcʝ�|U�S��QQ'�t��уN��t׹�T���:�ǚa�m�+�y?�,�7.�o�&��^6X��t��p��d;_-ѶV����o����6M�,�e�         �   x����q1��\�"�@.r����U�1U=�N6�6�8���"�0�jݙ�Qq��`|��;��%wc�	�ON5�E�
Aj?�D�}�������� B<�����^��������yG(�'�X��]���H��6���R��D���C��$t����5`j	%��2Q������y�?�VWK      �      x������ � �      �   Z  x��SɎ�@='_QG�$��#B� ������3�z������g�Y�tU��^O���p���x8ݙ�kwa6�i�N�u��͡�\�̉��w��p�΃��2�}w=��=����q�)&�s��lt1Q�B���Đ�)5[�5�$N˞��oV���f��:��F�$͏U��],���D��fq=�n����}�EW�̥�:0�y��1=�`j~����5P�Ω�R-���ʖ��d�Յ�3�a� ���t�5���� �JL���Q�gFm�:H����{��6`��Lxv�1LS&��$��͏֟���U�ߜ�Bp�T�9Є&LQ���&Z�4�N��h�s���&=S@5�e�7-,�=}KѨ��9`37��|7;tGs�s?pǧ������:3M���\SS\��QS';z hB
!O͢�hy��L؁k��icְL	aS�*>��)#L���K >E2�b�����<�*�Ut������>q&����^=�f�ׅ�c���%��G׸�E��M��/k��WT�kl׆�y�
�B�'�B<��28����s����tB?��M��� D-$��7��k�������~���m�z�      }   �  x�u�K��@�u�;�6�6��萌_Sjj6�_
"Mx��>�&�����8���:�.��]G��b&�0vm�H�Y&�R�t)+ht�&E��T� e�4i� ������������aH̡_�m�_���7g*g����%�����&�䁌���X������o@�	c�ۘۦ�-�3���H!8u���K���K�����5�s@%����HJ�����&U���y�����m��`.��X����k�)Z+����[oqJK�;6�\a��Mʅľ�%���!�T�2Q[�
-�:�5�0��|'t1�w|D\�M4���#�*އ���Mvz��n2�2�I��ie��ɨ�i��1A16�u���l���Q�|&�t,��Ϟ�F*(4�B.����$�?;�ݻ'�6��g#m��z�N�U�Ͻ��6���`v�8��aŲ�qF�U0��tyؾ{�C|՗��7c0����>      �      x������ � �      �      x������ � �     