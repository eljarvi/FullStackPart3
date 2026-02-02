const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()


app.use(express.json())
app.use(cors())

morgan.token('body', req => {
    if (req.method === 'POST') return JSON.stringify(req.body)
    return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": "1"
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": "2"
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": "3"
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": "4"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(`
                <p>Phonebook has info for ${persons.length} people</p>
                <p>${new Date()}</p>
                `)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(x => x.id === id)
    if (!person) {
        return response.status(404).end()
    }
    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id

    persons = persons.filter(x => x.id !== id)

    response.status(204).end()
})

const generateId = () => {
    return String(Math.floor(Math.random() * 1000000))
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({ error: 'cannot add a person without a name' })
    } else if (!body.number) {
        return response.status(400).json({ error: 'person must have a number' })
    } else if (persons.some(x => x.name === body.name)) {
        return response.status(400).json({ error: `${body.name} is already added to phonebook` })
    }
    const person = {
        "name": body.name,
        "number": body.number,
        "id": generateId()
    }

    persons = persons.concat(person)
    response.json(person)

})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})