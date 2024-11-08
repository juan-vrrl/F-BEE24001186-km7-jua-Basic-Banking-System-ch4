import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Basic Banking System API',
      version: '1.0.0',
      description: 'API docs for Basic Banking System',
    },
    servers: [
      {
        url: `${process.env.MAIN_URL}/api/v1`,
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', 
          description: 'Enter your token in here:',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the user',
            },
            name: {
              type: 'string',
              description: 'Name of the user',
            },
            email: {
              type: 'string',
              description: 'Email address of the user',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time when the user was created',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time when the user was last updated',
            },
          },
        },
        BankAccount: {
          type: 'object',
          required: ['bankName', 'bankAccountNumber', 'balance', 'userId'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the bank account',
            },
            bankName: {
              type: 'string',
              description: 'Name of the bank',
            },
            bankAccountNumber: {
              type: 'string',
              description: 'Account number of the bank account',
            },
            balance: {
              type: 'number',
              format: 'float',
              description: 'Current balance of the bank account',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time when the account was created',
            },
            userId: {
              type: 'integer',
              description: 'ID of the user associated with the account',
            },
          },
        },
        Transaction: {
          type: 'object',
          required: ['id', 'amount', 'sourceAccountId', 'destinationAccountId', 'transactionTime'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the transaction',
            },
            amount: {
              type: 'number',
              format: 'float',
              description: 'Amount transferred in the transaction',
            },
            transactionTime: {
              type: 'string',
              format: 'date-time',
              description: 'The date and time when the transaction occurred',
            },
            sourceAccountId: {
              type: 'integer',
              description: 'ID of the source bank account',
            },
            destinationAccountId: {
              type: 'integer',
              description: 'ID of the destination bank account',
            },
          },
        },
        Profile: {
          type: 'object',
          required: ['identityType', 'identityNumber', 'address'],
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier for the profile',
            },
            identityType: {
              type: 'string',
              description: 'Type of identity (e.g., National ID, Passport)',
            },
            identityNumber: {
              type: 'string',
              description: 'Identity number associated with the user',
            },
            address: {
              type: 'string',
              description: 'Address of the user',
            },
            profilePicture: {
              type: 'string',
              description: 'URL of the user\'s profile picture',
            },
            profilePictureId: {
              type: 'string',
              description: 'Public ID of the user\'s profile picture',
            },
            userId: {
              type: 'integer',
              description: 'ID of the user associated with this profile',
            },
          },
        },
        Post: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the post',
            },
            title: {
              type: 'string',
              description: 'The title of the post',
            },
            description: {
              type: 'string',
              description: 'The content of the post',
            },
            contentUrl: {
              type: 'string',
              description: 'The URL of the post image',
            },
            fileId: {
              type: 'string',
              description: 'The public ID of the post image',
            },
            authorId: {
              type: 'integer',
              description: 'The ID of the author who created the post',
            },
            createdAt: {
              type: 'string',
              description: 'The date and time when the post was created',
            },
            updatedAt: {
              type: 'string',
              description: 'The date and time when the post was last updated',
            },
          },
        },
        BankAccountWithUser: {
          allOf: [
            { $ref: '#/components/schemas/BankAccount' },
            {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User',
                },
              },
            },
          ],
        },
        UserWithProfile: {
          allOf: [
            { $ref: '#/components/schemas/User' },
            {
              type: 'object',
              properties: {
                profile: {
                  $ref: '#/components/schemas/Profile',
                },
              },
            },
          ],
        },
        TransactionWithAccount: {
          allOf: [
            { $ref: '#/components/schemas/Transaction' },
            {
              type: 'object',
              properties: {
                sourceAccount: {
                  $ref: '#/components/schemas/BankAccount',
                },
                destinationAccount: {
                  $ref: '#/components/schemas/BankAccount',
                },
              },
            },
          ],
        },
        Amount: {
          type: 'object',
          properties: {
            amount: {
              type: 'number',
              format: 'float',
              description: 'The amount to deposit or withdraw',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
