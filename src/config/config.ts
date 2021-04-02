export default {
    DB: {
        URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/party_rental',
        USER: process.env.USER || '',
        PASSWORD: process.env.PASSWORD || ''
    },
    JWT: {
        jwtSecret: process.env.JWT_SECRET || 'jwt secret',
        expiresIn: 60 * 60 * 24     // 1 day
    }
}