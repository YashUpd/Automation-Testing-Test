import envConfig from '../../config/environment.js';

export const users = {
  validUser: {
    email: envConfig.credentials.email,
    password: envConfig.credentials.password,
  },
  invalidUser: {
    email: 'invalid.user@techbrawn.com',
    password: 'WrongPassword@123',
  },
  emptyCredentials: {
    email: '',
    password: '',
  },
  emptyEmail: {
    email: '',
    password: envConfig.credentials.password,
  },
  emptyPassword: {
    email: envConfig.credentials.email,
    password: '',
  },
  wrongCasePassword: {
    email: envConfig.credentials.email,
    password: envConfig.credentials.password.toLowerCase(),
  },
  malformedEmails: [
    'plainaddress',
    'missing-at-sign.com',
    '@no-local-part.com',
    'user@.missing-domain',
    'user@domain with space.com',
  ],
  securityPayLoads: {
    sqlInjection: {
      email: "' OR '1'='1",
      password: "' OR '1'='1",
    },
    xssInjection: {
      email: '<script>alert("xss")</script>@test.com',
      password: '<img src=x onerror=alert(1)>',
    },
    specialCharacters: {
      email: '!#$%&*+-/=?^_`{|}~@special.com',
      password: '§±!@#$%^&*()_+|}{":?><',
    },
    unicodeAndEmojis: {
      email: 'user🚀@test🔒.com',
      password: 'Password🔑123!@#',
    },
  },
  boundaryValues: {
    excessivelyLongEmail: 'a'.repeat(250) + '@domain.com',
    excessivelyLongPassword: 'P'.repeat(500),
  },
  whitespacePadded: {
    email: `   ${envConfig.credentials.email}   `,
    password: envConfig.credentials.password,
  },
};

export default users;
