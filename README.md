# PropertyPro <a href="https://codeclimate.com/github/fegzycole/PropertyPro/maintainability"><img src="https://api.codeclimate.com/v1/badges/11b9ca2ed76e72892cee/maintainability" /></a> [![Coverage Status](https://coveralls.io/repos/github/fegzycole/PropertyPro/badge.svg?branch=develop)](https://coveralls.io/github/fegzycole/PropertyPro?branch=develop) [![Build Status](https://travis-ci.com/fegzycole/PropertyPro.svg?branch=develop)](https://travis-ci.com/fegzycole/PropertyPro)

Property Pro Lite is a platform where people can create and/or search properties for sale or rent.


## Required Features
- User can sign up.
- User can sign in.
- User (agent) can post a property advert.
- User (agent) can update the details of a property advert.
- User (agent) can mark his/her posted advert as sold.
- User (agent) can delete a property advert.
- User can view all properties adverts.
- User can view all properties of a specific type.
- User can view a specific property advert.


## Options Features
- User can reset password.
- flag/report a posted AD as fraudulent.
- User can add multiple pictures to a posted ad.
- The application should display a Google Map with Marker showing the red-flag or intervention location.

## Technologies

- HTML5
- CSS3
- Javascript
- Node JS
- Express
- Mocha & Chai
- ESLint
- Babel
- Travis CI
- Code Climate & Coveralls


## Requirements and Installation

To install and run this project you would need to have listed stack installed:

- Node Js
- Git

To run:

```sh
git clone <https://github.com/fegzycole/PropertyPro.git>
cd PropertyPro
npm install
npm start-dev
```

## Testing

```sh
npm run test
```

## API-ENDPOINTS

- V1

`- POST /api/v1/auth/signup Create a new user account.`

`- POST /api/v1/auth/signin log a user in.`

`- POST /api/v1/property List a new property.`

`- PATCH /api/v1/property/<property-id> Update property data.`

`- PATCH /api/v1/property/<property-id>/sold Mark a property as sold.`

`- DELETE /api/v1/property/<property-id> Delete a property advert.`

`- GET /api/v1/property/<property-id> Get all property adverts.`

`- GET /api/v1/property/<property-id>?type=propertyType Get all property advertisement offering a specific type of property.`


## Pivotal Tracker stories

[https://www.pivotaltracker.com/n/projects/2354159]


## Template UI

You can see a hosted version of the template at [https://fegzycole.github.io/PropertyPro/](https://fegzycole.github.io/PropertyPro/)


## API

Hosted on [https://propertypro.herokuapp.com/](https://propertypro.herokuapp.com/)


## Author

Iyara Oghenefegor Ferguson


