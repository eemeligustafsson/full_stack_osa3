const { request, response } = require("express");
const express = require("express");
const morgan = require("morgan");
const app = express();
require('dotenv').config()
const Person = require('./models/person')


app.use(express.json());
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
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    response.status(404).end();
  } else {
    response.json(person);
  }
});
const generateId = () => {
  return Math.floor(Math.random() * 100000);
};

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  response.status(204).end();
});
app.post("/api/persons", (request, response) => {
  const body = request.body;
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
});

app.get("/info", (request, response) => {
  const len = persons.length;
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

const PORT =  process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
