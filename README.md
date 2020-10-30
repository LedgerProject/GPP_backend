[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<p>
  <h3>Global Passport Project Backend</h3>
</p>

### Built With

* [Loopback 4](https://loopback.io/doc/en/lb4)
* [PostgreSQL](https://www.postgresql.org/)
* [jwt](https://jwt.io)

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* node.js, npm

```sh
npm install npm@latest -g
```

### Installation

1. Clone the repo
```sh
git clone https://github.com/antoniodibattista/gpp-backend.git
```
2. Install NPM packages
```sh
npm install
```
3. Restore the PostgreSQL database from file backup-db.sql
4. Update database details in src/datasources/gpp.datasource.config.json file
```sh
{
  "name": "GppDataSource",
  "connector": "postgresql",
  "url": "",
  "host": "localhost",
  "port": 5432,
  "user": "<your-user>",
  "password": "<your-password>",
  "database": "<your-database>"
}
```
5. Start the application
```sh
npm start
```
<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/reddimohan/loopback4-authentication-jwt-roles.svg?style=flat-square
[contributors-url]: https://github.com/reddimohan/loopback4-authentication-jwt-roles/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/reddimohan/loopback4-authentication-jwt-roles.svg?style=flat-square
[forks-url]: https://github.com/reddimohan/loopback4-authentication-jwt-roles/network/members
[stars-shield]: https://img.shields.io/github/stars/reddimohan/loopback4-authentication-jwt-roles.svg?style=flat-square
[stars-url]: https://github.com/reddimohan/loopback4-authentication-jwt-roles/stargazers
[issues-shield]: https://img.shields.io/github/issues/reddimohan/loopback4-authentication-jwt-roles.svg?style=flat-square
[issues-url]: https://github.com/reddimohan/loopback4-authentication-jwt-roles/issues
[license-shield]: https://img.shields.io/github/license/reddimohan/loopback4-authentication-jwt-roles.svg?style=flat-square
[license-url]: https://github.com/reddimohan/loopback4-authentication-jwt-roles/blob/master/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/reddimohan
[product-screenshot-1]: images/home.png
[product-screenshot-2]: images/api_docs.png
