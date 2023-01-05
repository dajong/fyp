const mongoose = require("mongoose");
const slugify = require("slugify");

const propertySchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: [true, "A property must have an address"],
      unique: true,
      trim: true
    },

    // slug: String,

    // Number of bedrooms
    numBedrooms: {
      type: Number,
      required: [true, "At least one bedroom in the property"]
    },

    // Number of bathrooms
    numBathrooms: {
      type: Number,
      required: [true, "At least one bathroom in the property"]
    },

    // City
    city: {
      type: String,
      required: [true, "Value of city is required"]
    },

    description: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"]
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a cover image"]
    },
    images: [String]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
propertySchema.pre("save", function(next) {
  // this.slug = slugify(this.name, { lower: true });
  next();
});

// propertySchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// propertySchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// propertySchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// propertySchema.pre('find', function(next) {
propertySchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

propertySchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// AGGREGATION MIDDLEWARE
// propertySchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

//   console.log(this.pipeline());
//   next();
// });

const Property = mongoose.model("Property", propertySchema);

module.exports = Property;
