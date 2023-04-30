const mongoose = require("mongoose");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const Property = require("../models/propertyModel");
const RentalProperty = require("../models/rentalPropertyModel");
const Query = require("../models/queryModel");
const AppError = require("../utils/appError");

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

exports.getOverview = catchAsync(async (req, res, next) => {
  const { rent, city, minPrice, maxPrice } = req.query;
  const mMinprice = minPrice === "" ? 0 : Number(minPrice);
  const mMaxPrice = maxPrice === "" ? Number.MAX_VALUE : Number(maxPrice);

  let properties;
  if (rent === "false") {
    if (city === "") {
      properties = await Property.find()
        .where("propertySold")
        .equals(false)
        .where("biddingPrice")
        .gte(mMinprice)
        .lte(mMaxPrice)
        .sort({ propertyViews: -1 });
    } else {
      properties = await Property.find()
        .where("propertySold")
        .equals(false)
        .where("city")
        .equals(city)
        .where("biddingPrice")
        .gte(mMinprice)
        .lte(mMaxPrice)
        .sort({ propertyViews: -1 });
    }
  } else if (rent === "true") {
    if (city === "") {
      properties = await RentalProperty.find()
        .where("rented")
        .equals(false)
        .where("rent")
        .gte(mMinprice)
        .lte(mMaxPrice)
        .sort({ propertyViews: -1 });
    } else {
      properties = await RentalProperty.find()
        .where("rented")
        .equals(false)
        .where("city")
        .equals(city)
        .where("rent")
        .gte(mMinprice)
        .lte(mMaxPrice)
        .sort({ propertyViews: -1 });
    }
  }
  console.log(properties);
  res.status(200).render("overview", {
    title: "Search Results",
    properties,
    rent
  });
});

async function getPropertiesStatistics() {
  const total = await Property.countDocuments();
  const active = await Property.countDocuments({ propertySold: false });
  const sold = await Property.countDocuments({ propertySold: true });
  const avgPrice = await Property.aggregate([
    { $group: { _id: null, avgPrice: { $avg: "$price" } } }
  ]);
  const totalViews = await Property.aggregate([
    { $group: { _id: null, totalViews: { $sum: "$propertyViews" } } }
  ]);

  return {
    total,
    active,
    sold,
    avgPrice: avgPrice.length > 0 ? avgPrice[0].avgPrice : 0,
    totalViews: totalViews.length > 0 ? totalViews[0].totalViews : 0
  };
}

async function getUsersStatistics() {
  const active = await User.countDocuments({ active: true, role: "user" });
  const inactive = await User.countDocuments({ active: false, role: "user" });

  return { active, inactive };
}

exports.getHomePage = catchAsync(async (req, res, next) => {
  const _cities = await Property.distinct("city");
  const propertyStats = await getPropertiesStatistics();
  const userStats = await getUsersStatistics();

  res.status(200).render("home_page", {
    title: "Home",
    _cities,
    propertyStats,
    userStats
  });
});

exports.getRegistrationPage = catchAsync(async (req, res, next) => {
  res.status(200).render("registration_page", {
    title: "Sign Up"
  });
});

exports.getCreatePropertyPage = catchAsync(async (req, res, next) => {
  res.status(200).render("createProperty", {
    title: "Create Property",
    cities,
    propertyTypes,
    garageTypes,
    berRating
  });
});

exports.getCreateRentalPropertyPage = catchAsync(async (req, res, next) => {
  res.status(200).render("createRentalProperty", {
    title: "Create Rental Property",
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
  if (req.user) {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const isFavorite = user.favoriteProperties.includes(req.params.slug);

    res.locals.isFavorite = isFavorite;
  }

  await property.update({ propertyViews: property.propertyViews + 1 });
  res.status(200).render("property", {
    title: `${property.address}`,
    property
  });
});

exports.getEditPropertyForm = catchAsync(async (req, res, next) => {
  const property = await Property.findOne({ slug: req.params.slug });

  if (!property) {
    return next(new AppError("There is no property with that name.", 404));
  }

  res.status(200).render("editProperty", {
    title: `Edit property`,
    property,
    cities,
    propertyTypes,
    garageTypes,
    berRating
  });
});

exports.getEditRentalPropertyForm = catchAsync(async (req, res, next) => {
  const property = await RentalProperty.findOne({ slug: req.params.slug });

  if (!property) {
    return next(new AppError("There is no property with that name.", 404));
  }

  res.status(200).render("editRentalProperty", {
    title: `Edit Rental Property`,
    property,
    cities,
    propertyTypes,
    garageTypes,
    berRating
  });
});

exports.getRentalProperty = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const property = await RentalProperty.findOne({ slug: slug });
  let hasApplied = false;
  let isFavorite = false;

  if (!property) {
    return next(new AppError("There is no property with that name.", 404));
  }

  if (req.user) {
    const userId = req.user.id;
    const user = await User.findById(userId);
    isFavorite = user.favoriteProperties.includes(slug);
    hasApplied = user.propertyAppliedRental.includes(slug);
  }
  const usersApplied = await User.aggregate([
    {
      $match: {
        _id: {
          $in: property.userApplied.map(userId =>
            mongoose.Types.ObjectId(userId)
          )
        }
      }
    }
  ]);
  await property.updateOne({ propertyViews: property.propertyViews + 1 });
  res.status(200).render("rentalProperty", {
    title: `${property.address}`,
    property,
    usersApplied,
    isFavorite,
    hasApplied
  });
});

