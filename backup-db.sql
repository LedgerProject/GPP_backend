PGDMP     ,    +    
        	    x            gpp_db #   12.4 (Ubuntu 12.4-0ubuntu0.20.04.1) #   12.4 (Ubuntu 12.4-0ubuntu0.20.04.1) N               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                        0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            !           1262    16385    gpp_db    DATABASE     p   CREATE DATABASE gpp_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C.UTF-8' LC_CTYPE = 'C.UTF-8';
    DROP DATABASE gpp_db;
                postgres    false            "           0    0    DATABASE gpp_db    ACL     *   GRANT ALL ON DATABASE gpp_db TO gpp_user;
                   postgres    false    3105                        3079    16417 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                   false            #           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                        false    2            �            1259    16556 
   Categories    TABLE     �   CREATE TABLE public."Categories" (
    "IdCategory" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "Identifier" character varying(50) NOT NULL,
    "Type" character varying(20) NOT NULL
);
     DROP TABLE public."Categories";
       public         heap    gpp_user    false    2            �            1259    16562    CategoriesLanguages    TABLE       CREATE TABLE public."CategoriesLanguages" (
    "IdCategoryLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "idCategory" uuid NOT NULL,
    "Alias" character varying(50) NOT NULL,
    "Category" character varying(50) NOT NULL,
    "Language" character(2) NOT NULL
);
 )   DROP TABLE public."CategoriesLanguages";
       public         heap    gpp_user    false    2            �            1259    16671    CountriesLanguages    TABLE       CREATE TABLE public."CountriesLanguages" (
    "IdCountryLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "IdCountry" uuid NOT NULL,
    "Alias" character varying(50) NOT NULL,
    "Country" character varying(50) NOT NULL,
    "Language" character(2) NOT NULL
);
 (   DROP TABLE public."CountriesLanguages";
       public         heap    gpp_user    false    2            �            1259    16682    CountriesTopics    TABLE     �   CREATE TABLE public."CountriesTopics" (
    "IdCountryTopic" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "IdCountry" uuid NOT NULL,
    "Identifier" character varying(100) NOT NULL
);
 %   DROP TABLE public."CountriesTopics";
       public         heap    gpp_user    false    2            �            1259    16693    CountriesTopicsLanguages    TABLE     �   CREATE TABLE public."CountriesTopicsLanguages" (
    "IdCountryTopicLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "IdCountryTopic" uuid NOT NULL,
    "Topic" character varying(100) NOT NULL,
    "Description" text NOT NULL
);
 .   DROP TABLE public."CountriesTopicsLanguages";
       public         heap    gpp_user    false    2            �            1259    16707 	   Documents    TABLE     �  CREATE TABLE public."Documents" (
    "IdDocument" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "IdUser" uuid NOT NULL,
    "Title" character varying(50) NOT NULL,
    "Bytes" integer NOT NULL,
    "WidthPixel" integer,
    "HeightPixel" integer,
    "FileFolder" character varying(50) NOT NULL,
    "ImageFolder" character varying(50) NOT NULL,
    "Extension" character varying(5) NOT NULL
);
    DROP TABLE public."Documents";
       public         heap    gpp_user    false    2            �            1259    16466    Nationalities    TABLE     �   CREATE TABLE public."Nationalities" (
    "IdNationality" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "Identifier" character varying(50) NOT NULL
);
 #   DROP TABLE public."Nationalities";
       public         heap    gpp_user    false    2            �            1259    16472    NationalitiesLanguages    TABLE     %  CREATE TABLE public."NationalitiesLanguages" (
    "IdNationalityLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "IdNationality" uuid NOT NULL,
    "Alias" character varying(50) NOT NULL,
    "Nationality" character varying(50) NOT NULL,
    "Language" character(2) NOT NULL
);
 ,   DROP TABLE public."NationalitiesLanguages";
       public         heap    gpp_user    false    2            �            1259    16523    OperatorsInvitations    TABLE       CREATE TABLE public."OperatorsInvitations" (
    "IdOperatorInvitation" uuid NOT NULL,
    "IdOperatorSender" uuid NOT NULL,
    "IdOperatorRecipient" uuid NOT NULL,
    "Message" text,
    "AccessLevel" character varying(100) NOT NULL,
    "Accepted" boolean DEFAULT false NOT NULL
);
 *   DROP TABLE public."OperatorsInvitations";
       public         heap    gpp_user    false            �            1259    16496    Organizations    TABLE     �   CREATE TABLE public."Organizations" (
    "IdOrganization" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "IdOperator" uuid NOT NULL,
    "Name" character varying(100) NOT NULL
);
 #   DROP TABLE public."Organizations";
       public         heap    gpp_user    false    2            �            1259    16507    OrganizationsOperators    TABLE     �   CREATE TABLE public."OrganizationsOperators" (
    "IdOrganizationOperator" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "IdOrganization" uuid NOT NULL,
    "IdOperator" uuid NOT NULL,
    "AccessLevel" character varying(100) NOT NULL
);
 ,   DROP TABLE public."OrganizationsOperators";
       public         heap    gpp_user    false    2            �            1259    16573    StructuresCategories    TABLE     �   CREATE TABLE public."StructuresCategories" (
    "IdStructureCategory" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "IdStructure" uuid NOT NULL,
    "idCategory" uuid NOT NULL
);
 *   DROP TABLE public."StructuresCategories";
       public         heap    gpp_user    false    2            �            1259    16653    StructuresImages    TABLE       CREATE TABLE public."StructuresImages" (
    "IdStructureImage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "IdStructure" uuid NOT NULL,
    "ImageFolder" character varying(100) NOT NULL,
    "ImageFile" character varying(50) NOT NULL,
    "Sorting" integer NOT NULL
);
 &   DROP TABLE public."StructuresImages";
       public         heap    gpp_user    false    2            �            1259    16604    StructuresLanguages    TABLE     �   CREATE TABLE public."StructuresLanguages" (
    "IdStructureLanguage" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "IdStructure" uuid NOT NULL,
    "Description" text,
    "Language" character(2) NOT NULL
);
 )   DROP TABLE public."StructuresLanguages";
       public         heap    gpp_user    false    2            �            1259    16718    UsersTokens    TABLE     �   CREATE TABLE public."UsersTokens" (
    "IdUserToken" uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "IdUser" uuid NOT NULL,
    "Token" character varying NOT NULL,
    "ValidUntil" time without time zone NOT NULL
);
 !   DROP TABLE public."UsersTokens";
       public         heap    gpp_user    false    2            �            1259    16664 	   countries    TABLE     �   CREATE TABLE public.countries (
    idcountry uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identifier character varying(50) NOT NULL,
    completed boolean DEFAULT false NOT NULL
);
    DROP TABLE public.countries;
       public         heap    gpp_user    false    2            �            1259    16489    operators_old    TABLE     
  CREATE TABLE public.operators_old (
    idoperator uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    firstname character varying(50) NOT NULL,
    lastname character varying(50) NOT NULL,
    email character varying(150) NOT NULL,
    emailconfirmed boolean DEFAULT false NOT NULL,
    emailconfirmationtoken character varying(50),
    password character varying(200) NOT NULL,
    salt character varying(50) NOT NULL,
    passwordrecoverytoken character varying(50),
    passwordrecoverydate time without time zone
);
 !   DROP TABLE public.operators_old;
       public         heap    gpp_user    false    2            �            1259    16542 
   structures    TABLE       CREATE TABLE public.structures (
    idstructure uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    idorganization uuid NOT NULL,
    alias character varying(100) NOT NULL,
    name character varying(100) NOT NULL,
    address character varying(50) NOT NULL,
    city character varying(50) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    email character varying(150),
    phonenumberprefix character(3),
    phonenumber character varying(50),
    website character varying(150)
);
    DROP TABLE public.structures;
       public         heap    gpp_user    false    2            �            1259    16449    user    TABLE       CREATE TABLE public."user" (
    iduser uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    firstname character varying(50) NOT NULL,
    lastname character varying(50) NOT NULL,
    email character varying(150) NOT NULL,
    emailconfirmed boolean DEFAULT false,
    password character varying(150) NOT NULL,
    passwordrecoverytoken character varying(150),
    passwordrecoverydate timestamp without time zone,
    permissions text,
    idnationality uuid,
    gender character varying(10),
    birthday date
);
    DROP TABLE public."user";
       public         heap    gpp_user    false    2                      0    16556 
   Categories 
   TABLE DATA           J   COPY public."Categories" ("IdCategory", "Identifier", "Type") FROM stdin;
    public          gpp_user    false    211   �s                 0    16562    CategoriesLanguages 
   TABLE DATA           t   COPY public."CategoriesLanguages" ("IdCategoryLanguage", "idCategory", "Alias", "Category", "Language") FROM stdin;
    public          gpp_user    false    212   �s                 0    16671    CountriesLanguages 
   TABLE DATA           p   COPY public."CountriesLanguages" ("IdCountryLanguage", "IdCountry", "Alias", "Country", "Language") FROM stdin;
    public          gpp_user    false    217   �s                 0    16682    CountriesTopics 
   TABLE DATA           X   COPY public."CountriesTopics" ("IdCountryTopic", "IdCountry", "Identifier") FROM stdin;
    public          gpp_user    false    218   �s                 0    16693    CountriesTopicsLanguages 
   TABLE DATA           x   COPY public."CountriesTopicsLanguages" ("IdCountryTopicLanguage", "IdCountryTopic", "Topic", "Description") FROM stdin;
    public          gpp_user    false    219   t                 0    16707 	   Documents 
   TABLE DATA           �   COPY public."Documents" ("IdDocument", "IdUser", "Title", "Bytes", "WidthPixel", "HeightPixel", "FileFolder", "ImageFolder", "Extension") FROM stdin;
    public          gpp_user    false    220    t       
          0    16466    Nationalities 
   TABLE DATA           H   COPY public."Nationalities" ("IdNationality", "Identifier") FROM stdin;
    public          gpp_user    false    204   =t                 0    16472    NationalitiesLanguages 
   TABLE DATA           �   COPY public."NationalitiesLanguages" ("IdNationalityLanguage", "IdNationality", "Alias", "Nationality", "Language") FROM stdin;
    public          gpp_user    false    205   Zt                 0    16523    OperatorsInvitations 
   TABLE DATA           �   COPY public."OperatorsInvitations" ("IdOperatorInvitation", "IdOperatorSender", "IdOperatorRecipient", "Message", "AccessLevel", "Accepted") FROM stdin;
    public          gpp_user    false    209   wt                 0    16496    Organizations 
   TABLE DATA           Q   COPY public."Organizations" ("IdOrganization", "IdOperator", "Name") FROM stdin;
    public          gpp_user    false    207   �t                 0    16507    OrganizationsOperators 
   TABLE DATA           {   COPY public."OrganizationsOperators" ("IdOrganizationOperator", "IdOrganization", "IdOperator", "AccessLevel") FROM stdin;
    public          gpp_user    false    208   �t                 0    16573    StructuresCategories 
   TABLE DATA           d   COPY public."StructuresCategories" ("IdStructureCategory", "IdStructure", "idCategory") FROM stdin;
    public          gpp_user    false    213   �t                 0    16653    StructuresImages 
   TABLE DATA           v   COPY public."StructuresImages" ("IdStructureImage", "IdStructure", "ImageFolder", "ImageFile", "Sorting") FROM stdin;
    public          gpp_user    false    215   �t                 0    16604    StructuresLanguages 
   TABLE DATA           p   COPY public."StructuresLanguages" ("IdStructureLanguage", "IdStructure", "Description", "Language") FROM stdin;
    public          gpp_user    false    214   u                 0    16718    UsersTokens 
   TABLE DATA           W   COPY public."UsersTokens" ("IdUserToken", "IdUser", "Token", "ValidUntil") FROM stdin;
    public          gpp_user    false    221   %u                 0    16664 	   countries 
   TABLE DATA           E   COPY public.countries (idcountry, identifier, completed) FROM stdin;
    public          gpp_user    false    216   Bu                 0    16489    operators_old 
   TABLE DATA           �   COPY public.operators_old (idoperator, firstname, lastname, email, emailconfirmed, emailconfirmationtoken, password, salt, passwordrecoverytoken, passwordrecoverydate) FROM stdin;
    public          gpp_user    false    206   �u                 0    16542 
   structures 
   TABLE DATA           �   COPY public.structures (idstructure, idorganization, alias, name, address, city, latitude, longitude, email, phonenumberprefix, phonenumber, website) FROM stdin;
    public          gpp_user    false    210   w       	          0    16449    user 
   TABLE DATA           �   COPY public."user" (iduser, firstname, lastname, email, emailconfirmed, password, passwordrecoverytoken, passwordrecoverydate, permissions, idnationality, gender, birthday) FROM stdin;
    public          gpp_user    false    203   2w       k           2606    16567 ,   CategoriesLanguages CategoriesLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."CategoriesLanguages"
    ADD CONSTRAINT "CategoriesLanguages_pkey" PRIMARY KEY ("IdCategoryLanguage");
 Z   ALTER TABLE ONLY public."CategoriesLanguages" DROP CONSTRAINT "CategoriesLanguages_pkey";
       public            gpp_user    false    212            i           2606    16561    Categories Categories_pkey 
   CONSTRAINT     f   ALTER TABLE ONLY public."Categories"
    ADD CONSTRAINT "Categories_pkey" PRIMARY KEY ("IdCategory");
 H   ALTER TABLE ONLY public."Categories" DROP CONSTRAINT "Categories_pkey";
       public            gpp_user    false    211            s           2606    16676 *   CountriesLanguages CountriesLanguages_pkey 
   CONSTRAINT     }   ALTER TABLE ONLY public."CountriesLanguages"
    ADD CONSTRAINT "CountriesLanguages_pkey" PRIMARY KEY ("IdCountryLanguage");
 X   ALTER TABLE ONLY public."CountriesLanguages" DROP CONSTRAINT "CountriesLanguages_pkey";
       public            gpp_user    false    217            w           2606    16701 6   CountriesTopicsLanguages CountriesTopicsLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."CountriesTopicsLanguages"
    ADD CONSTRAINT "CountriesTopicsLanguages_pkey" PRIMARY KEY ("IdCountryTopicLanguage");
 d   ALTER TABLE ONLY public."CountriesTopicsLanguages" DROP CONSTRAINT "CountriesTopicsLanguages_pkey";
       public            gpp_user    false    219            u           2606    16687 $   CountriesTopics CountriesTopics_pkey 
   CONSTRAINT     t   ALTER TABLE ONLY public."CountriesTopics"
    ADD CONSTRAINT "CountriesTopics_pkey" PRIMARY KEY ("IdCountryTopic");
 R   ALTER TABLE ONLY public."CountriesTopics" DROP CONSTRAINT "CountriesTopics_pkey";
       public            gpp_user    false    218            q           2606    16670    countries Countries_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public.countries
    ADD CONSTRAINT "Countries_pkey" PRIMARY KEY (idcountry);
 D   ALTER TABLE ONLY public.countries DROP CONSTRAINT "Countries_pkey";
       public            gpp_user    false    216            y           2606    16712    Documents Documents_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_pkey" PRIMARY KEY ("IdDocument");
 F   ALTER TABLE ONLY public."Documents" DROP CONSTRAINT "Documents_pkey";
       public            gpp_user    false    220            ]           2606    16477 2   NationalitiesLanguages NationalitiesLanguages_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."NationalitiesLanguages"
    ADD CONSTRAINT "NationalitiesLanguages_pkey" PRIMARY KEY ("IdNationalityLanguage");
 `   ALTER TABLE ONLY public."NationalitiesLanguages" DROP CONSTRAINT "NationalitiesLanguages_pkey";
       public            gpp_user    false    205            [           2606    16471     Nationalities Nationalities_pkey 
   CONSTRAINT     o   ALTER TABLE ONLY public."Nationalities"
    ADD CONSTRAINT "Nationalities_pkey" PRIMARY KEY ("IdNationality");
 N   ALTER TABLE ONLY public."Nationalities" DROP CONSTRAINT "Nationalities_pkey";
       public            gpp_user    false    204            e           2606    16530 .   OperatorsInvitations OperatorsInvitations_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."OperatorsInvitations"
    ADD CONSTRAINT "OperatorsInvitations_pkey" PRIMARY KEY ("IdOperatorInvitation");
 \   ALTER TABLE ONLY public."OperatorsInvitations" DROP CONSTRAINT "OperatorsInvitations_pkey";
       public            gpp_user    false    209            _           2606    16495    operators_old Operators_pkey 
   CONSTRAINT     d   ALTER TABLE ONLY public.operators_old
    ADD CONSTRAINT "Operators_pkey" PRIMARY KEY (idoperator);
 H   ALTER TABLE ONLY public.operators_old DROP CONSTRAINT "Operators_pkey";
       public            gpp_user    false    206            c           2606    16512 2   OrganizationsOperators OrganizationsOperators_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."OrganizationsOperators"
    ADD CONSTRAINT "OrganizationsOperators_pkey" PRIMARY KEY ("IdOrganizationOperator");
 `   ALTER TABLE ONLY public."OrganizationsOperators" DROP CONSTRAINT "OrganizationsOperators_pkey";
       public            gpp_user    false    208            a           2606    16501     Organizations Organizations_pkey 
   CONSTRAINT     p   ALTER TABLE ONLY public."Organizations"
    ADD CONSTRAINT "Organizations_pkey" PRIMARY KEY ("IdOrganization");
 N   ALTER TABLE ONLY public."Organizations" DROP CONSTRAINT "Organizations_pkey";
       public            gpp_user    false    207            m           2606    16578 .   StructuresCategories StructuresCategories_pkey 
   CONSTRAINT     �   ALTER TABLE ONLY public."StructuresCategories"
    ADD CONSTRAINT "StructuresCategories_pkey" PRIMARY KEY ("IdStructureCategory");
 \   ALTER TABLE ONLY public."StructuresCategories" DROP CONSTRAINT "StructuresCategories_pkey";
       public            gpp_user    false    213            o           2606    16658 &   StructuresImages StructuresImages_pkey 
   CONSTRAINT     x   ALTER TABLE ONLY public."StructuresImages"
    ADD CONSTRAINT "StructuresImages_pkey" PRIMARY KEY ("IdStructureImage");
 T   ALTER TABLE ONLY public."StructuresImages" DROP CONSTRAINT "StructuresImages_pkey";
       public            gpp_user    false    215            g           2606    16550    structures Structures_pkey 
   CONSTRAINT     c   ALTER TABLE ONLY public.structures
    ADD CONSTRAINT "Structures_pkey" PRIMARY KEY (idstructure);
 F   ALTER TABLE ONLY public.structures DROP CONSTRAINT "Structures_pkey";
       public            gpp_user    false    210            {           2606    16726    UsersTokens UsersTokens_pkey 
   CONSTRAINT     i   ALTER TABLE ONLY public."UsersTokens"
    ADD CONSTRAINT "UsersTokens_pkey" PRIMARY KEY ("IdUserToken");
 J   ALTER TABLE ONLY public."UsersTokens" DROP CONSTRAINT "UsersTokens_pkey";
       public            gpp_user    false    221            Y           2606    16455    user Users_pkey 
   CONSTRAINT     U   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY (iduser);
 =   ALTER TABLE ONLY public."user" DROP CONSTRAINT "Users_pkey";
       public            gpp_user    false    203            �           2606    16589 7   CategoriesLanguages CategoriesLanguages_IdCategory_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CategoriesLanguages"
    ADD CONSTRAINT "CategoriesLanguages_IdCategory_fkey" FOREIGN KEY ("idCategory") REFERENCES public."Categories"("IdCategory") ON DELETE CASCADE NOT VALID;
 e   ALTER TABLE ONLY public."CategoriesLanguages" DROP CONSTRAINT "CategoriesLanguages_IdCategory_fkey";
       public          gpp_user    false    211    2921    212            �           2606    16677 4   CountriesLanguages CountriesLanguages_IdCountry_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CountriesLanguages"
    ADD CONSTRAINT "CountriesLanguages_IdCountry_fkey" FOREIGN KEY ("IdCountry") REFERENCES public.countries(idcountry) ON DELETE CASCADE;
 b   ALTER TABLE ONLY public."CountriesLanguages" DROP CONSTRAINT "CountriesLanguages_IdCountry_fkey";
       public          gpp_user    false    2929    216    217            �           2606    16702 E   CountriesTopicsLanguages CountriesTopicsLanguages_IdCountryTopic_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."CountriesTopicsLanguages"
    ADD CONSTRAINT "CountriesTopicsLanguages_IdCountryTopic_fkey" FOREIGN KEY ("IdCountryTopic") REFERENCES public."CountriesTopics"("IdCountryTopic") ON DELETE CASCADE;
 s   ALTER TABLE ONLY public."CountriesTopicsLanguages" DROP CONSTRAINT "CountriesTopicsLanguages_IdCountryTopic_fkey";
       public          gpp_user    false    219    2933    218            �           2606    16732    Documents Documents_IdUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Documents"
    ADD CONSTRAINT "Documents_IdUser_fkey" FOREIGN KEY ("IdUser") REFERENCES public."user"(iduser) ON DELETE CASCADE NOT VALID;
 M   ALTER TABLE ONLY public."Documents" DROP CONSTRAINT "Documents_IdUser_fkey";
       public          gpp_user    false    203    2905    220            |           2606    16478 @   NationalitiesLanguages NationalitiesLanguages_IdNationality_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."NationalitiesLanguages"
    ADD CONSTRAINT "NationalitiesLanguages_IdNationality_fkey" FOREIGN KEY ("IdNationality") REFERENCES public."Nationalities"("IdNationality") ON DELETE CASCADE NOT VALID;
 n   ALTER TABLE ONLY public."NationalitiesLanguages" DROP CONSTRAINT "NationalitiesLanguages_IdNationality_fkey";
       public          gpp_user    false    2907    204    205            �           2606    16536 B   OperatorsInvitations OperatorsInvitations_IdOperatorRecipient_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."OperatorsInvitations"
    ADD CONSTRAINT "OperatorsInvitations_IdOperatorRecipient_fkey" FOREIGN KEY ("IdOperatorRecipient") REFERENCES public.operators_old(idoperator) ON DELETE CASCADE;
 p   ALTER TABLE ONLY public."OperatorsInvitations" DROP CONSTRAINT "OperatorsInvitations_IdOperatorRecipient_fkey";
       public          gpp_user    false    2911    209    206                       2606    16531 ?   OperatorsInvitations OperatorsInvitations_IdOperatorSender_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."OperatorsInvitations"
    ADD CONSTRAINT "OperatorsInvitations_IdOperatorSender_fkey" FOREIGN KEY ("IdOperatorSender") REFERENCES public.operators_old(idoperator) ON DELETE CASCADE;
 m   ALTER TABLE ONLY public."OperatorsInvitations" DROP CONSTRAINT "OperatorsInvitations_IdOperatorSender_fkey";
       public          gpp_user    false    206    209    2911            ~           2606    16599 =   OrganizationsOperators OrganizationsOperators_IdOperator_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."OrganizationsOperators"
    ADD CONSTRAINT "OrganizationsOperators_IdOperator_fkey" FOREIGN KEY ("IdOperator") REFERENCES public.operators_old(idoperator) ON DELETE CASCADE NOT VALID;
 k   ALTER TABLE ONLY public."OrganizationsOperators" DROP CONSTRAINT "OrganizationsOperators_IdOperator_fkey";
       public          gpp_user    false    2911    208    206            }           2606    16594 +   Organizations Organizations_IdOperator_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Organizations"
    ADD CONSTRAINT "Organizations_IdOperator_fkey" FOREIGN KEY ("IdOperator") REFERENCES public.operators_old(idoperator) ON DELETE CASCADE NOT VALID;
 Y   ALTER TABLE ONLY public."Organizations" DROP CONSTRAINT "Organizations_IdOperator_fkey";
       public          gpp_user    false    2911    207    206            �           2606    16584 9   StructuresCategories StructuresCategories_IdCategory_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."StructuresCategories"
    ADD CONSTRAINT "StructuresCategories_IdCategory_fkey" FOREIGN KEY ("idCategory") REFERENCES public."Categories"("IdCategory") ON DELETE CASCADE;
 g   ALTER TABLE ONLY public."StructuresCategories" DROP CONSTRAINT "StructuresCategories_IdCategory_fkey";
       public          gpp_user    false    211    213    2921            �           2606    16579 :   StructuresCategories StructuresCategories_IdStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."StructuresCategories"
    ADD CONSTRAINT "StructuresCategories_IdStructure_fkey" FOREIGN KEY ("IdStructure") REFERENCES public.structures(idstructure) ON DELETE CASCADE;
 h   ALTER TABLE ONLY public."StructuresCategories" DROP CONSTRAINT "StructuresCategories_IdStructure_fkey";
       public          gpp_user    false    210    2919    213            �           2606    16659 2   StructuresImages StructuresImages_IdStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."StructuresImages"
    ADD CONSTRAINT "StructuresImages_IdStructure_fkey" FOREIGN KEY ("IdStructure") REFERENCES public.structures(idstructure) ON DELETE CASCADE;
 `   ALTER TABLE ONLY public."StructuresImages" DROP CONSTRAINT "StructuresImages_IdStructure_fkey";
       public          gpp_user    false    2919    210    215            �           2606    16611 8   StructuresLanguages StructuresLanguages_IdStructure_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."StructuresLanguages"
    ADD CONSTRAINT "StructuresLanguages_IdStructure_fkey" FOREIGN KEY ("IdStructure") REFERENCES public.structures(idstructure) ON DELETE CASCADE;
 f   ALTER TABLE ONLY public."StructuresLanguages" DROP CONSTRAINT "StructuresLanguages_IdStructure_fkey";
       public          gpp_user    false    214    210    2919            �           2606    16551 )   structures Structures_IdOrganization_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.structures
    ADD CONSTRAINT "Structures_IdOrganization_fkey" FOREIGN KEY (idorganization) REFERENCES public."Organizations"("IdOrganization") ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.structures DROP CONSTRAINT "Structures_IdOrganization_fkey";
       public          gpp_user    false    207    210    2913            �           2606    16727 #   UsersTokens UsersTokens_IdUser_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."UsersTokens"
    ADD CONSTRAINT "UsersTokens_IdUser_fkey" FOREIGN KEY ("IdUser") REFERENCES public."user"(iduser) ON DELETE CASCADE NOT VALID;
 Q   ALTER TABLE ONLY public."UsersTokens" DROP CONSTRAINT "UsersTokens_IdUser_fkey";
       public          gpp_user    false    221    2905    203                  x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �      
      x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �            x������ � �         X   x��1� ��RC���]\*���8o/o~Px۬S�HP2!	�WK=C�E�����ׁڻVB�O23��A��K"a<v7�{_b�?��         [  x�U��j�1���w��,K�uk��X� ��-�,l��������BAh��$k!���p��G󎙼[�Ǘ�����|�N��׷;
�H�O������z}.��RH�U�R'2�X�R��z�ٹkd�aB@c�3L�Z�l�:�]d��� !��Nc�Оb�>ٖ��6-ҙ�3��WU��T�bs�������K��Y�>�uQ��o:܅i�'��1I�H��o�����,���n(����� t��M�f�-m�	*��.���vo)̘��ڱ����&�P���3d�>ǈ�{�ڷW��cP�ڸ[�tku�5C=2N|�֥�n\�\\V�3|�K+�����r��qc�"            x������ � �      	   �   x�=�M�0 �����c���[f�H)E�6�����I�_Q��ᥔ{{�A����A��c 2w؜3�G>{9�b kA��b��/��O˺â5���6�-�G<�"���.g��1���$c���a��ۗ�Q�'qr@��TzRG�����lb���`#����v�Gx�e����io��<�     