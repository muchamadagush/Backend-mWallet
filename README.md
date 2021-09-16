<p align="center">

  <h3 align="center">Z-Wallet</h3>
  <p align="center">
    <image align="center" width="200" src='./screenshots/logo.png' />
  </p>

  <p align="center">
    <br />
    <a href="https://github.com/AdmiralYuuShi/Frontend-HiringChannelApp-WithRedux"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://zwallet-matrix.vercel.app/">View Demo</a>
    ·
    <a href="https://github.com/19damah23/Backend-mWallet/issues">Report Bug</a>
    ·
    <a href="https://github.com/19damah23/Backend-mWallet/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Installation](#installation)
* [Screenshots](#screenshots)
* [Contact](#contact)



<!-- ABOUT THE PROJECT -->
## About The Project


Zwallet is a digital wallet apps that will really helps you to manage your e-money. Using Zwallet you’ll be allowed to do some transaction with only a few taps on your screen. In other words, with this apps you can easily save money, transfer it to other, and also top up some moneys and add them to your Zwallet’s balance.

### Built With

* [NodeJs](https://nodejs.org/)
* [ExpressJs](http://expressjs.com/)
* [MySQL](https://www.mysql.com/)
* [NodeMailer](https://nodemailer.com/)
* [JWT](https://jwt.io/)
* [Xendit](https://www.xendit.co/)


<!-- GETTING STARTED -->
## Getting Started
### Installation

1. Clone the repo
```sh
git clone https://github.com/19damah23/Backend-mWallet.git
```
2. Install NPM packages
```sh
npm install
```
3. Add .env file at root folder project, and add following
```sh
DB_NAME = [DB_NAME]
DB_HOST = [DB_HOST]
DB_USER = [DB_USER]
DB_PASS = [DB_PASS]

PORT = [PORT]

ACCESS_TOKEN_SECRET = [ACCESS_TOKEN_SECRET]

ZWALLET_EMAIL = [ZWALLET_EMAIL]
ZWALLET_PASS = [ZWALLET_PASS]

BASE_URL = [BACKEND_URL]
FRONT_URL = [FRONTEND_URL]
```

4. Make a new database and import [zwallet-sample.sql](https://drive.google.com/file/d/1WwWDDorXfAUq7dJIgupJ_MKBlELKkMc4/view?usp=sharing)

5. Starting application
```sh
npm run dev
```
6. Testing with Postman
    * [Zwallet API Documentation](https://documenter.getpostman.com/view/13709692/Tzz4RfES#acbbeee4-4be5-4a99-8185-24f2c3ea10c6)

### Related Project
* [`Frontend-Zwallet`](https://github.com/19damah23/zwallet)
* [`Backend-Zwallet`](https://github.com/19damah23/Backend-mWallet)

## Zwallet API Documentation

* [Zwallet API Documentation](https://documenter.getpostman.com/view/13709692/Tzz4RfES#acbbeee4-4be5-4a99-8185-24f2c3ea10c6)

## Contributors

<center>
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/farrelvarian">
          <img width="100" src="https://avatars.githubusercontent.com/u/42968960?v=4" alt="Farrel Varian Eka Putra"><br/>
          <sub><b>Farrel Varian Eka Putra</b></sub> <br/>
          <sub>Full Stack Web Developer</sub>
        </a>
      </td>
      <td align="center">
        <a href="https://github.com/19damah23">
          <img width="100" src="https://media-exp1.licdn.com/dms/image/C5603AQG98I3VT9Wc5g/profile-displayphoto-shrink_800_800/0/1630549889980?e=1637193600&v=beta&t=EL-sEsGitFv9TeZofjNhs7fVZa0RxLSwxhyqhF3Xt8A" alt="Muchamad Agus Hermawan"><br/>
          <sub><b>Muchamad Agus Hermawan</b></sub> <br/>
          <sub>Back End Developer</sub>
        </a>
      </td>
    </tr>
  </table>
</center>