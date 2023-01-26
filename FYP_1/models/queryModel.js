const mongoose = require("mongoose");
const validator = require("validator");

const querySchema = new mongoose.Schema({
  queryEmail: {
    type: String,
    required: [true, "Please provide your email"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  queryName: {
    type: String,
    required: [true, "Please tell us your name"]
  },
  querySubject: {
    type: String,
    required: [true, "Please put in your query subject"]
  },
  queryMessage: {
    type: String,
    required: [true, "Please put in your query message"]
  },
  replied: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
});

const Query = mongoose.model("Query", querySchema);

module.exports = Query;
