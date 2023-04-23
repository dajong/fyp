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
  ownerEmail: {
    type: String,
    required: [true, "Owner email is required"]
  },
  slug: String,
  city: {
    type: String,
    required: [true, "City value is required"]
  },
  listingNum: {
    type: Number,
    required: [true, "Listing number value is required"]
  },
  propertyStyle: {
    type: String,
    required: [true, "Property Style value is required"],
    enum: {
      values: [
        "Bungalow",
        "Semi-detached",
        "Detached",
        "Cottage",
        "Terrace",
        "Duplex",
        "Condo",
        "Apartment",
        "Others"
      ],
      message: "Please pick a property style"
    }
  },
  garageType: {
    type: String,
    required: [true, "Garage Type value is required"],
    enum: {
      values: ["Attached", "Detached", "Carport"],
      message: "Please pick a garage type"
    }
  },

  garageSize: {
    type: Number,
    required: [true, "Lot Size value is required"]
  },

  berRating: {
    type: String,
    required: [true, "Ber rating value is required"],
    enum: {
      values: [
        "A1",
        "A2",
        "A3",
        "B1",
        "B2",
        "B3",
        "C1",
        "C2",
        "C3",
        "D1",
        "D2",
        "E1",
        "E2",
        "F",
        "G"
      ],
      message: "Please pick a value"
    }
  },

  squareFeet: {
    type: Number,
    default: 1,
    required: [true, "Ber rating value is required"]
  },

  lotSize: {
    type: String,
    required: [true, "Lot Size value is required"]
  },

  numBedroom: {
    type: Number,
    default: 1,
    min: [1, "Number of bedrooms must be above 1.0"]
  },
  numBathroom: {
    type: Number,
    default: 1,
    min: [1, "Number of bathrooms must be above 1.0"]
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
  createdAt: {
    type: Date,
    default: Date.now()
  },
  rented: {
    type: Boolean,
    default: false
  },
  renter: String,
  nftContract: String,
  propertyViews: Number,
  userApplied: [String],
  archive: {
    type: Boolean,
    default: false
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
