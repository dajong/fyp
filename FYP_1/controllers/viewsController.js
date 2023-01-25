const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const Property = require("../models/propertyModel");
const AppError = require("../utils/appError");
const Booking = require("../models/bookingModel");

exports.getOverview = catchAsync(async (req, res, next) => {
  // const { city, numBedrooms, numBathrooms, minPrice, maxPrice } = req.query;
  // const mNumBedrooms = numBedrooms === "" ? 1 : Number(numBedrooms);
  // const mNumBathrooms = numBathrooms === "" ? 1 : Number(numBathrooms);
  const { city, minPrice, maxPrice } = req.query;
  const mMinprice = minPrice === "" ? 0 : Number(minPrice);
  const mMaxPrice = maxPrice === "" ? Number.MAX_VALUE : Number(maxPrice);

  let properties;
  if (city === "") {
    properties = await Property.find()
      .where("propertySold")
      .equals(false)
      .where("price")
      .gte(mMinprice)
      .lte(mMaxPrice)
      .sort({ propertyViews: -1 });
  } else {
    properties = await Property.find()
      .where("propertySold")
      .equals(false)
      .where("city")
      .equals(city)
      // .where("numBedrooms")
      // .gte(mNumBedrooms)
      // .where("numBedrooms")
      // .gte(mNumBathrooms)
      .where("price")
      .gte(mMinprice)
      .lte(mMaxPrice);
  }

  res.status(200).render("overview", {
    title: "Search Results",
    properties
  });
});

exports.getHomePage = catchAsync(async (req, res, next) => {
  const cities = ["Limerick", "Dublin", "Cork", "Galway"];

  res.status(200).render("home_page", {
    title: "Home",
    cities
  });
});

exports.getRegistrationPage = catchAsync(async (req, res, next) => {
  res.status(200).render("registration_page", {
    title: "Sign Up"
  });
});

exports.getCreatePropertyPage = catchAsync(async (req, res, next) => {
  const cities = ["Limerick", "Dublin", "Cork", "Galway"];
  const propertyTypes = [
    "Bungalow",
    "Semi-detached",
    "Detached",
    "Cottage",
    "Terrace",
    "Duplex",
    "Condo",
    "Apartment",
    "Others"
  ];

  const garageTypes = ["Attached", "Detached", "Carport"];

  const berRating = [
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
  ];
  res.status(200).render("createProperty", {
    title: "Create Property",
    cities,
    propertyTypes,
    garageTypes,
    berRating
  });
});

exports.getProperty = catchAsync(async (req, res, next) => {
  const property = await Property.findOne({ slug: req.params.slug });

  if (!property) {
    return next(new AppError("There is no property with that name.", 404));
  }

  await property.update({ propertyViews: property.propertyViews + 1 });
  res.status(200).render("property", {
    title: `${property.address}`,
    property
  });
});

exports.soldProperty = catchAsync(async (req, res, next) => {
  const { address } = req.body;

  const filter = { address: address };

  const update = { propertySold: true };

  const property = await Property.findOneAndUpdate(filter, update, {
    new: true
  });
  console.log(property);
  res.status(200).json({
    status: "success",
    data: {
      property
    }
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account"
  });
};

exports.forgetPassword = (req, res) => {
  res.status(200).render("forgotPassword", {
    title: "Forget Password"
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account"
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.status(200).render("account", {
    title: "Your account",
    user: updatedUser
  });
});

// exports.getMyProperties = catchAsync(async (req, res, next) => {
//   // 1) Find all bookings
//   const bookings = await Booking.find({ user: req.user.id });

//   // 2) Find properties with the returned IDs
//   const proper = bookings.map(el => el.tour);
//   const properties = await Property.find({ _id: { $in: tourIDs } });

//   res.status(200).render("overview", {
//     title: "My properties",
//     properties
//   });
// });
