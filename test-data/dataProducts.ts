export const testData = {
    search: {
        validItem: 'Hammer',
        invalidItem: 'Nimbus 2000'
    },

    categories: {
        handTools: 'Hand Tools',
        powerTools: 'Power Tools',
        negativeTools: 'Hand Saw',
        handToolsId: 3 // This is the internal ID used by the API for Hand Tools
    },
  
    user: {
        email: 'customer2@practicesoftwaretesting.com',
        password: 'welcome01',
        firstName: 'Jack',
        lastName: 'Howe'
    },
    
    invalidUser: {
        email: 'not_a_user@example.com',
        password: 'wrongpassword'
    },
    
    noOrdersUser: {
        email: "customer3@practicesoftwaretesting.com",
        password: "pass123"
    },

    checkout: {
        address: '123 Test Street',
        city: 'Birmingham',
        state: 'West Midlands',
        country: 'UK',
        postcode: '12345'
    }
};
