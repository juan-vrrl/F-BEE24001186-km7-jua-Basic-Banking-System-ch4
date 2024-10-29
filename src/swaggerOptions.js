import swaggerJsdoc from 'swagger-jsdoc';

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
        url: 'http://localhost:3000/api/v1',
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
            userId: {
              type: 'integer',
              description: 'ID of the user associated with this profile',
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
