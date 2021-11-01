import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'

import { bookType } from '../../types/index.js'
import conn from '../../utils/connection.js'
const model = conn.books

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: 'Books Query',
        fields: () => ({
            book: {
                type: bookType,
                description: 'A Single Book',
                args: {
                    id: { type: GraphQLInt }
                },
                resolve: (parent, args) => model.findOne({ where: { id: args.id } })
            },
            books: {
                type: new GraphQLList(bookType),
                description: 'List of All Books',
                resolve: () => model.findAll()
            }
        })
    }),
    mutation: new GraphQLObjectType({
        name: 'Mutation',
        description: 'Books Mutation',
        fields: () => ({
            addBook: {
                type: bookType,
                description: 'Add a book',
                args: {
                    title: { type: GraphQLNonNull(GraphQLString) },
                    authorId: { type: GraphQLNonNull(GraphQLInt) }
                },
                resolve: (parent, args) => model.create(args)
            },
            updateBook: {
                type: bookType,
                description: 'Update a book',
                args: {
                    id: { type: GraphQLNonNull(GraphQLInt) },
                    title: { type: GraphQLString },
                    authorId: { type: GraphQLInt }
                },
                resolve: async (parent, args) => {
                    await model.update(args, { where: { id: args.id } })
                    return model.findOne({ where: { id: args.id } })
                }
            },
            deleteBook: {
                type: GraphQLString,
                description: 'Delete a book',
                args: {
                    id: { type: GraphQLNonNull(GraphQLInt) }
                },
                resolve: (parent, args) => model.destroy({ where: { id: args.id } })
            }
        })
    })
})

export default { schema }