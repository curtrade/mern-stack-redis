const swaggerUi = require('swagger-ui-express')
const swaggerJsdoc = require('swagger-jsdoc')

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'API for short links application',
            version: '1.0.0',
            descriptiom: '',
            contact: { name: 'Eugeny Shelomyantsev' },
            servers: ['http://localhost:5000']
        },
        basePath: '/api/'
    },
    apis: ['./routes/*.js']
}

const swaggerDocs = swaggerJsdoc(swaggerOptions)

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
}
