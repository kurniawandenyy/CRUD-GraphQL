import express from 'express'

import route from './route.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', route)

/** Not Found Handler */
app.use((req, res, next) => {
    let err = new Error('URL Not Found!')
    err.status = 404
    next(err)
})

/** Global Error Handler */
app.use((err, req, res, next) => {
    let response = {
        status: err.status,
        message: err.message,
        data: null
    }

    return res.status(err.status).json(response)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})