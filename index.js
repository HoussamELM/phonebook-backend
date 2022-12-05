/* eslint-disable no-unused-vars */
require('dotenv').config()

const { request } = require('express')
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

const app = express()
app.use(express.static('build'))
app.use(express.json())

const cors = require('cors')

app.use(cors())

morgan.token('body', req => {
  return JSON.stringify(req.body)
})



app.get('/', (req, res) => {
  res.send('<h1>Hello</h1>')
})

app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.name === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  const opts = { runValidators: true }

  person.save(opts)
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  const counter = 0
  let date = Date()

  res.send(`<h1>Phonebook has info for ${counter} people</h1><h2>${date}</h2>`)
})

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      res.json(person)
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (req, res, next) => {

  const personExists = Person.findById(req.params.id)
  if (!personExists) {
    return res.status(400).json({
      error: 'The person doesnt exist in the phonebook',
    })
  }else{
    Person.findByIdAndRemove(req.params.id)
      .then(
        res.json({ success: true })
      )
      .catch(error => { next(error) })
  }
})



const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})

