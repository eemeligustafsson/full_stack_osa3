const { request, response } = require("express");
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors")
require('dotenv').config()
const Person = require('./models/person')


app.use(express.json());
app.use(cors());
app.use(express.static('build'))

app.use(
  morgan((tokens, request, response) => {
    return [
      tokens.method(request, response),
      tokens.url(request, response),
      tokens.status(request, response),
      tokens.res(request, response, "content-length"),
      "-",
      tokens["response-time"](request, response),
      "ms",
      JSON.stringify(request.body),
    ].join(" ");
  })
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id)
  .then(person => {
    if (person) {
        response.json(person.toJSON())
    } else {
        response.status(404).end()
    }
  })
});

const generateId = () => {
  return Math.floor(Math.random() * 100000);
};

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save()
  .then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))
});
app.put("/api/persons/:id", (request, response, next) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
        response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.get("/info", (request, response) => {
  const len = Person.length
  const currentDate = new Date().toLocaleString();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  response.send(`
    <div>
        <p>Phonebook has info for ${len} people</p>
    </div>
    <div>
        <p>${currentDate} (${timeZone})</p>
    </div>`);
});
const errorHandler = (error, request, response, next) =>{
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'bad format for id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    } 
    next(error)
}
app.use(errorHandler)

const PORT =  process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
