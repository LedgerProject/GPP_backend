PGDMP         	             
    x            gpp_db #   12.4 (Ubuntu 12.4-0ubuntu0.20.04.1) #   12.4 (Ubuntu 12.4-0ubuntu0.20.04.1) Y    9           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            :           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            ;           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            <           1262    16385    gpp_db    DATABASE     p   CREATE DATABASE gpp_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C.UTF-8' LC_CTYPE = 'C.UTF-8';
    DROP DATABASE gpp_db;
                postgres    false            =           0    0    DATABASE gpp_db    ACL     *   GRANT ALL ON DATABASE gpp_db TO gpp_user;
                   postgres    false    3132                        3079    16417 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                   false            >           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                        false    2            �            1259    16556 
   categories    TABLE     �   CREATE TABLE public.categories (
    "idCategory" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identifier character varying(50) NOT NULL,
    type character varying(20) NOT NULL
);
    DROP TABLE public.categories;
       public         heap    gpp_user    false    2            �            1259    16562    categoriesLanguages    TABLE       CREATE TABLE public."categoriesLanguages" (
    "idCategoryLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCategory" uuid NOT NULL,
    alias character varying(50) NOT NULL,
    category character varying(50) NOT NULL,
    language character(2) NOT NULL
);
 )   DROP TABLE public."categoriesLanguages";
       public         heap    gpp_user    false    2            �            1259    16664 	   countries    TABLE     �   CREATE TABLE public.countries (
    "idCountry" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identifier character varying(50) NOT NULL,
    completed boolean DEFAULT false
);
    DROP TABLE public.countries;
       public         heap    gpp_user    false    2            �            1259    16671    countriesLanguages    TABLE       CREATE TABLE public."countriesLanguages" (
    "idCountryLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCountry" uuid NOT NULL,
    alias character varying(50) NOT NULL,
    country character varying(50) NOT NULL,
    language character(2) NOT NULL
);
 (   DROP TABLE public."countriesLanguages";
       public         heap    gpp_user    false    2            �            1259    16682    countriesTopics    TABLE     �   CREATE TABLE public."countriesTopics" (
    "idCountryTopic" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCountry" uuid NOT NULL,
    identifier character varying(100) NOT NULL
);
 %   DROP TABLE public."countriesTopics";
       public         heap    gpp_user    false    2            �            1259    16693    countriesTopicsLanguages    TABLE     �   CREATE TABLE public."countriesTopicsLanguages" (
    "idCountryTopicLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCountryTopic" uuid NOT NULL,
    topic character varying(100) NOT NULL,
    description text NOT NULL
);
 .   DROP TABLE public."countriesTopicsLanguages";
       public         heap    gpp_user    false    2            �            1259    16707 	   documents    TABLE     �  CREATE TABLE public.documents (
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
       public         heap    gpp_user    false    2            �            1259    16859    encryptedChunk    TABLE     S  CREATE TABLE public."encryptedChunk" (
    id integer NOT NULL,
    "idUser" uuid NOT NULL,
    name character varying(50) NOT NULL,
    "uploadReferenceId" character varying(50),
    "chunkIndexId" character varying(32),
    checksum character varying(32),
    header character varying(32),
    iv character varying(32),
    text text
);
 $   DROP TABLE public."encryptedChunk";
       public         heap    gpp_user    false            �            1259    16857    encryptedChunk_id_seq    SEQUENCE     �   ALTER TABLE public."encryptedChunk" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."encryptedChunk_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
            public          gpp_user    false    225            �            1259    16830    icons    TABLE     �   CREATE TABLE public.icons (
    "idIcon" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(30) NOT NULL,
    image text NOT NULL,
    marker text NOT NULL
);
    DROP TABLE public.icons;
       public         heap    gpp_user    false    2            �            1259    16466    nationalities    TABLE     �   CREATE TABLE public.nationalities (
    "idNationality" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identifier character varying(50) NOT NULL
);
 !   DROP TABLE public.nationalities;
       public         heap    gpp_user    false    2            �            1259    16472    nationalitiesLanguages    TABLE       CREATE TABLE public."nationalitiesLanguages" (
    "idNationalityLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idNationality" uuid NOT NULL,
    alias character varying(50) NOT NULL,
    nationality character varying(50) NOT NULL,
    language character(2) NOT NULL
);
 ,   DROP TABLE public."nationalitiesLanguages";
       public         heap    gpp_user    false    2            �            1259    16496    organizations    TABLE     �   CREATE TABLE public.organizations (
    "idOrganization" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(100) NOT NULL
);
 !   DROP TABLE public.organizations;
       public         heap    gpp_user    false    2            �            1259    16507    organizationsUsers    TABLE       CREATE TABLE public."organizationsUsers" (
    "idOrganizationUser" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idOrganization" uuid NOT NULL,
    "idUser" uuid NOT NULL,
    permissions text NOT NULL,
    confirmed boolean DEFAULT false NOT NULL
);
 (   DROP TABLE public."organizationsUsers";
       public         heap    gpp_user    false    2            �            1259    16449    users    TABLE     S  CREATE TABLE public.users (
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
       public         heap    gpp_user    false    2            �            1259    16814    organizationsUsersView    VIEW     �  CREATE VIEW public."organizationsUsersView" AS
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
       public          gpp_user    false    207    207    203    207    203    203    206    206            �            1259    16542 
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
       public         heap    gpp_user    false    2            �            1259    16573    structuresCategories    TABLE     �   CREATE TABLE public."structuresCategories" (
    "idStructureCategory" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idStructure" uuid NOT NULL,
    "idCategory" uuid NOT NULL
);
 *   DROP TABLE public."structuresCategories";
       public         heap    gpp_user    false    2            �            1259    16653    structuresImages    TABLE       CREATE TABLE public."structuresImages" (
    "idStructureImage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idStructure" uuid NOT NULL,
    "imageFolder" character varying(100) NOT NULL,
    "imageFile" character varying(50) NOT NULL,
    sorting integer NOT NULL
);
 &   DROP TABLE public."structuresImages";
       public         heap    gpp_user    false    2            �            1259    16604    structuresLanguages    TABLE     �   CREATE TABLE public."structuresLanguages" (
    "idStructureLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idStructure" uuid NOT NULL,
    description text,
    language character(2) NOT NULL
);
 )   DROP TABLE public."structuresLanguages";
       public         heap    gpp_user    false    2            �            1259    16821    structuresView    VIEW     �  CREATE VIEW public."structuresView" AS
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
       public          gpp_user    false    209    209    209    209    209    209    209    209    209    209    206    206    223    223    223    209    209    209            �            1259    16523    usersInvitations    TABLE     
  CREATE TABLE public."usersInvitations" (
    "idUserInvitation" uuid NOT NULL,
    "idUserSender" uuid NOT NULL,
    "idUserRecipient" uuid NOT NULL,
    message text,
    "accessLevel" character varying(100) NOT NULL,
    accepted boolean DEFAULT false NOT NULL
);
 &   DROP TABLE public."usersInvitations";
       public         heap    gpp_user    false            �            1259    16718    usersTokens    TABLE     �   CREATE TABLE public."usersTokens" (
    "idUserToken" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idUser" uuid NOT NULL,
    token character varying NOT NULL,
    "validUntil" time without time zone NOT NULL
);
 !   DROP TABLE public."usersTokens";
       public         heap    gpp_user    false    2            )          0    16556 
   categories 
   TABLE DATA           D   COPY public.categories ("idCategory", identifier, type) FROM stdin;
    public          gpp_user    false    210   �       *          0    16562    categoriesLanguages 
   TABLE DATA           n   COPY public."categoriesLanguages" ("idCategoryLanguage", "idCategory", alias, category, language) FROM stdin;
    public          gpp_user    false    211   ��       .          0    16664 	   countries 
   TABLE DATA           G   COPY public.countries ("idCountry", identifier, completed) FROM stdin;
    public          gpp_user    false    215   �       /          0    16671    countriesLanguages 
   TABLE DATA           j   COPY public."countriesLanguages" ("idCountryLanguage", "idCountry", alias, country, language) FROM stdin;
    public          gpp_user    false    216   ��       0          0    16682    countriesTopics 
   TABLE DATA           V   COPY public."countriesTopics" ("idCountryTopic", "idCountry", identifier) FROM stdin;
    public          gpp_user    false    217   ��       1          0    16693    countriesTopicsLanguages 
   TABLE DATA           t   COPY public."countriesTopicsLanguages" ("idCountryTopicLanguage", "idCountryTopic", topic, description) FROM stdin;
    public          gpp_user    false    218   Յ       2          0    16707 	   documents 
   TABLE DATA           �   COPY public.documents ("idDocument", "idUser", title, bytes, "widthPixel", "heightPixel", "fileFolder", "imageFolder", extension) FROM stdin;
    public          gpp_user    false    219   �       6          0    16859    encryptedChunk 
   TABLE DATA              COPY public."encryptedChunk" (id, "idUser", name, "uploadReferenceId", "chunkIndexId", checksum, header, iv, text) FROM stdin;
    public          gpp_user    false    225   �       4          0    16830    icons 
   TABLE DATA           >   COPY public.icons ("idIcon", name, image, marker) FROM stdin;
    public          gpp_user    false    223   ,�       #          0    16466    nationalities 
   TABLE DATA           D   COPY public.nationalities ("idNationality", identifier) FROM stdin;
    public          gpp_user    false    204   �       $          0    16472    nationalitiesLanguages 
   TABLE DATA           z   COPY public."nationalitiesLanguages" ("idNationalityLanguage", "idNationality", alias, nationality, language) FROM stdin;
    public          gpp_user    false    205   �       %          0    16496    organizations 
   TABLE DATA           ?   COPY public.organizations ("idOrganization", name) FROM stdin;
    public          gpp_user    false    206   #�       &          0    16507    organizationsUsers 
   TABLE DATA           x   COPY public."organizationsUsers" ("idOrganizationUser", "idOrganization", "idUser", permissions, confirmed) FROM stdin;
    public          gpp_user    false    207   ��       (          0    16542 
   structures 
   TABLE DATA           �   COPY public.structures ("idStructure", "idOrganization", alias, name, address, city, latitude, longitude, email, "phoneNumberPrefix", "phoneNumber", website, "idIcon") FROM stdin;
    public          gpp_user    false    209   R�       +          0    16573    structuresCategories 
   TABLE DATA           d   COPY public."structuresCategories" ("idStructureCategory", "idStructure", "idCategory") FROM stdin;
    public          gpp_user    false    212   S�       -          0    16653    structuresImages 
   TABLE DATA           t   COPY public."structuresImages" ("idStructureImage", "idStructure", "imageFolder", "imageFile", sorting) FROM stdin;
    public          gpp_user    false    214   p�       ,          0    16604    structuresLanguages 
   TABLE DATA           l   COPY public."structuresLanguages" ("idStructureLanguage", "idStructure", description, language) FROM stdin;
    public          gpp_user    false    213   ��       "          0    16449    users 
   TABLE DATA           �   COPY public.users ("idUser", "userType", "firstName", "lastName", email, "emailConfirmed", password, "passwordRecoveryToken", "passwordRecoveryDate", permissions, "idNationality", gender, birthday, "idIcon") FROM stdin;
    public          gpp_user    false    203   ��       '          0    16523    usersInvitations 
   TABLE DATA           �   COPY public."usersInvitations" ("idUserInvitation", "idUserSender", "idUserRecipient", message, "accessLevel", accepted) FROM stdin;
    public          gpp_user    false    208   ~�       3          0    16718    usersTokens 
   TABLE DATA           U   COPY public."usersTokens" ("idUserToken", "idUser", token, "validUntil") FROM stdin;
    public          gpp_user    false    220   ��       ?           0    0    encryptedChunk_id_seq    SEQUENCE SET     E   SELECT pg_catalog.setval('public."encryptedChunk_id_seq"', 2, true);
          public          gpp_user    false    224            y           2606    16567 ,   categoriesLanguages categoriesLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."categoriesLanguages"
    ADD CONSTRAINT "categoriesLanguages_pkey" PRIMARY KEY ("idCategoryLanguage");
 Z   ALTER TABLE ONLY public."categoriesLanguages" DROP CONSTRAINT "categoriesLanguages_pkey";
       public            gpp_user    false    211            w           2606    16561    categories categories_pkey 
   CONSTRAINT     b   ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY ("idCategory");
 D   ALTER TABLE ONLY public.categories DROP CONSTRAINT categories_pkey;
       public            gpp_user    false    210            �           2606    16676 *   countriesLanguages countriesLanguages_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY public."countriesLanguages"
    ADD CONSTRAINT "countriesLanguages_pkey" PRIMARY KEY ("idCountryLanguage");
 X   ALTER TABLE ONLY public."countriesLanguages" DROP CONSTRAINT "countriesLanguages_pkey";
       public            gpp_user    false    216            �           2606    16701 6   countriesTopicsLanguages countriesTopicsLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."countriesTopicsLanguages"
    ADD CONSTRAINT "countriesTopicsLanguages_pkey" PRIMARY KEY ("idCountryTopicLanguage");
 d   ALTER TABLE ONLY public."countriesTopicsLanguages" DROP CONSTRAINT "countriesTopicsLanguages_pkey";
       public            gpp_user    false    218            �           2606    16687 $   countriesTopics countriesTopics_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public."countriesTopics"
    ADD CONSTRAINT "countriesTopics_pkey" PRIMARY KEY ("idCountryTopic");
 R   ALTER TABLE ONLY public."countriesTopics" DROP CONSTRAINT "countriesTopics_pkey";
       public            gpp_user    false    217            �           2606    16670    countries countries_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY ("idCountry");
 B   ALTER TABLE ONLY public.countries DROP CONSTRAINT countries_pkey;
       public            gpp_user    false    215            �           2606    16712    documents documents_pkey 
   CONSTRAINT     `   ALTER TABLE ONLY public.documents
    ADD CONSTRAINT documents_pkey PRIMARY KEY ("idDocument");
 B   ALTER TABLE ONLY public.documents DROP CONSTRAINT documents_pkey;
       public            gpp_user    false    219            �           2606    16866 "   encryptedChunk encryptedChunk_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."encryptedChunk"
    ADD CONSTRAINT "encryptedChunk_pkey" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public."encryptedChunk" DROP CONSTRAINT "encryptedChunk_pkey";
       public            gpp_user    false    225            �           2606    16838    icons icons_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.icons
    ADD CONSTRAINT icons_pkey PRIMARY KEY ("idIcon");
 :   ALTER TABLE ONLY public.icons DROP CONSTRAINT icons_pkey;
       public            gpp_user    false    223            m           2606    16477 2   nationalitiesLanguages nationalitiesLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."nationalitiesLanguages"
    ADD CONSTRAINT "nationalitiesLanguages_pkey" PRIMARY KEY ("idNationalityLanguage");
 `   ALTER TABLE ONLY public."nationalitiesLanguages" DROP CONSTRAINT "nationalitiesLanguages_pkey";
       public            gpp_user    false    205            k           2606    16471     nationalities nationalities_pkey 
   CONSTRAINT     k   ALTER TABLE ONLY public.nationalities
    ADD CONSTRAINT nationalities_pkey PRIMARY KEY ("idNationality");
 J   ALTER TABLE ONLY public.nationalities DROP CONSTRAINT nationalities_pkey;
       public            gpp_user    false    204            q           2606    16512 *   organizationsUsers organizationsUsers_pkey 
   CONSTRAINT     ~   ALTER TABLE ONLY public."organizationsUsers"
    ADD CONSTRAINT "organizationsUsers_pkey" PRIMARY KEY ("idOrganizationUser");
 X   ALTER TABLE ONLY public."organizationsUsers" DROP CONSTRAINT "organizationsUsers_pkey";
       public            gpp_user    false    207            o           2606    16501     organizations organizations_pkey 
   CONSTRAINT     l   ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY ("idOrganization");
 J   ALTER TABLE ONLY public.organizations DROP CONSTRAINT organizations_pkey;
       public            gpp_user    false    206            {           2606    16578 .   structuresCategories structuresCategories_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."structuresCategories"
    ADD CONSTRAINT "structuresCategories_pkey" PRIMARY KEY ("idStructureCategory");
 \   ALTER TABLE ONLY public."structuresCategories" DROP CONSTRAINT "structuresCategories_pkey";
       public            gpp_user    false    212                       2606    16658 &   structuresImages structuresImages_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public."structuresImages"
    ADD CONSTRAINT "structuresImages_pkey" PRIMARY KEY ("idStructureImage");
 T   ALTER TABLE ONLY public."structuresImages" DROP CONSTRAINT "structuresImages_pkey";
       public            gpp_user    false    214            }           2606    16773 ,   structuresLanguages structuresLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."structuresLanguages"
    ADD CONSTRAINT "structuresLanguages_pkey" PRIMARY KEY ("idStructureLanguage");
 Z   ALTER TABLE ONLY public."structuresLanguages" DROP CONSTRAINT "structuresLanguages_pkey";
       public            gpp_user    false    213            u           2606    16550    structures structures_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.structures
    ADD CONSTRAINT structures_pkey PRIMARY KEY ("idStructure");
 D   ALTER TABLE ONLY public.structures DROP CONSTRAINT structures_pkey;
       public            gpp_user    false    209            s           2606    16530 &   usersInvitations usersInvitations_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public."usersInvitations"
    ADD CONSTRAINT "usersInvitations_pkey" PRIMARY KEY ("idUserInvitation");
 T   ALTER TABLE ONLY public."usersInvitations" DROP CONSTRAINT "usersInvitations_pkey";
       public            gpp_user    false    208            �           2606    16726    usersTokens usersTokens_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public."usersTokens"
    ADD CONSTRAINT "usersTokens_pkey" PRIMARY KEY ("idUserToken");
 J   ALTER TABLE ONLY public."usersTokens" DROP CONSTRAINT "usersTokens_pkey";
       public            gpp_user    false    220            i           2606    16455    users users_pkey 
   CONSTRAINT     T   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY ("idUser");
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public            gpp_user    false    203            �           2606    16589 7   categoriesLanguages categoriesLanguages_idCategory_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."categoriesLanguages"
    ADD CONSTRAINT "categoriesLanguages_idCategory_fkey" FOREIGN KEY ("idCategory") REFERENCES public.categories("idCategory") ON DELETE CASCADE NOT VALID;
 e   ALTER TABLE ONLY public."categoriesLanguages" DROP CONSTRAINT "categoriesLanguages_idCategory_fkey";
       public          gpp_user    false    210    211    2935            �           2606    16677 4   countriesLanguages countriesLanguages_idCountry_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."countriesLanguages"
    ADD CONSTRAINT "countriesLanguages_idCountry_fkey" FOREIGN KEY ("idCountry") REFERENCES public.countries("idCountry") ON DELETE CASCADE;
 b   ALTER TABLE ONLY public."countriesLanguages" DROP CONSTRAINT "countriesLanguages_idCountry_fkey";
       public          gpp_user    false    2945    216    215            �           2606    16702 E   countriesTopicsLanguages countriesTopicsLanguages_idCountryTopic_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."countriesTopicsLanguages"
    ADD CONSTRAINT "countriesTopicsLanguages_idCountryTopic_fkey" FOREIGN KEY ("idCountryTopic") REFERENCES public."countriesTopics"("idCountryTopic") ON DELETE CASCADE;
 s   ALTER TABLE ONLY public."countriesTopicsLanguages" DROP CONSTRAINT "countriesTopicsLanguages_idCountryTopic_fkey";
       public          gpp_user    false    218    2949    217            �           2606    16774 .   countriesTopics countriesTopics_idCountry_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."countriesTopics"
    ADD CONSTRAINT "countriesTopics_idCountry_fkey" FOREIGN KEY ("idCountry") REFERENCES public.countries("idCountry") ON DELETE CASCADE NOT VALID;
 \   ALTER TABLE ONLY public."countriesTopics" DROP CONSTRAINT "countriesTopics_idCountry_fkey";
       public          gpp_user    false    215    217    2945            �           2606    16732    documents documents_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.documents
    ADD CONSTRAINT "documents_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 K   ALTER TABLE ONLY public.documents DROP CONSTRAINT "documents_idUser_fkey";
       public          gpp_user    false    2921    203    219            �           2606    16478 @   nationalitiesLanguages nationalitiesLanguages_idNationality_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."nationalitiesLanguages"
    ADD CONSTRAINT "nationalitiesLanguages_idNationality_fkey" FOREIGN KEY ("idNationality") REFERENCES public.nationalities("idNationality") ON DELETE CASCADE NOT VALID;
 n   ALTER TABLE ONLY public."nationalitiesLanguages" DROP CONSTRAINT "nationalitiesLanguages_idNationality_fkey";
       public          gpp_user    false    2923    205    204            �           2606    16825 9   organizationsUsers organizationsUsers_idOrganization_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."organizationsUsers"
    ADD CONSTRAINT "organizationsUsers_idOrganization_fkey" FOREIGN KEY ("idOrganization") REFERENCES public.organizations("idOrganization") ON DELETE CASCADE NOT VALID;
 g   ALTER TABLE ONLY public."organizationsUsers" DROP CONSTRAINT "organizationsUsers_idOrganization_fkey";
       public          gpp_user    false    206    2927    207            �           2606    16809 1   organizationsUsers organizationsUsers_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."organizationsUsers"
    ADD CONSTRAINT "organizationsUsers_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 _   ALTER TABLE ONLY public."organizationsUsers" DROP CONSTRAINT "organizationsUsers_idUser_fkey";
       public          gpp_user    false    2921    207    203            �           2606    16584 9   structuresCategories structuresCategories_idCategory_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresCategories"
    ADD CONSTRAINT "structuresCategories_idCategory_fkey" FOREIGN KEY ("idCategory") REFERENCES public.categories("idCategory") ON DELETE CASCADE;
 g   ALTER TABLE ONLY public."structuresCategories" DROP CONSTRAINT "structuresCategories_idCategory_fkey";
       public          gpp_user    false    2935    210    212            �           2606    16579 :   structuresCategories structuresCategories_idStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresCategories"
    ADD CONSTRAINT "structuresCategories_idStructure_fkey" FOREIGN KEY ("idStructure") REFERENCES public.structures("idStructure") ON DELETE CASCADE;
 h   ALTER TABLE ONLY public."structuresCategories" DROP CONSTRAINT "structuresCategories_idStructure_fkey";
       public          gpp_user    false    2933    209    212            �           2606    16659 2   structuresImages structuresImages_idStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresImages"
    ADD CONSTRAINT "structuresImages_idStructure_fkey" FOREIGN KEY ("idStructure") REFERENCES public.structures("idStructure") ON DELETE CASCADE;
 `   ALTER TABLE ONLY public."structuresImages" DROP CONSTRAINT "structuresImages_idStructure_fkey";
       public          gpp_user    false    209    214    2933            �           2606    16611 8   structuresLanguages structuresLanguages_idStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."structuresLanguages"
    ADD CONSTRAINT "structuresLanguages_idStructure_fkey" FOREIGN KEY ("idStructure") REFERENCES public.structures("idStructure") ON DELETE CASCADE;
 f   ALTER TABLE ONLY public."structuresLanguages" DROP CONSTRAINT "structuresLanguages_idStructure_fkey";
       public          gpp_user    false    2933    209    213            �           2606    16867 !   structures structures_idIcon_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.structures
    ADD CONSTRAINT "structures_idIcon_fkey" FOREIGN KEY ("idIcon") REFERENCES public.icons("idIcon") NOT VALID;
 M   ALTER TABLE ONLY public.structures DROP CONSTRAINT "structures_idIcon_fkey";
       public          gpp_user    false    2957    209    223            �           2606    16551 )   structures structures_idOrganization_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.structures
    ADD CONSTRAINT "structures_idOrganization_fkey" FOREIGN KEY ("idOrganization") REFERENCES public.organizations("idOrganization") ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.structures DROP CONSTRAINT "structures_idOrganization_fkey";
       public          gpp_user    false    206    209    2927            �           2606    16762 6   usersInvitations usersInvitations_idUserRecipient_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersInvitations"
    ADD CONSTRAINT "usersInvitations_idUserRecipient_fkey" FOREIGN KEY ("idUserRecipient") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 d   ALTER TABLE ONLY public."usersInvitations" DROP CONSTRAINT "usersInvitations_idUserRecipient_fkey";
       public          gpp_user    false    208    2921    203            �           2606    16767 3   usersInvitations usersInvitations_idUserSender_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersInvitations"
    ADD CONSTRAINT "usersInvitations_idUserSender_fkey" FOREIGN KEY ("idUserSender") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 a   ALTER TABLE ONLY public."usersInvitations" DROP CONSTRAINT "usersInvitations_idUserSender_fkey";
       public          gpp_user    false    203    2921    208            �           2606    16727 #   usersTokens usersTokens_idUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."usersTokens"
    ADD CONSTRAINT "usersTokens_idUser_fkey" FOREIGN KEY ("idUser") REFERENCES public.users("idUser") ON DELETE CASCADE NOT VALID;
 Q   ALTER TABLE ONLY public."usersTokens" DROP CONSTRAINT "usersTokens_idUser_fkey";
       public          gpp_user    false    220    203    2921            �           2606    16797    users users_idNationality_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_idNationality_fkey" FOREIGN KEY ("idNationality") REFERENCES public.nationalities("idNationality") NOT VALID;
 J   ALTER TABLE ONLY public.users DROP CONSTRAINT "users_idNationality_fkey";
       public          gpp_user    false    203    2923    204            )      x������ � �      *      x������ � �      .   p   x�E�A�!��5ܥ��2��M�%11.�o/;g��"�eN������Z��M��=�i�1�u�qҘ	�'i@6C�����׊�g���ޙ$�ƹH+&��)����r�?	�#�      /      x������ � �      0      x������ � �      1      x������ � �      2      x������ � �      6      x������ � �      4      x���7�Z��������k�dc
會H�s�Q���{L5��B��8aﵞuD@�QH�7D$��X�f�%I���P
�i�!E�/����ߘmk�=��_��'{�?�!�
p���&[A`��	Y˽ M�&�}�^PA�^	�����'�$�\�sgPur��A��3)���v���.6ZH��l���\�wCr���.�!R���K#���h\#�7�E��q֨k �7 Z8�\�M��b���|k"��i!'1��1H�9F *�"9,��(����]!Hu8�!@&eF>���#u�eN?�tW,gc%�`�_�?����x��Q�Y�&�a�ʴ�74��c,g8YpoSA�ǿ|KJ�|kT�B�:X��ޛ�}%�����C���y'>�oԱ�>ّ����1��+n�
�+���-c��o�^�V-������fj�1�sT"� (茬Wy��Z~_�Ǆ�?�ΰ�d���ؑ9�6#
'hsv>�[���Y��q�G�"��cA�ZR$=H�/V~d� )�?�8�j�O�/�.�v'cʃm�6���o�y~��4{�|��%HS��+��<ᔨ)�V�����xمNo��h�2��!�T�y�f|:xa��cy�e}t��:L���ۋ�i!��je��Ĉ��	E姭��/�p��BYc桸�Ϭ��Σ{�9ɐ+�!��O^�������a[/Si�6�B"�{�`#� 5g�Mm�d ���������B�F� ��I2��@�.��1v
G������R&>�W�|N̷r�X�����m��!ǁ4	JyR���
N`�s-82�Q��	{;]��1�zN	��È�a��|�[V%*���i/���c��:��@����,5
�~jUS6��=@�L��q*(n�c�Y��ȡ{�uj�ӫ�+M}�0����p���BDn��}J�e-%j�;-F���a@��;�N�!{�	/h�ӹ;; ;?;�=n�rߴ�����3��%�����>F��gR4#n���}��&���;P��׋�KN��[�Sc3��i~:�w��Y�k��+�t1�ꀵɕ�I�3��3�s���#Rw4���L��ơݮ�G����t� �`}�GÏ]V%¸�����o���'ۑc�%1�"Yk7��y��G#���y2�*qy�l�)����zD'8�C��wp�.�<iWD��Ǎy�&t5��g�+S��Lc�P�a+����r̫�3E��m1|B�)^�u��D~�՘B�~�u���
h�h���a�j;E�r�u'�n��*W��B���~����;���f,���T��p%�%9 ���0���V��ê�B���������3=o��v���^2��nU2���?��ۉyT�e�Pb��8���F�ds��0�}����9.����H��/�%Hr�H�cA��zC��?�R���������O�휍��j�&���r���k�l�CN�>)��o����M˪��Y����z,`�	1y�H,j�G@f���h��-�>���n�6�<j�t�c�f	�L��@���R袨_J\�}���m9�� �ZA���;_A�a�M2�a����xj<�o�#�����Æ}����L�+�BS��d
J�=8>�(G�AeI��v$ X����{�z��>Z�+0UK�$�֕Qk*/g�O�!�>ͯvOƌ�g��G!f��e,CU��w�b���'�[ b[C�:��+u�#���Y��!��uwИs�4!�!X$O��zz=�f%:7p_����G�,)3(�����B>�<j3t�����JL#fꋀ`��>�v ��u���ՙeK}�?^��}�|�Qy�%X�>>�*��\���׾`Qe���Ab�����e���Pl��sKC<��Hp=��U��!io5���˙�4u9`<P�����!�j���k1�ze����3xe�>�|PO�5�屇MR:�/��0|�R�Ƥ���{b��`<�M�.���IA/dh��R1P�󑉍&؇?�`�[��|Q�;�	d�IT������ԽnҜ��g9��넺z�ñ�!�8�������q�i+o��	z�Z	m<}t<-�+;����,��U�!����;���I�@������>^���=9����(���~5�E�)M�u���~iX&:[�@��<���W͓�w����CәAr�/�.bh-��+}@ɜٔ0A5ֶ�Vy:z+��g� �<�+3�'�<}��[Iq4&����
	��ߌ�G��/#w�>,Y�C��M�k����p*3���.�"�p��L+e�l��V��3��P*�0��yZ��>%?F!���W� ��_���I���7XA��V;����g�8	�X��R��Q�� ��	����Io�X|��5Ƙ5[GK;���C'l^�]�o7��5��+�%�Xb�a9U�I!�M��d�>vJ#�>�΅1:ܟ�I?�|"p�9��*��C�
R�D>7���B��ߙ�����X��c�wuy�� ���q�;�/�:H|o��p��Sf;��7����\Ɲ��7k�;[Zϳ�;M�G��b^�@^��e\b���>I/����3��z�&�x��A�M�wxj�L�/��n�޾�@GO�'��?�cu�4~f��ެ�ۻ<�|���W����6s1P�=[ݬ'k��j���	KZ{�܂�H�Qs�<��� �!9N�T"#,_��P���OO����N!Ɣ��0�VȺX�z0�J,�,�K9�6ۯc�t�!=$#��m�Q'�`�'4͹������}U�S۝����C����S�箄&Ǎ�o��K�t�"p�ٌ����+��(�ꈏI��M�\;��X�a�=0r��G�_���n��(N����0��On+1�r�,'�WU�TH ��"� a"'���j8+ʿ��s,��#���c�vv����'2ޫ�O~ՅK`����#	�ɲq�~������-3}Yr.��T��^��u�N���s��N�Y�b�d�Pdޕ[��K�X��^pySp[��Tw>��j��I�����v��+;�Qs���'��2t��I�$���jV�lc�p�"���_&3�#^�w�yn���������w��2ph���Ld �O��Վ�C$v	|È<QhHt+L�7�)�����нS(W�5q1�Nb��c_��='+����4�V�il<��W�T�%m��{&>�x�Gk�Al{^�p�=�&��L+DiZ��IBu&,���hL��g��ٺ���U"�ȇt��e�*ݰe���1NIu�Y=�y����7͚��-}C �V{��3���@a�m�
`��+н~��/��|ȑ���,`���s�"Z��F����eV<��}�7������}NR�Dy���]�
{0�G<4j9�(�Z�r�%��^X��o����/$y�p�F7���i~�G�a�2�Ƅ�Óx$"H#F�C޶�F�nr}��q����]z�����,S%7�Mou&�:J����H�Z�* ��WD�\�$�����05�sfX	m~�
����̤����[��zD~�rT�)���w�M��j�&�C���w���M��u�m���ņ�~d�P�����X�"G>
%�������k�y��B�:�F����$lj�H��I=�>`�:p�	Q��8��x�qx���6XFhs]۱�H�*0#4���U'u�K�yd�,)�Rs�e �*b���8�o�*�궁��.�o����W�jCo:e��C���!���t�$�p�r
K'E���[�.�7�QV����^�ԃ~��ŧ��l�١>��C�� Z|b��2����H�������Go�"�H�=99p��e`�;6�&���o�0�F���b<7����^�[�|c9�璃����L�(����{�ܸ��r��2U-�=tB����Y��-������QJ�0���U���'�ҷ����5���8=�!���d�ngX�Hq1�unO����{��� f
]8mh'Ty�ov5��^���ѳ��=�glG����*%�7]yCm �
  �~��{q�`���M��^B�"Sꨣ��
N�:L�OJ�f^V�-Č]�J��c~v�~V�s J���S]8xRM��x������2�q���P!K>�_�*���,��c��N��w��	|�|�q��
u�)1�vO�c�hN���{�9gH�����7F���T�A	�P�dt��K���ٓ���i�������e���s�[XO��O<Y�mv�S�
���%��
o��b0d� _�X�X�gz��Ԗ�pZ
w C��59�>�29�W'RF���������~�1���1�D���8��>!��	�S nC@A=��6��S�ƍY|���-.���i�o(�>����g,:��X��ٌ�q�������*>�u��pȬ��$T{���cO������\��'�>�p��Qj�
3b�C:�|���ߢg�1��P���-^����}/��|@��T�"I�R�"��T��#6�`969\�����]�R��Qԓ����N!CD�<^O���Y��쫸M �%q�c��JM��.q��,L�ӝ���/Ӫ��1+pϬ�H�z�G1 <0j�ȃ�[���RR�84p��ӛ��|�10sLƶ~N�ze��?��N$4�MT �-笃��>�v�M�|)��~���^��K�؞ĐB�r���Z2�N�[��e����9��a��Ĭ"sV��Z��ʍ����s�ƼA��cY����~�ݡ(u�z�_��!�����\�y�״�����v��^�38����v�w�-�v%ﾠ3�:�^��S[4]2��P*�߻~���ZF}Q��W�%[���ϔpN�5�,� �$�� �	:	@@���.-�o��~R���c�O�����Ձx�K��<�GZ׈?�1��C�h�g�p��j�����I��Q	�6����?Ŋ`��A�������cYR�X�?�Q�k�m�#7Lq��Yb_��е�'�j��b6Ֆ96m��Q��@T�K��؎䓁�0��K}�N�
�,�7J���������J�0Xz�o��Rk��˓D$O-\���N,���i�Iҧ=�!���H�kɳ��ӗ������8�L��#T��FO�,sW���scgW|&�YsT����OHmg�%��N��˸|�Ӿ���MKi�����찳s"�O�|�T�<L3ȑ�eks���=/��1��|�]a�m����hV�g�]������������Ε�.x�D�#����Cz{qY�&�e_F�8�����|0BY�d�Л��*���?Ѡ��3'�Z�V�pdY�GD?"���/7G����+�U�u̸��E�}7�ng->��<J�]G���"c���U��?$�-��.�,N�ݬ[r��r7!�}�^
{ί�sN@+�n�0�]�@{/���I�oE��e+�x�[�Ѧ�t� �����~!D�y��_Fx��3x���\��D�2g�~8�"���O����$�T�r��&�ze?zp���&�B��o�׉<�6w�cA7����,��`���a��;��{��K�F�o6}��7��q$Z��ek��D.���&�pA��寯�o�8��-s�j�k� ��%h�t�ל����*R�#Z� 09+�E���N�W��&�E� -p�&�xSt��\�s$�)��NMDBVX�#��mJ�z�2�9dѲ�mψ���ˏ�#y�X�T*Mc�ao����*Y�)|���᭻�ֈ=��>�pВ��V��ףϴJ�l�K�g��w(Qu'.^�?����^�Kd��̂����l�ȍ'e�(Z�eh1�f��=\u)���@�6!b�uĖ�>�4K�8n*�͟����rPx.�:?�R3T��	��BO����-�h<Q����0�~u�H�:����~2��v��7pn�g���rV���z?!'�J�f�Ka�T@Y�7��9��rD�k����1I+��������u] L@s;��V'��Uپ+�-��k�,j�^jtAo�@�eF��z���2\�L�w��K崎k����t.��B=�[�pɣBٟC�~z��Yv�3��S'�c��d>�����fұ*̐)�H5����*\Ę��|�S0�[V��z���`,!�=��x�P��W�}6�5X��4$n�D�'%'�.Vi�:6��Rr� �5ڬ�A�j��ܝi@5�<�xGί�փ��;�����/�)�G�թ�]��֒i��bVu\X;�����q�b��$�@^�Z[���!K��[s��%�4�Ok��ml�Ԛ��j�/��=�8#���Qq���|��w.���e
��q"��`� �e����TSFxe[.AC��%�3a�b����Sx�������(-C���+���Bē���f�ߔB*�ѭ�|Çh�� OZ�D�j���&�ng��kL�9ݲ��Ӈ\m-�o֠�J�A^�N�-Vs%��+\�'� �J&y��s�L�yGo�^!��M���֌�����0cl����1��{��gڕ]��ߗڅ�ts�o��R�}�PN	n�k�u�sO���Z�O{Co6&��`HP�V\�z|�+f�m��X����CN�W�a�ݗR?�H"9F(���kA��r�H��КjߐX�L��ǭc��v�X	Q0���sՍ�S�&�oշ&ԘǞ����'&m`�)�|�pd�)���T���b���M�q�n-���6m���U��O�]����믿�7�8�      #      x������ � �      $      x������ � �      %   \   x�Eʱ�@ �:L���2��6�6�����e~����݉=LQJ?̊$�J��u��r���0X�;2jBiT�1ɭ��X���� 5 �      &   �   x���=n�0���>F���$�Ǟ�H:��	<�O=}�;d��5���	�K���(L��袙�&êzG�*�!K�6b��I�DM+K���P�G͐�S�M���~�m��c}n���n����x��阃�F}G�#����s	��Lz^�T$1�#X�d�L��������<���DOp      (   �   x����N�0���)���8q��`���tK�]e�������܁���-��9�L�b�������O�fL�>��A���0�e�ϰ�v'�����iZ8����(Q�eY�j�U���5D�����x�Jm	��fĤcʝ�|U�S��QQ'�t��уN��t׹�T���:�ǚa�m�+�y?�,�7.�o�&��^6X��t��p��d;_-ѶV����o����6M�,�e�      +      x������ � �      -      x������ � �      ,      x������ � �      "   �  x�u�K��@�u�;�6�6��萌_Sjj6�_
"Mx��>�&�����8���:�.��]G��b&�0vm�H�Y&�R�t)+ht�&E��T� e�4i� ������������aH̡_�m�_���7g*g����%�����&�䁌���X������o@�	c�ۘۦ�-�3���H!8u���K���K�����5�s@%����HJ�����&U���y�����m��`.��X����k�)Z+����[oqJK�;6�\a��Mʅľ�%���!�T�2Q[�
-�:�5�0��|'t1�w|D\�M4���#�*އ���Mvz��n2�2�I��ie��ɨ�i��1A16�u���l���Q�|&�t,��Ϟ�F*(4�B.����$�?;�ݻ'�6��g#m��z�N�U�Ͻ��6���`v�8��aŲ�qF�U0��tyؾ{�C|՗��7c0����>      '      x������ � �      3      x������ � �     