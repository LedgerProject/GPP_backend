<!-- PROJECT LOGO -->
<br />
<p>
  <h3>Global Passport Project Backend</h3>
  <img src="logo.png" />
</p>

<!-- GETTING STARTED -->
## Table of contents

* [Global Passport Project](#global-passport-project)
* [Build with](#built-with)
* [Software Used](#software-used)
* [Side technologies](#side-technologies)
* [Directory structure](#directory-structure)
* [Starting a development environment](#starting-a-development-environment)
* [Available scripts](#available-scripts)
* [How the backend works](#how-the-backend-works)

## Global Passport Project

Global Passport Project is a breakthrough initiative that leverages on decentralized technology to support mixed migrants along their journey, protect
their privacy while reporting human rights violations, and engage them as citizens integrating in their new communities. GPP will also enormously
improve the capacity of NGOs and social enterprises to reach out to migrants and design their actions, thus streamlining their resources and improving
their performance and records when applying for funds and calls.

GPP is a blockchain-based platform with a website and mobile App through which mixed migrants can safely store important documents, access info on
the countries crossed and the solidarity network in the area they are in, as well as report on abuses they might face along the journey. All data is personal
and inviolable, and it will be kept on Blockchain with a double-level encryption component.

* GPP’s key tool is the first ever DocWallet, a unique and innovative "safe space" where migrants can scan and upload their ID, educational or medical
records that might get lost during their journey or might not be convenient to keep them physically with them. The lack of documentation is often a
key issue in the migratory process.

* GPP App will provide the user with a detailed and comprehensive mapping of solidarity structures in transit/destination countries: upon voluntary
geolocalization, an interactive map will provide information on the structures (i.e. associations, collectives, unions, NGOs, lawyers, humanitarian
protection) and also up-to-date information on the legislation in force in every country and territory crossed.

* GPP is also a multimedia tool for mixed migrant to report and document abuses faced along the journey after being provided with a brief tutorial on
citizen journalism.

The platform is designed WITH migrants rather than FOR migrants: they are the main and ultimate beneficiaries of this project, whose aim is to enable
them to embark in safer journeys and experience an easier settling, but also to engage them as active subjects of participatory democracy practices and a
narrative process that will start from their first hand experiences as narrating subjects rather than narrated ones.

It is meant to serve as an innovative tool also for the third sector (NGOs, aid agencies) to access information and first-hand data that go beyond
government control and a useful tool to improve and strengthen their interventions. GPP may also contribute to an in-depth reconsideration of the
operational modalities which are very often blamed for adopting a top-down approach. The possibility to receive detailed information and to be able to
directly get in contact with their targets and potential beneficiaries will allow to improve the effectiveness and efficiency of their actions, and ensure a
streamlined use of the resources.

## Built with

* [Node.js](https://nodejs.org)
* [Typescript](https://www.typescriptlang.org)
* [Loopback 4](https://loopback.io/doc/en/lb4)
* [PostgreSQL](https://www.postgresql.org)

## Software used

* [npm](https://www.npmjs.com)
* [Visual Studio Code](https://code.visualstudio.com)
* [PGAdmin4](https://www.pgadmin.org)
* [Postman](https://www.postman.com)
* [GitHub](https://github.com)

## Side technologies

### Production dependencies

* zenroom: a secure and small virtual machine for crypto language processing.
* jsonwebtoken: JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties.
* loopback/authentication: a LoopBack 4 component for authentication support based on JWT authentication strategy.
* loopback/boot: a convention based project Bootstrapper and Booters for LoopBack Applications.
* loopback/cli: LoopBack CLI tool for creating controllers, models, repositories and more.
* loopback/context: Current context for LoopBack applications, based on cls-hooked.
* loopback/core: provides the foundation for the LoopBack app.
* loopback/cron: schedule jobs using cron based schedule.
* loopback/openapi-spec-builder: create OpenAPI specification documents in your tests using the builder pattern.
* loopback/openapi-v3: decorators that describe LoopBack artifacts as OpenAPI 3.0.0 metadata and utilities that transfer LoopBack metadata to OpenAPI 3.0.0 specifications.
* loopback/repository: this module provides a common set of interfaces for interacting with databases.
* loopback/rest: this component provides a REST server for your application instances.
* loopback/rest-explorer: this module contains a component adding a self-hosted REST API Explorer to LoopBack applications.
* loopback/service-proxy: this module provides a common set of interfaces for interacting with service oriented backends such as REST APIs, SOAP Web Services, and gRPC microservices.
* loopback-connector-openapi: the Swagger connector enables LoopBack applications to interact with other REST APIs described.
* loopback-connector-postgresql: PostgreSQL connector for the LoopBack framework.
* dotenv: a zero-dependency module that loads environment variables from a .env file into process.env.
* bcryptjs: optimized bcrypt in JavaScript with zero dependencies.
* types/bcryptjs: this package contains type definitions for bcryptjs.
* multer: middleware for handling multipart/form-data, which is primarily used for uploading files.
* types/multer: this package contains type definitions for multer.
* compress-images: minify size of images. Image compression with extension: jpg/jpeg, svg, png, gif.
* image-size: module to get dimensions of any image file.
* image-to-base64: generate a base64 code from an image through a URL or a path.
* isemail: email address validation library.
* js-base64: base64 transcoder.
* salted-md5: salted MD5 hash.
* sendgrid/mail: Twilio SendGrid node.js mail services.
* export-to-excel: export data to Excel.
* xlsx-import: import data from an xlsx file using configured pattern and defined typescript types.
* ipfs-http-client: a client library for the IPFS HTTP API.
* keypair-lib: component to generate and regenerate a keypair, in a deterministic and private way.
* nano-ipfs-store: lightweight library to store and get data to/from IPFS.
* uuid: ror the creation of RFC4122 UUIDs.


### Development dependencies

* typescript: a language for application-scale JavaScript.
* loopback/build: this module contains a set of common scripts and default configurations to build LoopBack 4 or other TypeScript modules.
* loopback/eslint-config: ESLint config to enforce a consistent code style for LoopBack development.
* loopback/testlab: a collection of test utilities used to write LoopBack tests.
* types/node: this package contains type definitions for Node.js.
* types/uuid: this package contains type definitions for uuid.
* typescript-eslint/eslint-plugin: an ESLint plugin which provides lint rules for TypeScript codebases.
* typescript-eslint/parser: an ESLint parser which leverages TypeScript ESTree to allow for ESLint to lint TypeScript source code.
* eslint: tool for identifying and reporting on patterns found in ECMAScript/JavaScript code.
* eslint-config-prettier: turns off all rules that are unnecessary or might conflict with [Prettier].
* eslint-plugin-eslint-plugin: an ESLint plugin for linting ESLint plugins.
* eslint-plugin-mocha: ESLint rules for mocha.
* source-map-support: this module provides source map support for stack traces in node via the V8 stack trace API.

## Directory structure

* public: public directory, contains index to reach Swagger and the structures images
* src: TypeScript source code, having the following structure:
  * authentication-strategies: definition of JSON web token (JWT) authentication strategy.
  * authorization: definition of users permissions, and token.
  * controllers: implements operations defined by the application’s API. It implements the application’s business logic and acts as a bridge between the HTTP/REST API and domain/database models.
  * datasources: configuration for a Connector instance that represents data in an external system.
  * interceptors: reusable functions to provide aspect-oriented logic around method invocations.
  * models: describes objects, for example, users, categories, structures. Defines a list of properties with name, type, and other constraints.
  * repositories: specialized Service interface that provides strong-typed data access (for example, CRUD) operations of a domain model against the underlying database or service.
  * scenarios: various zenroom scenarious.
  * services: various services functions.

## Starting a development environment

### Prerequisites

* npm and node.js: first of all install npm and node.js (https://nodejs.org/it/download/)

* PostgreSQL: then install PostgreSQL (https://www.postgresql.org/) and restore the database file in this repository named backup-db.sql

### Configure the environment

Open a terminal and make a clone of this repository on your machine:

```sh
git clone https://github.com/LedgerProject/GPP_backend
```

Install the npm packages. Go to the project directory and run:

```sh
npm install
```

After the modules installation, make a copy of the env-example named .env and edit the new file.

```sh
# SERVER PARAMETERS
HOST=<enter the server host for node.js>
PORT=<enter the server port for node.js>

# POSTGRESQL DATABASE PARAMETERS
DB_DATASOURCE=GppDataSource
DB_HOST=<enter the database host>
DB_PORT=<enter the database port>
DB_USER=<enter the database user>
DB_PWD=<enter the database password>
DB_NAME=<enter the database name>

# ICONS DIMENSIONS
ICON_HEIGHT=<height of the icon image in pixel>
ICON_WIDTH=<width of the icon image in pixel>
MARKER_HEIGHT=<height of the marker image in pixel>
MARKER_WIDTH=<width of the marker image in pixel>

# ENCRYPT MAGIC SALT
SALT=<salt used to encrypt files chunks>

# GLOBAL PASSPORT PROJECT OPERATOR KEY
GPP_REGISTRATION_KEY=<key used to register global passport project operator>

# IPFS
IPFS_GATEWAY=<ipfs gateway>

# SENDGRID
SENDGRID_API_KEY=<twilio sendgrid api key for sending emails>

# PORTAL
PORTAL_URL=<portal url>

# FANTOM CONFIGURATION
FANTOM_WRITE_ENDPOINT=<fantom write endpoint>
FANTOM_READ_ENDPOINT=<fantom read endpoint>

# BACKEND CREDENTIALS
BACKEND_PRIVATE_KEY=<backend private key>
BACKEND_PUBLIC_KEY=<backend public key>
BACKEND_PASSWORD=<backend password>

# CHANGE HERE TO OVERRIDE THE CONTRACTS
# SERVER_SIDE_CONTRACT=<zenroom server side contract>
# CLIENT_SIDE_CONTRACT=<zenroom client side contract>

# CHANGE HERE TO OVERRIDE FOLDER OR FILENAME default: prop/questions-en_GB.json
QUESTION_FOLDER=<question folder>
QUESTION_FILE_PREPEND=<question file prepend>

# ADMINISTRATOR E-MAILS
ADMIN_EMAILS=<admin emails separated by comma>
```

Here an example

```sh
# SERVER PARAMETERS
HOST=localhost
PORT=3000

# POSTGRESQL DATABASE PARAMETERS
DB_DATASOURCE=GppDataSource
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PWD=my_very_strong_password
DB_NAME=gpp_db

# ICONS DIMENSIONS
ICON_HEIGHT=48
ICON_WIDTH=48
MARKER_HEIGHT=37
MARKER_WIDTH=32

# ENCRYPT MAGIC SALT
SALT=my_very_strong_salt

# GLOBAL PASSPORT PROJECT OPERATOR KEY
GPP_REGISTRATION_KEY=my_very_strong_gpp_password

# IPFS
IPFS_GATEWAY=http://127.0.0.1:5001

# SENDGRID
SENDGRID_API_KEY=SG.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# PORTAL
PORTAL_URL=https://www.myawesomeportalurl.com

# FANTOM CONFIGURATION
FANTOM_WRITE_ENDPOINT=http://xxx.xxx.xxx.xxx:xxxx
FANTOM_READ_ENDPOINT=http://xxx.xxx.xxx.xxx:xxxx

# BACKEND CREDENTIALS
BACKEND_PRIVATE_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX=
BACKEND_PUBLIC_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX=
BACKEND_PASSWORD=my-awesome-backend-password

# CHANGE HERE TO OVERRIDE THE CONTRACTS
# SERVER_SIDE_CONTRACT=<zenroom server side contract>
# CLIENT_SIDE_CONTRACT=<zenroom client side contract>

# CHANGE HERE TO OVERRIDE FOLDER OR FILENAME default: prop/questions-en_GB.json
QUESTION_FOLDER=<question folder>
QUESTION_FILE_PREPEND=<question file prepend>

# ADMINISTRATOR E-MAILS
ADMIN_EMAILS=<admin emails separated by comma>
```

Finally run this script and wait that the service start:

```sh
npm start
```

If everything went well, you should see something like this:

```sh
Server is running at http://127.0.0.1:3001
Try http://127.0.0.1:3001/ping
```

## Available scripts

To compile the project run:

```sh
npm run build
```

To compile the project in watch mode run:

```sh
npm run build:watch
```

To clean the project run:

```sh
npm run clean
```

To clean and compile the project run:

```sh
npm run pretest
```

To run the project run:

```sh
npm start
```

## How the backend works

Please visit (https://www.globalpassportproject.org) for more information.