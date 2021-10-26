import Crypto from 'crypto'
import express from 'express'
import { buildSchema } from 'graphql'
import { graphqlHTTP } from 'express-graphql'

const app = express()
const PORT = process.env.PORT || 3000

// Construct a schema, using GraphQL schema language
//String! = non-nullable string, [Int] = list of Integer
let messageSchema = buildSchema(`
    input MessageInput {
        content: String
        author: String
    }

    type Message {
        id: ID!
        content: String
        author: String
    }

    type Query {
        getMessage(id: ID!): Message
    }

    type Mutation {
        createMessage(input: MessageInput): Message
        updateMessage(id: ID!, input: MessageInput): Message
        deleteMessage(id: ID!): String
    }
`)

//If message had any complex fields, we'd put them on this object
class Message {
    constructor(id, {content, author}) {
        this.id = id
        this.content = content
        this.author = author
    }
}

let fakeDatabase = {}

let root = {
    getMessage: ({id}) => {
        if (!fakeDatabase[id]) {
            throw new Error('no message exist with id ' + id)
        }
        
        return new Message(id, fakeDatabase[id])
    },
    createMessage: ({input}) => {
        //create random id for our db
        let id = Crypto.randomBytes(10).toString('hex')

        fakeDatabase[id] = input
        return new Message(id, input)
    },
    updateMessage: ({id, input}) => {
        if (!fakeDatabase[id]) {
            throw new Error('No message exist with id '+ id)
        }

        //This replaces all old data, but some apps might want partial update
        fakeDatabase[id] = input
        return new Message(id, input)
    },
    deleteMessage: ({id}) => {
        if (!fakeDatabase[id]) {
            throw new Error('No Message exist with id ' + id)
        }

        delete fakeDatabase[id]
        return 'Message deleted successfully'
    }
}

app.use('/graphql', graphqlHTTP({
    schema: messageSchema,
    rootValue: root,
    graphiql: true
}))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})