exports.getCheckoutForm = catchAsync(async (req, res, next) => {
  const property = await Property.findOne({ slug: req.params.slug });

  if (!property) {
    return next(new AppError("There is no property with that name.", 404));
  }

  res.status(200).render("checkoutForm", {
    title: `Checkout`,
    property
  });
});

exports.getRentalDepositPage = catchAsync(async (req, res, next) => {
  const property = await RentalProperty.findOne({ slug: req.params.slug });

  if (!property) {
    return next(new AppError("There is no property with that name.", 404));
  }

  res.status(200).render("rentalDeposit", {
    title: `Sign Contract`,
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

exports.contactAdmin = (req, res) => {
  res.status(200).render("contact", {
    title: "Contact Us"
  });
};

exports.forgetPassword = (req, res) => {
  res.status(200).render("forgotPassword", {
    title: "Forget Password"
  });
};

exports.getNewAdminRegistrationForm = (req, res) => {
  res.status(200).render("addNewAdmin", {
    title: "Add new admin"
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: "Your account"
  });
};

exports.getUserProperty = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const properties = await Property.aggregate([
    {
      $match: { address: { $in: user.propertyPurchased } }
    }
  ]);
  res.status(200).render("userProperty", {
    title: "Your property",
    properties
  });
});

exports.getBiddings = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  console.log(user);
  const properties = await Property.aggregate([
    {
      $match: { address: { $in: user.currentBiddingProperty } }
    }
  ]);
  res.status(200).render("userBiddings", {
    title: "Current Biddings",
    properties
  });
});

exports.getUserRentalProperty = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const properties = await RentalProperty.aggregate([
    {
      $match: { slug: { $in: user.propertiesRented } }
    }
  ]);
  console.log(properties);
  res.status(200).render("manageRental", {
    title: "Rented Properties",
    properties
  });
});

exports.getBiddings = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  console.log(user);
  const properties = await Property.aggregate([
    {
      $match: { address: { $in: user.currentBiddingProperty } }
    }
  ]);
  res.status(200).render("userBiddings", {
    title: "User Biddings",
    properties
  });
});

exports.getRentalApplication = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const properties = await RentalProperty.aggregate([
    {
      $match: { slug: { $in: user.propertyAppliedRental } }
    }
  ]);
  const userid = user._id.toString();
  res.status(200).render("rentalApplications", {
    title: "Rental Applications",
    properties,
    userid
  });
});

exports.getFavouriteProperties = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  // Get favorite properties
  const favoriteProperties = await Property.aggregate([
    {
      $match: { slug: { $in: user.favoriteProperties } }
    }
  ]);

  // Get favorite rental properties
  const favoriteRentalProperties = await RentalProperty.aggregate([
    {
      $match: { slug: { $in: user.favoriteProperties } }
    }
  ]);

  // Merge favorite properties and rental properties
  const properties = [...favoriteProperties, ...favoriteRentalProperties];
  res.status(200).render("favouriteProperties", {
    title: "Favourite Properties",
    properties
  });
});

exports.getQueries = catchAsync(async (req, res, next) => {
  const queries = await Query.find()
    .where("replied")
    .equals(false);
  res.status(200).render("customerQueries", {
    title: "All Active Customer Queries",
    queries
  });
});

exports.getQuery = catchAsync(async (req, res, next) => {
  const query = await Query.findById(req.params.queryId);
  res.status(200).render("replyCustomerQuery", {
    title: "Reply Customer Query",
    query
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const tokenId = req.params.resetToken;
  console.log(tokenId);
  res.status(200).render("resetPassword", {
    title: "Reset Password",
    tokenId
  });
});

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
