export default {
    DB: {
        URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/party_rental',
        USER: process.env.USER || '',
        PASSWORD: process.env.PASSWORD || ''
    },
    JWT: {
        JWT_SECRET: process.env.JWT_SECRET || 'jwt secret',
        JWT_RESEST_PASSWORD_SECRET: process.env.JWT_SECRET || 'jwt reset password secret',
        EXPIRES_IN_TOKEN: 60 * 60 * 24,     // 1 day
        EXPIRES_IN_LINK: 60 * 20            // 20 minutes
    },
    EMAIL: {
        HOST: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        USER: process.env.EMAIL_USER || 'maureen8@ethereal.email',
        PASSWORD: process.env.EMAIL_PASSWORD || 'q36qUAgQFZRHCH5Xty'
    },
    CLIENT_URL: {
        PASSWORD_RESET: 'http://localhost:4200/change-password'
    }
}