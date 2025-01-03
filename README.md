<a id="readme-top"></a>

<!--PROJECT NAME-->
<h1 align="center">Vidly</h1>
<p align="center">Rent, Watch & Return</p>
<br />

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#technologies">Technologies</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <ul>
      <li><a href="#prerequisites">Prerequisites</a></li>
      <li><a href="#installation">Installation</a></li>
    </ul>
  </ol>
</details>

# About The Project ❓
Vidly is a backend application used to rent movies to customers. The application can allow users to view available movies for rent and their genres and also return movies. Logged-in users can view all available movies for rent, rent a movie (which the app can collect information about the user like their name, address, etc, and change the stock of the movie), view all genres, and return a movie (where the app will calculate the number of days the movie was rented for which it will use to calculate the rental fee for renting the movie). This application also allows authorized users to view all its customers, genres (add, edit, or delete), movies (add, edit, or delete), rentals (add, edit, or delete), returns (add, edit, or delete) and its users (customers and employees).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Technologies 🚀
Vidly was built using a JavaScript framework called Node.js plus Express (for building our RESTful service) and MongoDB (for storing data). I picked these tools as they are easy to use and learn, scalable, and fast at processing data and requests made by clients

<p align="right">(<a href="#readme-top">back to top</a>)</p>

# Getting Started 🏃🏽‍♂️
These are instructions on how to run the application

## Prerequisites
Software or tools you need to install before installing and running the application
* Download the latest version of Node at https://nodejs.org/en
* MongoDB

## Installation
These are instructions on how to install the application
* Clone the application from this current repository
* Install dependencies
```
npm i
```
* Assign API key using terminal
```
$env:vidly_jwtPrivatekey="mySecureKey"
```
* Run application
```
node app.js
```
<p align="right">(<a href="#readme-top">back to top</a>)</p>
