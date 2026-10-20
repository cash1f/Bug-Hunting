export const defaultUsers = {
  admin: {
    name: 'John Doe',
    role: 'admin',
    email: 'admin@practicesoftwaretesting.com',
    password: 'welcome01'
  },
  customer1: {
    name: 'Jane Doe',
    role: 'user',
    email: 'customer@practicesoftwaretesting.com',
    password: 'welcome01'
  },
  customer2: {
    name: 'Jack Howe',
    role: 'user',
    email: 'customer2@practicesoftwaretesting.com',
    password: 'welcome01'
  },
  customer3: {
    name: 'Bob Smith',
    role: 'user',
    email: 'customer3@practicesoftwaretesting.com',
    password: 'pass123'
  }
};

export const invalidCredentials = {
  wrongPassword: 'wrongpassword123',
  invalidEmail: 'test_customer_invalid@practicesoftwaretesting.com',
  unknownEmail: 'unknown_user_9999@example.com',
  invalidEmailFormat: 'invalid-email-format',
  sqlInjection: {
    email: "' OR '1'='1",
    password: 'password'
  }
};

export const registrationData = {
  validUser: {
    firstName: 'Alex',
    lastName: 'Taylor',
    dob: '1992-06-20',
    phone: '0612345678',
    password: 'Super$ecure_Pass2026!#'
  },
  existingUser: {
    firstName: 'Jane',
    lastName: 'Doe',
    dob: '1990-01-01',
    phone: '0612345678',
    password: 'Super$ecure_Pass2026!#'
  },
  underageUser: {
    firstName: 'Young',
    lastName: 'Person',
    dob: '2012-01-01',
    phone: '0612345678',
    password: 'Super$ecure_Pass2026!#'
  },
  compromisedPasswordUser: {
    firstName: 'John',
    lastName: 'Smith',
    dob: '1990-01-01',
    phone: '0612345678',
    password: 'Secret123!'
  },
  shortPassword: 'Ab1!',
  invalidDateFormat: '01/01/2000'
};
