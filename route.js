import express from 'express'
import { graphqlHTTP } from 'express-graphql'
const router = express.Router()

import authorSchema from './src/authors/schema.js'
import bookSchema from './src/books/schema.js'

router.get('/', (req, res) => {
    res.send({
        message: 'Welcome to GraphQL API'
    })
})

//Authors
router.use('/authors', graphqlHTTP({
    schema: authorSchema.schema,
    graphiql: true
}))

//Books
router.use('/books', graphqlHTTP({
    schema: bookSchema.schema,
    graphiql: true
}))

export default router