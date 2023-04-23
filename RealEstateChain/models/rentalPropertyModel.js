const mongoose = require("mongoose");
const slugify = require("slugify");

const rentalPropertySchema = new mongoose.Schema({
  address: {
    type: String,
    required: [true, "A rental property must have an address"],
    unique: true,
    trim: true,
    maxlength: [
      200,
      "A property address must have less or equal than 200 characters"
    ],
    minlength: [
      10,
      "A property address must have more or equal than 10 characters"
    ]
  },
  slug: String,
  city: {
    type: String,
    required: [true, "City value is required"]
  },
  rent: {
    type: Number,
    required: [true, "Rent value is required"]
  },
  securityDeposit: {
    type: Number,
    required: [true, "Security deposit value is required"]
  },
  description: {
    type: String,
    trim: true,
    required: [true, "Description is required"]
  },
  imageCover: {
    type: String,
    required: [true, "Image cover is required"]
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now()
  },
  rented: {
    type: Boolean,
    default: false
  },
  renter: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }
});
rentalPropertySchema.index({ slug: 1 });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
rentalPropertySchema.pre("save", function(next) {
  this.slug = slugify(this.address, { lower: true });
  next();
});

// QUERY MIDDLEWARE

rentalPropertySchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const RentalProperty = mongoose.model("RentalProperty", rentalPropertySchema);

module.exports = RentalProperty;
