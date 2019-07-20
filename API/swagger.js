export default {
  swagger: '2.0',
  info: {
    description: 'API Documentation for PropertyPro',
    version: '1.0.0',
    title: 'PropertyPro',
  },
  host: 'propertypro.herokuapp.com',
  basePath: '/api/v1',
  tags: [
    {
      name: 'Auth',
      description: 'Handles User Signup and Signin',
    },
    {
      name: 'Property',
      description: 'Handles Creation, Updating, Deleting and Getting Of Properties',
    },
  ],
  schemes: ['http', 'https'],
  paths: {
    '/auth/signup': {
      post: {
        tags: ['Auth'],
        summary: 'Create a user account',
        description: '',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'body',
            required: true,
            schema: {
              $ref: '#definitions/Signup',
            },
          },
        ],
        responses: {
          201: {
            description: 'successful creation of a user',
            schema: {
              $ref: '#definitions/SignupSuccessResponse',
            },
          },
          400: {
            description: 'Missing/Invalid Request Parameter',
            schema: {
              $ref: '#definitions/MissingSignUpRequestResponse',
            },
          },
          409: {
            description: 'Missing Request Parameter',
            schema: {
              $ref: '#definitions/EmailExistsResponse',
            },
          },
        },
      },
    },
    '/auth/signin': {
      post: {
        tags: ['Auth'],
        summary: 'Login a user',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'body',
            required: true,
            schema: {
              $ref: '#definitions/Signin',
            },
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              $ref: '#definitions/SignupSuccessResponse',
            },
          },
          400: {
            description: 'Missing Request Parameter',
            schema: {
              $ref: '#definitions/MissingSignInRequestResponse',
            },
          },
          401: {
            description: 'Incorrect Credentials',
            schema: {
              $ref: '#definitions/AuthenticationErrorResponse',
            },
          },
        },
      },
    },
    '/auth/{email}/reset_password': {
      post: {
        tags: ['Auth'],
        summary: 'user can reset his/her password',
        description: '',
        operationId: 'resetPassword',
        consumes: ['application/json'],
        produces: ['application/json'],
        parameters: [
          {
            name: 'email',
            in: 'path',
            description: 'email of the user that requests for a password reset',
            required: true,
            type: 'string',
          },
          {
            name: 'password',
            in: 'body',
            description: 'old password and password to replace with',
            schema: {
              type: 'object',
              properties: {
                password: {
                  type: 'string',
                  example: 'fegzycole122',
                },
                new_password: {
                  type: 'string',
                  example: 'starboy1211',
                },
              },
            },
          },
        ],
        responses: {
          204: {
            description: 'Email delivered successfully',
          },
          404: {
            description: 'Email does not exist',
            schema: {
              $ref: '#definitions/EmailNotFoundErrorResponse',
            },
          },
          400: {
            description: 'MisssingRequestParameter',
            schema: {
              $ref: '#definitions/MissingRequestResponse',
            },
          },
          422: {
            description: 'Invalid request parameter',
            schema: {
              $ref: '#definitions/InvalidParameterResponse',
            },
          },
        },
      },
    },
    '/property': {
      get: {
        tags: ['Property'],
        summary: 'Fetch all Listed Properties',
        produces: ['application/json'],
        parameters: [
          {
            in: 'header',
            name: 'x-access-token',
            required: true,
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              $ref: '#definitions/GetAllPropertiesResponse',
            },
          },
        },
      },
      post: {
        tags: ['Property'],
        summary: 'List a new property',
        consumes: ['multipart/form-data'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'header',
            name: 'x-access-token',
            required: true,
          },
          {
            name: 'type',
            in: 'formData',
            description: 'Type of the property',
            required: true,
            type: 'string',
          },
          {
            name: 'state',
            in: 'formData',
            description: 'state where the property is situated',
            required: true,
            type: 'string',
          },
          {
            name: 'city',
            in: 'formData',
            description: 'The city where the property is situated',
            required: true,
            type: 'string',
          },
          {
            name: 'address',
            in: 'formData',
            description: 'address of the property',
            required: true,
            type: 'string',
          },
          {
            name: 'price',
            in: 'formData',
            description: 'price of the property',
            required: true,
            type: 'string',
          },
          {
            name: 'image_url',
            in: 'formData',
            description: 'Image of the property to be listed',
            required: true,
            type: 'file',
          },
        ],
        responses: {
          201: {
            description: 'successful operation',
            schema: {
              $ref: '#definitions/PostPropertySuccessResponse',
            },
          },
          400: {
            description: 'Misssing/Invalid Request Parameter',
            schema: {
              $ref: '#definitions/MissingPropertyPostResponse',
            },
          },
          401: {
            description: 'User not logged in',
            schema: {
              $ref: '#definitions/UserNotLoggedInErrorResponse',
            },
          },
        },
      },
    },
    '/property?type=propertyType': {
      get: {
        tags: ['Property'],
        summary: 'Fetch all Properties of a specific type',
        produces: ['application/json'],
        parameters: [
          {
            in: 'header',
            name: 'x-access-token',
            required: true,
          },
          {
            name: 'type',
            in: 'query',
            description: 'type of property to fetch',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              $ref: '#definitions/GetAllPropertiesResponse',
            },
          },
        },
      },
    },
    '/property/{id}': {
      get: {
        tags: ['Property'],
        summary: 'Get a specific property',
        produces: ['application/json'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
          },
          {
            in: 'header',
            name: 'x-access-token',
            required: true,
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              $ref: '#definitions/GetAPropertySuccessResponse',
            },
          },
          404: {
            description: 'Property Not Found',
            schema: {
              $ref: '#definitions/PropertyNotFoundErrorResponse',
            },
          },
        },
      },
      patch: {
        tags: ['Property'],
        summary: 'Update the details of a listed property',
        consumes: ['multipart/form-data'],
        produces: ['application/json'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
          },
          {
            in: 'header',
            name: 'x-access-token',
            required: true,
          },
          {
            name: 'type',
            in: 'formData',
            description: 'Type of the property',
            required: false,
            type: 'string',
          },
          {
            name: 'state',
            in: 'formData',
            description: 'state where the property is situated',
            required: false,
            type: 'string',
          },
          {
            name: 'city',
            in: 'formData',
            description: 'The city where the property is situated',
            required: false,
            type: 'string',
          },
          {
            name: 'address',
            in: 'formData',
            description: 'address of the property',
            required: false,
            type: 'string',
          },
          {
            name: 'price',
            in: 'formData',
            description: 'price of the property',
            required: false,
            type: 'string',
          },
          {
            name: 'image_url',
            in: 'formData',
            description: 'Image of the property to be listed',
            required: false,
            type: 'file',
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              $ref: '#definitions/PostPropertySuccessResponse',
            },
          },
          400: {
            description: 'Misssing/Invalid Request Parameter',
            schema: {
              $ref: '#definitions/InvalidPropertyUpdateResponse',
            },
          },
          404: {
            description: 'Property Not Found',
            schema: {
              $ref: '#definitions/PropertyNotFoundErrorResponse',
            },
          },
        },
      },
      delete: {
        tags: ['Property'],
        summary: 'Delete a listed property',
        produces: ['application/json'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
          },
          {
            in: 'header',
            name: 'x-access-token',
            required: true,
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              $ref: '#definitions/PropertyDeletedResponse',
            },
          },
          404: {
            description: 'Property Not Found',
            schema: {
              $ref: '#definitions/PropertyNotFoundErrorResponse',
            },
          },
        },
      },
    },
    '/property/{id}/sold': {
      get: {
        tags: ['Property'],
        summary: 'Get a specific property',
        produces: ['application/json'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
          },
          {
            in: 'header',
            name: 'x-access-token',
            required: true,
          },
        ],
        responses: {
          200: {
            description: 'successful operation',
            schema: {
              $ref: '#definitions/GetASoldPropertySuccessResponse',
            },
          },
          404: {
            description: 'Property Not Found',
            schema: {
              $ref: '#definitions/PropertyNotFoundErrorResponse',
            },
          },
        },
      },
    },
  },
  definitions: {
    Signup: {
      type: 'object',
      properties: {
        first_name: {
          type: 'string',
          example: 'Oghenefegor',
        },
        last_name: {
          type: 'string',
          example: 'Iyara',
        },
        email: {
          type: 'string',
          example: 'fergusoniyara@gmail.com',
        },
        password: {
          type: 'string',
          example: 'fegzycole1211@',
        },
        phone_number: {
          type: 'string',
          example: '07057154467',
        },
        address: {
          type: 'string',
          example: 'No 54 Bourdillon drive',
        },
      },
    },
    Signin: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'fergusoniyara@gmail.com',
        },
        password: {
          type: 'string',
          example: 'fegzycole1211@',
        },
      },
    },
    SignupSuccessResponse: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'success',
        },
        data: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJlbWFpbCI6ImZlcmd1c29uaXlhcmFAZ21haWwuY29tIiwiZmlyc3ROYW1lIjoiT2doZW5lZmVnb3IiLCJsYXN0TmFtZSI6Ikl5YXJhIiwicGFzc3dvcmQiOiJzb21lcGFzc3dvcmQiLCJwaG9uZU51bWJlciI6IjA3MDU3MTU0NDY3IiwiYWRkcmVzcyI6IjEwMDQgSG91c2luZyBFc3RhdGVzLCBWaWN0b3JpYS1Jc2xhbmQsIExhZ29zIFN0YXRlIiwiaXNBZG1pbiI6dHJ1ZX0sImlhdCI6MTU2MjMyOTQzOCwiZXhwIjoxNTYyNDE1ODM4fQ.RYXzXtx6yM2RqGpzF8EL1RO3QwKGc1FqT5QD5wh4SsY',
            },
            id: {
              type: 'integer',
              example: 20,
            },
            first_name: {
              type: 'string',
              example: 'Oghenefegor',
            },
            last_name: {
              type: 'string',
              example: 'Iyara',
            },
            email: {
              type: 'string',
              example: 'fergusoniyara@gmail.com',
            },
          },
        },
      },
    },
    MissingSignUpRequestResponse: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'error',
        },
        error: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              example: 'email cannot be empty',
            },
            first_name: {
              type: 'string',
              example: 'First Name/Last Name cannot be empty',
            },
            last_name: {
              type: 'string',
              example: 'First Name/Last Name cannot be empty',
            },
            phone_number: {
              type: 'string',
              example: 'Phone Number Name cannot be empty',
            },
            password: {
              type: 'string',
              example: 'password cannot be empty',
            },
            address: {
              type: 'string',
              example: 'Address cannot be empty',
            },
          },
        },
      },
    },
    MissingSignInRequestResponse: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'error',
        },
        error: {
          type: 'object',
          properties: {
            email: {
              type: 'string',
              example: 'email cannot be empty',
            },
            password: {
              type: 'string',
              example: 'password cannot be empty',
            },
          },
        },
      },
    },
    MissingPropertyPostResponse: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'error',
        },
        error: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              example: 'state cannot be empty',
            },
            city: {
              type: 'string',
              example: 'city cannot be empty',
            },
            address: {
              type: 'string',
              example: 'address cannot be empty',
            },
            property_type: {
              type: 'string',
              example: 'type Name cannot be empty',
            },
            price: {
              type: 'string',
              example: 'price cannot be empty',
            },
            image: {
              type: 'string',
              example: 'image cannot be empty',
            },
          },
        },
      },
    },
    InvalidPropertyUpdateResponse: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'error',
        },
        error: {
          type: 'object',
          properties: {
            state: {
              type: 'string',
              example: 'invalid state selected',
            },
            city: {
              type: 'string',
              example: 'invalid city selected',
            },
            address: {
              type: 'string',
              example: 'invalid address selected',
            },
            property_type: {
              type: 'string',
              example: 'invalid property type selected',
            },
            price: {
              type: 'string',
              example: 'invalid price selected',
            },
          },
        },
      },
    },
    EmailExistsResponse: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'error',
        },
        error: {
          type: 'string',
          example: 'Email already exists',
        },
      },
    },
    AuthenticationErrorResponse: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'error',
        },
        error: {
          type: 'string',
          example: 'Authentication Failed. Incorrect Email or Password',
        },
      },
    },
    GetAllPropertiesResponse: {
      type: 'array',
      items: {
        properties: {
          id: {
            type: 'integer',
            example: 22,
          },
          status: {
            type: 'string',
            example: 'Sold',
          },
          type: {
            type: 'string',
            example: '2 Bedroom',
          },
          state: {
            type: 'string',
            example: 'Lagos State',
          },
          city: {
            type: 'string',
            example: 'Ikoyi',
          },
          address: {
            type: 'string',
            example: 'No 54 Bourdillon drive, Ikoyi',
          },
          price: {
            type: 'decimal',
            example: 6500000.65,
          },
          created_on: {
            type: 'string',
            format: 'date-time',
          },
          owner_email: {
            type: 'string',
            example: 'fergusoniyara@gmail.com',
          },
          owner_phone_number: {
            type: 'string',
            example: '07057154467',
          },
        },
      },
    },
    GetAPropertySuccessResponse: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 22,
        },
        status: {
          type: 'string',
          example: 'Available',
        },
        type: {
          type: 'string',
          example: '2 Bedroom',
        },
        state: {
          type: 'string',
          example: 'Lagos State',
        },
        city: {
          type: 'string',
          example: 'Ikoyi',
        },
        address: {
          type: 'string',
          example: 'No 54 Bourdillon drive, Ikoyi',
        },
        price: {
          type: 'decimal',
          example: 6500000.65,
        },
        created_on: {
          type: 'string',
          format: 'date-time',
        },
        image_url: {
          type: 'string',
          example: 'https://res.cloudinary.com/propertypro/image/upload/v1561326667/iiyxnceemy20eeincxiof.jpg',
        },
        owner_email: {
          type: 'string',
          example: 'fergusoniyara@gmail.com',
        },
        owner_phone_number: {
          type: 'string',
          example: '07057154467',
        },
      },
    },
    GetASoldPropertySuccessResponse: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 22,
        },
        status: {
          type: 'string',
          example: 'Sold',
        },
        type: {
          type: 'string',
          example: '2 Bedroom',
        },
        state: {
          type: 'string',
          example: 'Lagos State',
        },
        city: {
          type: 'string',
          example: 'Ikoyi',
        },
        address: {
          type: 'string',
          example: 'No 54 Bourdillon drive, Ikoyi',
        },
        price: {
          type: 'decimal',
          example: 6500000.65,
        },
        created_on: {
          type: 'string',
          format: 'date-time',
        },
        image_url: {
          type: 'string',
          example: 'https://res.cloudinary.com/propertypro/image/upload/v1561326667/iiyxnceemy20eeincxiof.jpg',
        },
        owner_email: {
          type: 'string',
          example: 'fergusoniyara@gmail.com',
        },
        owner_phone_number: {
          type: 'string',
          example: '07057154467',
        },
      },
    },
    PostPropertySuccessResponse: {
      type: 'object',
      properties: {
        id: {
          type: 'integer',
          example: 22,
        },
        status: {
          type: 'string',
          example: 'Available',
        },
        type: {
          type: 'string',
          example: '2 Bedroom',
        },
        state: {
          type: 'string',
          example: 'Lagos State',
        },
        city: {
          type: 'string',
          example: 'Ikoyi',
        },
        address: {
          type: 'string',
          example: 'No 54 Bourdillon drive, Ikoyi',
        },
        price: {
          type: 'decimal',
          example: 6500000.65,
        },
        created_on: {
          type: 'string',
          format: 'date-time',
        },
        image_url: {
          type: 'string',
          example: 'https://res.cloudinary.com/propertypro/image/upload/v1561326667/iiyxnceemy20eeincxiof.jpg',
        },
      },
    },
    UserNotLoggedInErrorResponse: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'error',
        },
        error: {
          type: 'string',
          example: 'You do not have access to this resource',
        },
      },
    },
    PropertyNotFoundErrorResponse: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'error',
        },
        error: {
          type: 'string',
          example: 'Property with the specified Id not found',
        },
      },
    },
    PropertyDeletedResponse: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'success',
        },
        message: {
          type: 'string',
          example: 'Property successfully deleted',
        },
      },
    },
    EmailNotFoundErrorResponse: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'error',
        },
        error: {
          type: 'string',
          example: 'User with the specified email does not exist',
        },
      },
    },
  },
};
