import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'

import { authorType } from '../../types/index.js'
import conn from '../../utils/connection.js'
const model = conn.authors


const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        description: 'Authors Query',
        fields: () => ({
            author: {
                type: authorType,
                description: 'A single author',
                args: {
                    id: { type: GraphQLNonNull(GraphQLInt) }
                },
                resolve: (parent, args) => model.findOne({ where: { id: args.id } })
            },
            authors: {
                type: new GraphQLList(authorType),
                description: 'List of All Authors',
                resolve: () => model.findAll()
            },

        })
    }),
    mutation: new GraphQLObjectType({
        name: 'mutation',
        description: 'Authors Mutation',
        fields: () => ({
            addAuthor: {
                type: authorType,
                description: 'Add an author',
                args: {
                    name: { type: GraphQLNonNull(GraphQLString) }
                },
                resolve: async (parent, args) => model.create(args)
            },
            updateAuthor: {
                type: authorType,
                description: 'Update an author',
                args: {
                    id: { type: GraphQLNonNull(GraphQLInt) },
                    name: { type: GraphQLNonNull(GraphQLString) }
                },
                resolve: async (parent, args) => {
                    await model.update(args, { where: { id: args.id } })
                    return model.findOne({ where: { id: args.id } })
                }
            },
            deleteAuthor: {
                type: GraphQLString,
                description: 'Delete an author',
                args: {
                    id: { type: GraphQLNonNull(GraphQLInt) }
                },
                resolve: (parent, args) => model.destroy({ where: { id: args.id } })
            }
        })
    })
})

export default { schema }