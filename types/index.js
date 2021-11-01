import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'
import conn from '../utils/connection.js'

const bookType = new GraphQLObjectType({
    name: 'Book',
    description: 'This represent a book written by an author',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        title: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
        author: {
            type: authorType,
            resolve: (book) => {
                return conn.authors.findOne({ where: { id: book.authorId } })
            }
        }
    })
})

const authorType = new GraphQLObjectType({
    name: 'Author',
    description: 'This represents an author of a book',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLNonNull(GraphQLString) },
        books: {
            type: new GraphQLList(bookType),
            resolve: (author) => {
                return conn.books.findAll({ where: { authorId: author.id } })
            }
        }
    })
})

export { bookType, authorType }