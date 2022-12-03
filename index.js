const { request } = require("express");
const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

const cors = require('cors')

app.use(cors())

const PORT = 3001
app.listen(PORT, () => {
    console.log(`server is running on PORT ${PORT}`)
})

morgan.token('body', req => {
    return JSON.stringify(req.body)
})



let persons = 
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get("/", (req, res) => {
    res.send('<h1>Hello</h1>');
})

app.get("/api/persons", (req, res) =>{
    res.json(persons);
})

app.get("/info", (req, res)=>{
    const counter = persons.length
    let date = Date()
    
    res.send(`<h1>Phonebook has info for ${counter} people</h1><h2>${date}</h2>`)
})

app.get("/api/persons/:id",(req,res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if(person){
        res.json(person)
    }
    res.status(404).end();
})

app.post("/api/persons", morgan(':method :url :status :res[content-length] - :response-time ms :body'), (req, res) =>{

    const body = req.body
    const newPerson = {
        id: Math.floor(Math.random() * 9999999),
        name: body.name,
        number: body.number,
    }

    if(!body.name || !body.number){
        res.status(400).json({
            Error: "Missing name or number"
    });
    }else{

        const found = persons.some(person => person.name === body.name);

        if(!found){
            persons = persons.concat(newPerson)
            res.json(body)
        }else
        res.status(400).json({
            Error: `${body.name} already exists in the phone book`
            
    });
    }
})


app.delete("/api/persons/:id", (req,res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()   
})


