export const CredentialsSchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    userType: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      minlenght: 8,
    },
  },
};

export const CredentialsRequestBody = {
  description: 'The Input of login function',
  required: true,
  content: {
    'application/json': { schema: CredentialsSchema }
  }
}
