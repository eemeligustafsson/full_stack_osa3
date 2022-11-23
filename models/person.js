const mongoose = require("mongoose");

const url = process.env.MONGODB_URL;

console.log("connecting to", url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const numberValidator = [
  {
    validator: (number) => {
      if ((number[2] === "-" || number[3] === "-") && number.length >= 8) {
        return true;
      }
      return false;
    },
    msg: "number must be at leats 8 digits long & be in form like xx-xxxxxxx or xxx-xxxxxxxx",
  },
  {
    validator: (number) => {
        return /^\d{2,3}-\d+$/.test(number);
    },
    msg: "number must consist of only numeric values"
  },
];

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true,
  },
  number: {
    type: String,
    validate: numberValidator,
    required: true,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
