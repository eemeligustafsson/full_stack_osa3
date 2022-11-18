const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}
const password = process.argv[2];
const url = `mongodb+srv://eemelifullstack:${password}@cluster0.9hrxjd4.mongodb.net/puhelinluetteloApp?retryWrites=true&w=majority`;
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("puhelinluettelo");
    result.forEach((person) => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
}
if (process.argv.length === 5) {
  const name = process.argv[3];
  const number = process.argv[4];
  const person = new Person({
    name: name,
    number: number,
  });
  person.save().then(() => {
    console.log(`added ${name} number ${number} to Phonebook.`);
    mongoose.connection.close();
  });
}
if (process.argv.length > 3 && process.argv.length < 5) {
    console.log('you must provide a name and a number.')
    mongoose.connection.close()
}
if (process.argv.length > 5) {
    mongoose.connection.close()
}
