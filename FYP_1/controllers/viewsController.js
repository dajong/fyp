//
// const Property = require("../models/propertyModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const Tour = require("../models/tourModel");
const AppError = require("../utils/appError");
const Booking = require("../models/bookingModel");

exports.getOverview = catchAsync(async (req, res, next) => {
  const { difficulty, duration, minPrice, maxPrice } = req.query;
  const mDuration = duration === "" ? 0 : Number(duration);
  const mMinprice = minPrice === "" ? 0 : Number(minPrice);
  const mMaxPrice = maxPrice === "" ? Number.MAX_VALUE : Number(maxPrice);

  const tours = await Tour.find()
    .where("difficulty")
    .equals(difficulty)
    .where("duration")
    .gte(mDuration)
    .where("price")
    .gte(mMinprice)
    .lte(mMaxPrice);

  res.status(200).render("overview", {
    title: "Search Results",
    tours
  });
});

exports.getHomePage = catchAsync(async (req, res, next) => {
  const difficulties = ["easy", "medium", "difficult"];

  res.status(200).render("home_page", {
    title: "Home",
    difficulties
  });
});

exports.getRegistrationPage = catchAsync(async (req, res, next) => {
  res.status(200).render("registration_page", {
    title: "Sign Up"
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user"
  });

  if (!tour) {
    return next(new AppError("There is no tour with that name.", 404));
  }

  // 2) Build template
  // 3) Render template using data from 1)
  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account"
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

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Find tours with the returned IDs
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render("overview", {
    title: "My Tours",
    tours
  });
});
