PGDMP     #    ,            
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
       public         heap    gpp_user    false    2            �            1259    32820    countriesTopicsLanguages    TABLE       CREATE TABLE public."countriesTopicsLanguages" (
    "idCountryTopicLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCountryTopic" uuid NOT NULL,
    topic character varying(100) NOT NULL,
    description text NOT NULL,
    language character(2) NOT NULL
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
       public          gpp_user    false    213    214    214    215    215    215    214    213            �            1259    32878 
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
       public          postgres    false    201    218    218    218    201            �            1259    32889    structuresImages    TABLE     D  CREATE TABLE public."structuresImages" (
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
       public          gpp_user    false    210    210    210    213    213    217    217    217    217    217    217    217    217    217    217    217    217    217            �            1259    32905    usersInvitations    TABLE     
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
       public         heap    gpp_user    false    2            n          0    32799 
   categories 
   TABLE DATA           D   COPY public.categories ("idCategory", identifier, type) FROM stdin;
    public          gpp_user    false    201   ��       o          0    32803    categoriesLanguages 
   TABLE DATA           n   COPY public."categoriesLanguages" ("idCategoryLanguage", "idCategory", alias, category, language) FROM stdin;
    public          gpp_user    false    202   �       p          0    32807 	   countries 
   TABLE DATA           G   COPY public.countries ("idCountry", identifier, completed) FROM stdin;
    public          gpp_user    false    203   �       q          0    32812    countriesLanguages 
   TABLE DATA           j   COPY public."countriesLanguages" ("idCountryLanguage", "idCountry", alias, country, language) FROM stdin;
    public          gpp_user    false    204   ��       r          0    32816    countriesTopics 
   TABLE DATA           V   COPY public."countriesTopics" ("idCountryTopic", "idCountry", identifier) FROM stdin;
    public          gpp_user    false    205   D�       s          0    32820    countriesTopicsLanguages 
   TABLE DATA           ~   COPY public."countriesTopicsLanguages" ("idCountryTopicLanguage", "idCountryTopic", topic, description, language) FROM stdin;
    public          gpp_user    false    206   ى       t          0    32827 	   documents 
   TABLE DATA           �   COPY public.documents ("idDocument", "idUser", title, bytes, "widthPixel", "heightPixel", "fileFolder", "imageFolder", extension) FROM stdin;
    public          gpp_user    false    207   .�       u          0    32831    encryptedChunk 
   TABLE DATA              COPY public."encryptedChunk" (id, "idUser", name, "uploadReferenceId", "chunkIndexId", checksum, header, iv, text) FROM stdin;
    public          gpp_user    false    208   K�       w          0    32839    icons 
   TABLE DATA           >   COPY public.icons ("idIcon", name, image, marker) FROM stdin;
    public          gpp_user    false    210   h�       x          0    32846    nationalities 
   TABLE DATA           D   COPY public.nationalities ("idNationality", identifier) FROM stdin;
    public          gpp_user    false    211   Q�       y          0    32850    nationalitiesLanguages 
   TABLE DATA           z   COPY public."nationalitiesLanguages" ("idNationalityLanguage", "idNationality", alias, nationality, language) FROM stdin;
    public          gpp_user    false    212   ��       z          0    32854    organizations 
   TABLE DATA           ?   COPY public.organizations ("idOrganization", name) FROM stdin;
    public          gpp_user    false    213   |�       {          0    32858    organizationsUsers 
   TABLE DATA           x   COPY public."organizationsUsers" ("idOrganizationUser", "idOrganization", "idUser", permissions, confirmed) FROM stdin;
    public          gpp_user    false    214   ��       }          0    32878 
   structures 
   TABLE DATA           �   COPY public.structures ("idStructure", "idOrganization", alias, name, address, city, latitude, longitude, email, "phoneNumberPrefix", "phoneNumber", website, "idIcon") FROM stdin;
    public          gpp_user    false    217   ��       ~          0    32885    structuresCategories 
   TABLE DATA           d   COPY public."structuresCategories" ("idStructureCategory", "idStructure", "idCategory") FROM stdin;
    public          gpp_user    false    218   ��                 0    32889    structuresImages 
   TABLE DATA           |   COPY public."structuresImages" ("idStructureImage", "idStructure", folder, filename, "mimeType", size, sorting) FROM stdin;
    public          gpp_user    false    219   r�       �          0    32893    structuresLanguages 
   TABLE DATA           l   COPY public."structuresLanguages" ("idStructureLanguage", "idStructure", description, language) FROM stdin;
    public          gpp_user    false    220   _�       |          0    32866    users 
   TABLE DATA           �   COPY public.users ("idUser", "userType", "firstName", "lastName", email, "emailConfirmed", password, "passwordRecoveryToken", "passwordRecoveryDate", permissions, "idNationality", gender, birthday, "idIcon") FROM stdin;
    public          gpp_user    false    215   j�       �          0    32905    usersInvitations 
   TABLE DATA           �   COPY public."usersInvitations" ("idUserInvitation", "idUserSender", "idUserRecipient", message, "accessLevel", accepted) FROM stdin;
    public          gpp_user    false    222   >�       �          0    32912    usersTokens 
   TABLE DATA           U   COPY public."usersTokens" ("idUserToken", "idUser", token, "validUntil") FROM stdin;
    public          gpp_user    false    223   [�       �           0    0    encryptedChunk_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."encryptedChunk_id_seq"', 2, true);
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
       public          gpp_user    false    202    201    3248            �           2606    32966 4   countriesLanguages countriesLanguages_idCountry_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."countriesLanguages"
    ADD CONSTRAINT "countriesLanguages_idCountry_fkey" FOREIGN KEY ("idCountry") REFERENCES public.countries("idCountry") ON DELETE CASCADE;
 b   ALTER TABLE ONLY public."countriesLanguages" DROP CONSTRAINT "countriesLanguages_idCountry_fkey";
       public          gpp_user    false    204    3252    203            �           2606    32971 E   countriesTopicsLanguages countriesTopicsLanguages_idCountryTopic_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."countriesTopicsLanguages"
    ADD CONSTRAINT "countriesTopicsLanguages_idCountryTopic_fkey" FOREIGN KEY ("idCountryTopic") REFERENCES public."countriesTopics"("idCountryTopic") ON DELETE CASCADE;
 s   ALTER TABLE ONLY public."countriesTopicsLanguages" DROP CONSTRAINT "countriesTopicsLanguages_idCountryTopic_fkey";
       public          gpp_user    false    3256    205    206            �           2606    32976 .   countriesTopics countriesTopics_idCountry_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."countriesTopics"
    ADD CONSTRAINT "countriesTopics_idCountry_fkey" FOREIGN KEY ("idCountry") REFERENCES public.countries("idCountry") ON DELETE CASCADE NOT VALID;
 \   ALTER TABLE ONLY public."countriesTopics" DROP CONSTRAINT "countriesTopics_idCountry_fkey";
       public          gpp_user    false    205    203    3252            �           2606    32981    documents documents_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.documents
    ADD CONSTRAINT "documents_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 K   ALTER TABLE ONLY public.documents DROP CONSTRAINT "documents_idUser_fkey";
       public          gpp_user    false    215    3274    207            �           2606    32986 @   nationalitiesLanguages nationalitiesLanguages_idNationality_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."nationalitiesLanguages"
    ADD CONSTRAINT "nationalitiesLanguages_idNationality_fkey" FOREIGN KEY ("idNationality") REFERENCES public.nationalities("idNationality") ON DELETE CASCADE NOT VALID;
 n   ALTER TABLE ONLY public."nationalitiesLanguages" DROP CONSTRAINT "nationalitiesLanguages_idNationality_fkey";
       public          gpp_user    false    212    211    3266            �           2606    32991 9   organizationsUsers organizationsUsers_idOrganization_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."organizationsUsers"
    ADD CONSTRAINT "organizationsUsers_idOrganization_fkey" FOREIGN KEY ("idOrganization") REFERENCES public.organizations("idOrganization") ON DELETE CASCADE NOT VALID;
 g   ALTER TABLE ONLY public."organizationsUsers" DROP CONSTRAINT "organizationsUsers_idOrganization_fkey";
       public          gpp_user    false    213    3270    214            �           2606    32996 1   organizationsUsers organizationsUsers_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."organizationsUsers"
    ADD CONSTRAINT "organizationsUsers_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 _   ALTER TABLE ONLY public."organizationsUsers" DROP CONSTRAINT "organizationsUsers_idUser_fkey";
       public          gpp_user    false    215    3274    214            �           2606    33001 9   structuresCategories structuresCategories_idCategory_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresCategories"
    ADD CONSTRAINT "structuresCategories_idCategory_fkey" FOREIGN KEY ("idCategory") REFERENCES public.categories("idCategory") ON DELETE CASCADE;
 g   ALTER TABLE ONLY public."structuresCategories" DROP CONSTRAINT "structuresCategories_idCategory_fkey";
       public          gpp_user    false    3248    218    201            �           2606    33006 :   structuresCategories structuresCategories_idStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresCategories"
    ADD CONSTRAINT "structuresCategories_idStructure_fkey" FOREIGN KEY ("idStructure") REFERENCES public.structures("idStructure") ON DELETE CASCADE;
 h   ALTER TABLE ONLY public."structuresCategories" DROP CONSTRAINT "structuresCategories_idStructure_fkey";
       public          gpp_user    false    3276    217    218            �           2606    33011 2   structuresImages structuresImages_idStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresImages"
    ADD CONSTRAINT "structuresImages_idStructure_fkey" FOREIGN KEY ("idStructure") REFERENCES public.structures("idStructure") ON DELETE CASCADE;
 `   ALTER TABLE ONLY public."structuresImages" DROP CONSTRAINT "structuresImages_idStructure_fkey";
       public          gpp_user    false    217    219    3276            �           2606    33016 8   structuresLanguages structuresLanguages_idStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresLanguages"
    ADD CONSTRAINT "structuresLanguages_idStructure_fkey" FOREIGN KEY ("idStructure") REFERENCES public.structures("idStructure") ON DELETE CASCADE;
 f   ALTER TABLE ONLY public."structuresLanguages" DROP CONSTRAINT "structuresLanguages_idStructure_fkey";
       public          gpp_user    false    3276    220    217            �           2606    33021 !   structures structures_idIcon_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.structures
    ADD CONSTRAINT "structures_idIcon_fkey" FOREIGN KEY ("idIcon") REFERENCES public.icons("idIcon") NOT VALID;
 M   ALTER TABLE ONLY public.structures DROP CONSTRAINT "structures_idIcon_fkey";
       public          gpp_user    false    3264    217    210            �           2606    33026 )   structures structures_idOrganization_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.structures
    ADD CONSTRAINT "structures_idOrganization_fkey" FOREIGN KEY ("idOrganization") REFERENCES public.organizations("idOrganization") ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.structures DROP CONSTRAINT "structures_idOrganization_fkey";
       public          gpp_user    false    3270    217    213            �           2606    33031 6   usersInvitations usersInvitations_idUserRecipient_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersInvitations"
    ADD CONSTRAINT "usersInvitations_idUserRecipient_fkey" FOREIGN KEY ("idUserRecipient") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 d   ALTER TABLE ONLY public."usersInvitations" DROP CONSTRAINT "usersInvitations_idUserRecipient_fkey";
       public          gpp_user    false    215    222    3274            �           2606    33036 3   usersInvitations usersInvitations_idUserSender_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersInvitations"
    ADD CONSTRAINT "usersInvitations_idUserSender_fkey" FOREIGN KEY ("idUserSender") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 a   ALTER TABLE ONLY public."usersInvitations" DROP CONSTRAINT "usersInvitations_idUserSender_fkey";
       public          gpp_user    false    215    3274    222            �           2606    33041 #   usersTokens usersTokens_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersTokens"
    ADD CONSTRAINT "usersTokens_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 Q   ALTER TABLE ONLY public."usersTokens" DROP CONSTRAINT "usersTokens_idUser_fkey";
       public          gpp_user    false    3274    215    223            �           2606    33046    users users_idNationality_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_idNationality_fkey" FOREIGN KEY ("idNationality") REFERENCES public.nationalities("idNationality") NOT VALID;
 J   ALTER TABLE ONLY public.users DROP CONSTRAINT "users_idNationality_fkey";
       public          gpp_user    false    211    215    3266            n   t   x�U�1! �^q�C wHycc�l�ԙ��o�>`�i�j�L@+p�
�$�V���ܸ���:�n�k�B�F0����diP�UնU���^|,��1�������y'      o     x���1n�0Eg�� R�%k,�t�ֵE�M ��\*���*gɚ����Y0���*�%B�^�e�]�ڢթ���)H-
�[�KMDa�;o;��.����!G���[X.C.qNj
���~�d(V%�[��h�i��N��������Y��9aX�WV�}?�W����a��O÷�[���`1
�7�
��׼4�9�k�'dOҸ�o��lJ�&�۱�� 2 5�9sF˯=��^O�r����Ǐc�~ކa��C�      p   �   x��;
B1 ��.+��'��bmk��dAЇ�����v��5K2M��
hFЛ1>��^�e}^���G��C�< �X�2��^�g��������
��-�L��>�'�V����X����P�>�Z	:M_�d����_}�S���;2/      q   z   x�����0 ki�LJ��!_�@�"H��c����pg,.���S�UV�������:O�H�L���Z�^��<�(����ڔ%�� �:07w��e���>~�ī>n��/�4       r   �   x��̻1��\<�ɒ� $�li����ᶀ�:֌r�ɂިk��hq�T'�)1(���2�d�s�8�����G+ikLKG�TP*�s�pVj{����f�#�m��
��`��r��ʝ���YJ���B      s   E  x���=n�0Fk�<�h`Y��@�I�rZ��<#��9��.R��I���|�4�޸ޭ����`��Y�sh�svƪkD�8��t���4��im�Nm=Y�>�{��k:i�*'/e�x�x_�K��]��1�|B��"��»Ĉ;P��ҩ+��A_Wx;�°e|���Ii͔�e�����e�Ң�QK�܅�<?�:�
�^�q�}f��1]����z�v�������_�x�@����3�(�N�xf�L
���x�,"ߖTD$O	��icu�i俐�z�ߗ�L9�ɴ�D�~J���c��ZQ�]��!=�      t      x������ � �      u      x������ � �      w      x���ǖ�PbD����9�d/�"��w�,r�z�3�݋Vh	�{���6��0���� �Ē4�gZ��?1J�<M0�H��U����ͺ%���G�l�5CR����;Mւ����Y�>!�S����;^-x�{��{Ȝ�7l���ީ�����DaVe�r�C��!��K���R�<�g��w]��T0{\v��N !��S����-�̵��B$0RV�>��xb�C�9+���^"���\��C�8	bn��-~� Z�� ��K�h��2��N@�/˿o�BG��ȕ ��,�r� H@�l���=o��%J:��^/A�EV� ��U}�=�BxL�NٵQ�O��-ks�z�.j<K��\lg2,���Ğ�;x�F�0p� |0h>4 T{x�V�`���v	�Z
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
�#%;n��+3 #`�2�eЁ�������/��W�q��_��5�E�w��#���s01Vs���e�X��^� 7�-/�c�LU�fA/���=1f��~.���=���<��p�j�-���-��op�m��c�@���͙[���5�i(ۘk͏#C�^G���3�&&��4l�|实��W������8.cZ���{����z��~��΀����	��Χ�EQ�IIE���%��)�m�g]2<W�a�j�/>Q��~y�Y�������>h��r�ki$1��-w7H�,žg̓ef
!cw�_n�O��M�s��@���9�{O���_1%9i�^ȣ�?>g8/�[���~ �B˄7����{�щ�\o��ZA?�\S�&0&]�q����������`8E��?XF���������_���t��7i\�z���{�H6���G�Mm����e?��hi�ŏ������|�� ݹ}8z}�
� ���� 	�9���GOZ4��p�|}8��롁� �D=� @_TaH�*]yP,��Q��{��I�sL�}q��"(�Aͤ�Ga�r`��̣o���`t�d����q�b���P��	�#�J5X�����ڳ�����ͷ5�.S~k�[O�T�<�1Iń��( �������֏ a���M6�`R. ������]B���舎zQI�~�J������҆u�$�s U�O�Y�]@���@�1E6]�M3}�3�����WŎ��$R�&���i �jjfi���F�m�( D.��km����܌��$%#.�3�$C��o�C�������7x�uY��c�E�}�\�!�@�\�k����h���{\<�q ��RJw���ٱt$�ىor;ve�|t/��\�QKR�j�����Sz��9�ZG��'6����K��kp�(13 ��鏷p�%�:]ٶ�4���<�B�㲘.� ��G���;]U�2/}��rmp꼗���mA�3�x8�o��'x�eӸ�:���,���q���m/�5�V�}ߎ�L�g D�I.	)g�a����(�N\�$��'�A&�����)?Ԋ.0Xqoi�wR�jͨL���хM)�D�|�s1���*:ն(�t8/��x��4Q&����!� ~�F���<א~Q�8v�#,���۱�'�>$z�Pi�L  �)33dl�ru�
H[��M��2�x�m���-���n�KTAur�>>��{�;�n$���25��AqSW#
�w� {�?�hMz�X%�}��Xic��h�/���$v!����)�߮��h�~�UQp�>l�*�Uc�p�
�!��$	�̈'�=�7ЌI�H�i�;E�] AJ�R�qp;D��Kx!V���á���D����_�P�����(�t]��g���K���I�
�/u*C�dե+t��X��:�^uR��G�;M?�9~?'a�n	�߾�tge����H��GaoER���^�ρ�C饞�ܧ���G�)3>��g( ~|��mD$��F����j��]-��վ�����)�g���"�V�8����2�Pؔ�cY��ݱ��<_S
�����.�@�
I�P3~����T��d�W�J�Y#U��_�B���Xʹ�<��i�_*��r�C#��v|/:z�G�8��a���`hj��Í��˴��u�%4����Sm��k��������y(�u/ﱦr����D3��Ø���ayrL�ު��5�ak	\��	�hB^[a��@�m?(Wh]r]�(%� ����0g�m�L籠��o�A���ߐһ�'~r��q)��㔱.�V���X��`��A7��iW���<e��'I�Q�\�pM��E��x��:�0�v6�^h'>W����m>�0V�Z�`E��v&��Q���>�������͘s�r��?�[��ZUuA�Xe/mr�Ւ�M\*K����ޥ���^���2�r��;$��xtu=[X��k���t{���O�k2ʿo(����'39�YQ�)
���S�8C���_���R��׌n��:�.�BC�h�R�V����i M�S�q�	�:!�G���urXͩ��*w���,n�fq����<�w�d�dWS�����ɡ�+}��X*maIx��^í��.�{�;.;R՜�,�DR�$"�moN=*b����GeU��p�2:��8_G��m�g%U��Ր��s^���)t�c]KJ�z%w�tK��<���Mv1k�XC����I#�)���SA�W�i����<V�껋X��:����֒q���14�J�5SǪ�d�
?��rg���>BUh|?h��l�[��RW\�%z]����D(�4�J(15_�fO��M���RyM�c�mX��c�(6�f������!��e��'�״�l�&�	�G�{����PFs6c��4kZ��_��B��D���.�^�Z�S:em�,�4Ic]�Y+�|[�).iS�4o
#��.|���-l3I���5���B�:�y��?�n�QE�z穜x��2��	(��PqV��3v ���!��v���3�� p<��.c�IRgL~�Ěu�����k��d�΅{MW��C���-�o�q�
שּ�c9�-N_@��b���~��i��:-�f}��Vjr״O4ɇY��M$���ϧ�~Q1��F9���w�}x����J��2>o�_�#Q�''(����#E-�>+.Sʀ�<��%:Ǽ�y���#DD6;���u5P���w��ǝq,|R��d(cng/�юF��\_���2��9WuPk�R
��_���ƺ��
���e�-Ԋ_C��+9���BV0,O����y�JO�� Ȫat���^jՉ��Y����yݥĵ�����u����e%�b�[�ٺ�͇ϛ�ͫ�o��0����G����f޹���z�U��ez�u�� ؗ�|����3vŲK[��o	k�H����ߴ�P�s��_,b��8�ʰ�y!s���zs[�Ծ}���IV�	d&э;g�Q�keg������m=-.)L=cP�rCwV ���̥rp�?���>2=_v��u� ��eA�P����'��P�-� ��y�c���S��B�^�_s��|�=afXK@6F-�Ɛ�Lj����B�@�7r���:�z��6�5/:�x�-�]��'�{m�$6�����d ��J����5 rl8�碕�Љ�}�@@���^��%��|C���N�^�K5=+H�,@��մC=n��u���<J\#�kA9 8M2Z0ea��9���X���ڞ/F]�,� s�񽺶sY�<Hc�mȔ)�6��p�V�:>��t��)u�2��J)�$���GS,�U`���_?�N��^	�0 U;�<���Y��t��l[�j�R� ������J��}Dkf�Q\�����e�����;u_��#,���Ku����Dۻ��#9���ǖ��F����
���o�MwhfÌϔ<H��wr��s�3o:G/Y��o9;V"NwtY�Us��5ˎR�_�2XH7y?�m~〭�ĕ{��Qd�sS#׼���Zv�-����	�_���$}��'a=`��
,U�CC��-�#�J^���L��Z�)���"��(zќ���\��&G&�!?���n�{*Ef���%��U�.R�R�&���E��kF��ݵ:������� �T�_�瞷6T������Ŗ����rD    �N+�>�>��	-`�\��Y�nM�cZ?���+콚%�������3�
G�TC\�в�uol�ɀ�	T$佊O^h�9��bl.�����>�3��E��!D��q���7�~�Wр�A�����s[��?��jyܩf�L?U��j��l���q�r4Kl�x��fI������Q�6�t�)�8ZT���V�H�א!iOLQ������9��E��h6�
�-�_O�*A�zǩ�%�쇽u�gA��1*�6*���D�9�1?�1 ��ĳ�����2R	&X���vk�W�2��������)��&�Mm/ɨ!����@�砀�e�#��Z�_���-�tj�q��r����{~%��4>i�*�~�Kԥ�_�W��n"cӣ^A-,x$������w�8eE**�xEβ����P�Ē��я���Qֵ+�ښ-�P3Jnq1ľ9����G�e�h�T����[��4M8������t~�$�Z���ֲ�}HA��:�ӱ��Xbe�)l�:,@�|[��3�b�yX�)>Tk�_7Q�\���{5��X�.�!ö�[��7����+#��2�G� ��73�Uߜ!%V4s��^g�Ml�����j�kv�/:�2��
3���oq���$�n3�S
OF��!��ԅu�ok��ֵ��=��n�e����;.b56������2fe����^��,UMQ^Q�]���3m����x�u1�|�e}�ݵ�"9��3��5���1N�vą�t_���|e'�ɟkkי����{HV�R�>���$���	`�0��\��"&�����)�ٳ4��}������D���5O��v�Q��6�i��7-㛾������iy�!�����l���*J���g�:^ۓ�a��D�H��@���_��x�5�d# c˭��;�r(F(�`�����CI�X�U��*��5����Y�zl�-�͝N�w:s����̷������]�m*Op�;$AN�P �e^S����
����p��	?��C��[���W'��(��L����K�0�7�⮡�V����g������Ǣ56�-�맿���̘�W�C� �Cp���3��p���\�[�;X��OU�쬄+d#
���h���0f�8X�"����H�ڱ>�z�޴�R���Ǉ?k���i�<暈؁%�wo���'��q{I��:4;���R3�����K��(d��`q��slέ� ���S�0��c#���+�d�ߎ��`O^_�ދ�~�D�2V��O�C^YC������P��ӕ����y�fs�=?��A�����!%������7E^~}�f:�3�,��oJ�GKLĹl�$gwy�s��0;�d��O�;��qw��0B��E.\�����}�ӈm�/��sGx�& �l;}$�<_�����L	~��=<)���0oB�4�iȃ}Cp ���.H�1mo�|�̍�X��(d>j�I��~SlZ\�"7]��` �M�}����Iv,Yqlz5��w�ꦦq9�W�w=7h����ێ&�c��{���.�4�z��.�̳��7M^-K��Oe�O�/C��һ���h����e�1�p��u0	�j�E������ 9��3��b6x��$TՂ�:��O�3����W���+7~t���@?,EJ�Ƕ`CEˆ���-]��r��pYN3�}��pn���i`��C򶢰R�� ��0Q��̱M-#����a�B���2��Jh<�[c�%�ؒ~Y+�W�L-��e���y"�O�9�T����� BÎ"���ߨ�H���+>���gQ�L���2�i2���=�	?e1~��<Q�8��x�	�AA�)
�G8�ŧ(���M�KG�d�!���mf�6�{�c]C�B�e�0��<K�Q�o?���<5
Iβ��(�kz+	o��{ې��KB9[n�-f�5����*2����cÆ��v*���\܏S5UPJP��y�~��� dorP����ߨ�K�lh��Z}��s��8�㾱� y�&�,���E79� �o��s��t�1�R��P]��`���͖�
�ߖI�9Q#�2���1�Vk�R9��WQ�-y��uS��x�Uؘ��YÅ�����95'���#@�?16)��������Q�܂}� ���B��f�_�Ȓ�]s��|��)T� ���f>�P�i M��UGI�� ���Y�X�e@��F`�_��zP�1���i��" �鋴�R�>RDE����/Ʋ�7�x�'���:��d_�����9�mfd�y�� ���K���j�^�1�U����q�ё��CC҃C����,�zܽMF�C����>�a���W��AN�A���`��0H�\���k�Ӡ��}8���2�^��J�`�C��\5�l̂�+�G�ޔl�~'�w�W�B|0V�M��G�	��ƺ����J��͏���V�XN��&Gf��h6{I�l?4dn��BOA/�I<mlY�<k�s"f�d���0�u��`���hw(�x�0����T�Yg̱/t�F�䘘�g��;~	q�Ȃ�Ox��\2ʪ�@cpX���F�3����х���5�޶�^���~Ox�6��Ͻ�����;_�1b�RX}�Y�hh6������a��������'�h�3�L�����|Bb��[d��
ӻ�!�q���k�3`��g�R��!&��Q��+��+�ᦉ�,�"�!`�Xs>ϟSs\����a�>�5!:&��j��w���C��x�R�jT���m�cĂ)z���O_�K�I��[����;�4�sI�=��H~c�l[�����]j&N������f�JҳY���U��9�d�@�7l�,�ȥ$�A]�!7�wF6׆
��e��*l�X����O���e�6N��-���!��Z�������*�B�=����f.��� ���l�7�7?��9���Y�'��_-R�]�bT��mWɃ�����-����l�Ex#�ŶK�n2�Ư���֪dǾ�'`�&N�4�d$X�8��Y7��D`��̓�.BT?�+IAR5�j�Y}$��RQ������VN�r���uE'��1�h2~y��w�-A��$�d��*��v,���m�-��>��ַ���:W~�Ӿv� :ҧX7���?�M�&��Z���g?̪z��u��D���H���h�G;l��"�"�iX�	��UGJ�_y(��8��&S�|��w>�oF��T�����f���xo5C_�G܍w�^�'M���m2x����I�G�J�R��wC����g~�z<�S=�^*�?]rR��ʖ�"n�~�������
���*���N��O��~���<�|֒mMׅ��{}�6�P�r3�����m��4��[JT���#�u��M�6��2���0"��B�5�:� E�88����Cq��r`�EC�6bj�k0\E�Wnr�|	@W������z��!�F������{��&dH��O�d)����c�߁^��si8�a@K�?�|P�44@K�o�`4&�$�z��LɃ�6m�ja�a�F�s��/z���V�P�"�� ��]x��	�Z>�4]g�B���훃�ԁ�@��>��5�����낳ﰢ�, ڠyUa�ʸ��*��ȣ�Q?H�-7�;H�3g���M����?"*` >1�_0��-�������R�}g鵹t1�= u�A�鶊��a %��A~"�+0t�G�L�C�с�I	�$O�������;ނ|R�+~�>���Ù�(=|��K0_�L9t|d_�{
d��8j�j�U�a���>�Yg�������G#��ݴ�oz������҈?_L30��Px�^`�,���Y�$g@=[E��$����}_^w$Ai��l���ƛ(y5
��($��mI�0W�G������I�wdY����/28(���6N<TR�&혺��+��V���Z�>�@b81$��5Ԓ���_'YA$�w�L}�m��XK�
&�ʍ��i��A��SՎ̾#Q[��:�8��B�S�_*ċ�{w�(�Cȵ�w��jm��� �
  �]8��W�IOˈKz��'bX��0��k�!��w����Ɯ������loԲ��~�J� p킴�5��"�Z�G�E{��/�>���U�3�A'����V�I�b4��ނb�#�A9��Cr ��� q� �1i�"_��Ȍ5���h�HB �<��~6�~`5�,��k%��>5���S�ρ\������!.�3٩����pڭ�P&./tm}Z����[=�Urܗ8Yi)�)Ek��ɖ��p���������`f���mO�H'���KR!���T���Ƥ�A� �D	�����V~�{yH����K�G�Xn�_�g��?�O�}G'���I���X#��o��Lǳ�Uzn�Jc>�x�MI�N�C�ȹT�C�J�6}�pih�`�Hִ�V]G$�ʍcm3��})o�����0i����,��eX�BC�l$��4̄[(\3�ٝ��/�
��O'uNs{�0��&m��Eg9:�lp�=-f"GF#G��4F�8�7 ��~�Ge��8�0�Ý�D����\��B(�~X�����W���\|�֍~p�n �$�q	��W��ܛ�kv]uj�*�X%��E_�,���og��d��q�ҾcD)�v=_<(��Y�C���,?Ƃ�!���}�c"���}�&�۳�_��.<q��B.{!H�[b/��x����Sd�$"y��O���`\�M��0�x�����=Ǐ��I��'�	��g�4Lk5P�y�t�h��li}��k���Y���oط5����A�nu���b��T���Y���o�hY�i�����x��(�|��e���}��|�w�~�!�P챻Q�5�� 6�R�,Fx���*��|jS���i�����;V9�ФɌ��7��)���r�$fA�-9.T�B}��T	O~�'GE�k~jf��M-�R4�K�{�����wpH8!:Up�|�"����)>���ڿ���@�<�mV��O��g���Җ��Yѵ_����/����M��`����F�X���k���ع/��~;y>,«f���W_��G���ٿ���+�CMO5��c=�C؍��4�x��\��ϗ�OuBG��2?T;~��E�#!4W�x������N�eK�/w�}��)���<ñ�;�����H���P8R�ܖ|�t(
���l0�#��ẖ1���حN\YRk��?N�R�^������gQg��	����+K���ȸ�vO���?2��n��@U���A+c��p	�����݇�<vb#���E��8����W���|Ǫj��Dª*ഥ����P�d�Z�8�S�J�3���:��9��`O�G���S'�S��ތ�nC�XJ��7W��+8{��D���-�{G�����ظu*��1�N�d�_+��,���Q���+eI�`."��NV"%	������[V�+#_�Ay,/'Y.���%��eӪ	 �{)]��i��N�PWO�����:W�#�;�u��ӱS���
���3c
�0��f~��D��չ�_�Ķ�@i�=�NIuܷKe\�
0�!z�0{� �أ�ˈ�m��]���-*�1�T�Ѵ?ʗ�kF�b��|t��/v�uo����=�64$~g����%�L�Y���)�VlzƠ��c7KA�4B�w%�
�8D�t6|���&F�iA��;�A��0�t��`t˧�S��&�\gh0��Z������-���vD����+�y=L����E�����ŕN��/�U���Ͷ���6��Z��D���W��w�v̔_��Aa���ܾax��Fg����mm��!�(�		`�'�f/�_�OԦm���;��e���R���:��؊������h$~Z^,��')��k�-�4�ό\J�9��<���k�|�N^)��C+8���T4�ϫ��&?�'G���U�s@��w�4mj�u��f�0��׬�m���G��C�O�����B'�o�z��a�����������X,�9��.�q{pK;B:{���J�3[S�"���m'�Ho��9��d�n���ഷ���S��H���+�l� 0,�$��%��gD����ч)�c#���N6��5�N`GQ7�W�_y��)2�[�W�"D0��}��dRv���L�?D�;	8�p�i��fP���5ԹD���j�05�4�d.�Nr1�u85X����w�\6�u��+��� pt�s����˘ab�a7C��6��m/dؑ^?Է���1ٍ�1����'���a%����N��%[2����MX�S�����VȮk���k��2�h�6ܥR��\ы	5A������ۈ��O�/]ɬ��eFV�.��"~����)W�3�H�JC�ZX���D�����Cf;h���Y��S� ���k�M!B�V���h�/��/��eTJ�c��CO�#��0��>�����ɹ���DH�|�%��0�e%�R�˿���f>tD��<<��?l*�*��K��e����!D��I���?�d�I��OJ�F��3�i������a��0�A�� ��?�����a��0�A�� ��?�����a��0�A�� ��?�����a��0�A�� ��?�����a��0�A�� ��?�����a��3��3��0�A�� ��?�����a��0�A�� ��?����c�?��m����G[��-�і�I[���������_ �F�      x   �   x��1�  �9�ŕǘ�t16n"E�j�U�n:�.X� �)P��J�fs�V3������v-�DB�D:c�%;)��n�ˎd"Û�	D5`�l���G�����uǎm�j;����������#������ԕ����&�2F      y   }   x���1
1��_d�l�O��ld��������f�a�-$�
����;A�I��)r-�6؊�^h�v?� 5c�>"���x�q̵�v�Y<��M��F!��n�
���1]1�����ɹ��Rz�85�      z   \   x�Eʱ�@ �:L���2��6�6�����e~����݉=LQJ?̊$�J��u��r���0X�;2jBiT�1ɭ��X���� 5 �      {   �   x���=n�0���>F���$�Ǟ�H:��	<�O=}�;d��5���	�K���(L��袙�&êzG�*�!K�6b��I�DM+K���P�G͐�S�M���~�m��c}n���n����x��阃�F}G�#����s	��Lz^�T$1�#X�d�L��������<���DOp      }   �   x����N�0���)���8q��`���tK�]e�������܁���-��9�L�b�������O�fL�>��A���0�e�ϰ�v'�����iZ8����(Q�eY�j�U���5D�����x�Jm	��fĤcʝ�|U�S��QQ'�t��уN��t׹�T���:�ǚa�m�+�y?�,�7.�o�&��^6X��t��p��d;_-ѶV����o����6M�,�e�      ~   �   x����q1��\�"�@.r����U�1U=�N6�6�8���"�0�jݙ�Qq��`|��;��%wc�	�ON5�E�
Aj?�D�}�������� B<�����^��������yG(�'�X��]���H��6���R��D���C��$t����5`j	%��2Q������y�?�VWK         �   x���An�!�ѵޅ�ޥQ�t�6���]w���	��s��n>�Wl���;�Z[E�}rOV'#5`��.��e�$�E����8��F �!#
��5~~��~{<���s����{B��0w�p>:.upuEW>�����Z�����њ��Y���cU��g����E��"�&�z6'�s�8A��+��k����˗�ƍ��[��{8��      �   �  x��Tˎ�6<�_�`�d��c��&H$�\Z$��"�|��)J��@$Q�]���en&mzu��N]����Q�a�{��y74���������ڪ��:5^�Μu��8�~�%gr�K�%8����[o���i�+	O��-�30�
/G�=��&������h���S�m�!�l�dP��o���K^���9��e��zʠ��[���k1��#�9��-����>����ҲWl�Q�''�"�,����u��gQ,�;;W��_��9�o@o�|x6�Z�@�H���ar�d����w�Z$��f2u�3-S1$о20E*�d��vws�ϗ�9��N�O�^]x���U;�s?��E���g�����⋥kS�at$6s4$�$o2�#��`�$�]�:�$A�#�	�� Tit�7�غJ%�P>��=��o0��n�^�{�5���lIK^i���ea���a⪵�?���Xn ���_�~���".,9���|ܭ��se��y�Y�6��V���&H�0ɂ��l��x$j*�,urRb��C9]��9Ђ*5��5�H��d��֏���5��[��bX	�_�d���:��fg����N��6
wV�f��t��O����������<�F�)����6LJ_N�{k�fj��6���϶\�r��՝g��.?�Uy�����ɺ�T�����ć[���O���ǁ��1����HfI7�")Y��&�ЈB�rXS�,W'����qP���������      |   �  x�u�K��@�u�;�6�6��萌_Sjj6�_
"Mx��>�&�����8���:�.��]G��b&�0vm�H�Y&�R�t)+ht�&E��T� e�4i� ������������aH̡_�m�_���7g*g����%�����&�䁌���X������o@�	c�ۘۦ�-�3���H!8u���K���K�����5�s@%����HJ�����&U���y�����m��`.��X����k�)Z+����[oqJK�;6�\a��Mʅľ�%���!�T�2Q[�
-�:�5�0��|'t1�w|D\�M4���#�*އ���Mvz��n2�2�I��ie��ɨ�i��1A16�u���l���Q�|&�t,��Ϟ�F*(4�B.����$�?;�ݻ'�6��g#m��z�N�U�Ͻ��6���`v�8��aŲ�qF�U0��tyؾ{�C|՗��7c0����>      �      x������ � �      �      x������ � �     