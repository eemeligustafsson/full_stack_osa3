const { request, response } = require("express");
const express = require("express");
const morgan = require("morgan");
const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovalace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

app.use(express.json());

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
  response.json(persons);
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
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});
app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(404).json({ error: "name or number missing" });
  }
  if (persons.find((person) => person.name === body.name)) {
    return response.status(404).json({ error: "name must be unique" });
  }
  const person = {
    id: generateId,
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  response.json(person);
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

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
