import config from './config.js'
import Sequelize from 'sequelize'

import authorModel from '../src/authors/model.js'
import bookModel from '../src/books/model.js'

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    logging: false, //Turn off sequelize logging

    pool: {
        max: config.pool.max,
        min: config.pool.min,
        acquire: config.pool.acquire,
        idle: config.pool.idle
    }
})

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize

db.authors = authorModel(sequelize, Sequelize)
db.books = bookModel(sequelize, Sequelize)
sequelize.sync()

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err.message)
    })

export default db