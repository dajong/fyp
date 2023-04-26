const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const User = require("./../models/userModel");
const RentalProperty = require("./../models/rentalPropertyModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");

exports.updateRentalProperty = factory.updateOne(RentalProperty);
exports.getProperty = factory.getOne(RentalProperty);

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only images.", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadImageCover = upload.single("imageCover");

exports.resizeImageCover = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  req.file.imageCover = `${req.body.listingNum}.JPG`;
  const dir = `public/img/properties/large/${req.body.listingNum}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("JPG")
    .jpeg({ quality: 90 })
    .toFile(
      `public/img/properties/large/${req.body.listingNum}/${req.file.imageCover}`
    );

  next();
});

exports.createRentalProperty = catchAsync(async (req, res, next) => {
  const {
    address,
    ownerEmail,
    city,
    listingNum,
    propertyStyle,
    garageType,
    garageSize,
    berRating,
    squareFeet,
    lotSize,
    numBedroom,
    numBathroom,
    rent,
    imageCover,
    description,
    securityDeposit
  } = req.body;

  const newProperty = await RentalProperty.create({
    address: address,
    ownerEmail: ownerEmail,
    city: city,
    listingNum: listingNum,
    propertyStyle: propertyStyle,
    garageType: garageType,
    garageSize: garageSize,
    berRating: berRating,
    squareFeet: squareFeet,
    lotSize: lotSize,
    numBedroom: numBedroom,
    numBathroom: numBathroom,
    rent: rent,
    securityDeposit: securityDeposit,
    description: description,
    imageCover: imageCover,
    rented: false,
    propertyViews: 0
  });

  res.status(201).json({
    status: "success",
    data: {
      newProperty
    }
  });
});

exports.payRent = catchAsync(async (req, res, next) => {
  const { propertyId } = req.params;
  const renterId = req.user.id;
  const rentAmount = req.body.rent;

  const property = await RentalProperty.findById(propertyId);

  if (!property.isRented || property.renter.toString() !== renterId) {
    return res
      .status(400)
      .json({ status: "fail", message: "Only the renter can pay rent" });
  }

  if (rentAmount !== property.rent) {
    return res
      .status(400)
      .json({ status: "fail", message: "Incorrect rent amount" });
  }

  const lastPaidDate = new Date(property.lastPaidDate);
  const currentDate = new Date();

  if (
    currentDate.getTime() <
    lastPaidDate.getTime() + 30 * 24 * 60 * 60 * 1000
  ) {
    return res.status(400).json({
      status: "fail",
      message: "Rent already paid for the current period"
    });
  }

  await RentalProperty.findByIdAndUpdate(propertyId, {
    lastPaidDate: currentDate
  });

  res
    .status(200)
    .json({ status: "success", message: "Rent paid successfully" });
});

exports.withdrawSecurityDeposit = catchAsync(async (req, res, next) => {
  const { propertyId } = req.params;
  const ownerId = req.user.id;

  const property = await RentalProperty.findById(propertyId);

  if (property.owner.toString() !== ownerId) {
    return next(
      new AppError("Only the owner can withdraw the security deposit", 400)
    );
  }

  if (property.rented) {
    return next(new AppError("Property is still rented", 400));
  }

  //const deposit = property.securityDeposit;

  await RentalProperty.findByIdAndUpdate(propertyId, {
    securityDeposit: 0
  });

  // Here, you would need to implement the logic for transferring the security deposit to the owner's account.

  res.status(200).json({
    status: "success",
    message: "Security deposit withdrawn successfully"
  });
});

exports.addContract = catchAsync(async (req, res, next) => {
  const { address, nftContract } = req.body;

  // Filter
  const filter = { address: address };

  // Tickets
  const update = { nftContract: nftContract };

  const property = await RentalProperty.findOneAndUpdate(filter, update, {
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

exports.applyForRental = catchAsync(async (req, res, next) => {
  const { slug } = req.body;

  if (!slug) {
    return next(new AppError("Please provide a property address.", 400));
  }
  const userId = req.user.id;
  const user = await User.findById(userId);
  const rentalProperty = await RentalProperty.findOne({ slug: slug });

  if (!rentalProperty) {
    return next(
      new AppError("No rental property found with the provided address.", 404)
    );
  }

  if (!user.propertyAppliedRental.includes(slug)) {
    user.propertyAppliedRental.push(slug);
    await user.save({ validateBeforeSave: false });
  }

  if (!rentalProperty.userApplied.includes(userId)) {
    rentalProperty.userApplied.push(userId);
    await rentalProperty.save();
  }

  console.log(rentalProperty);
  res.status(200).json({
    status: "success",
    data: {
      rentalProperty
    }
  });
});

exports.removeRentalApplication = catchAsync(async (req, res, next) => {
  const { slug } = req.body;
  const userId = req.user.id;

  if (!slug) {
    return next(new AppError("Please provide a property address.", 400));
  }

  const user = await User.findById(userId);
  const rentalProperty = await RentalProperty.findOne({ slug: slug });

  if (!rentalProperty) {
    return next(
      new AppError("No rental property found with the provided address.", 404)
    );
  }

  const propertyIndex = user.propertyAppliedRental.indexOf(slug);
  if (propertyIndex !== -1) {
    user.propertyAppliedRental.splice(propertyIndex, 1);
    await user.save({ validateBeforeSave: false });
  }

  const userIndex = rentalProperty.userApplied.indexOf(userId);
  if (userIndex !== -1) {
    rentalProperty.userApplied.splice(userIndex, 1);
    await rentalProperty.save();
  }

  res.status(200).json({
    status: "success",
    message: "Property rental application removed successfully.",
    data: {
      user,
      rentalProperty
    }
  });
});

exports.approveRental = async (req, res, next) => {
  try {
    const { slug, userId } = req.body;

    // Update the rental property
    const property = await RentalProperty.findOneAndUpdate(
      { slug },
      {
        rented: true,
        // renter: userId,
        userApproved: userId,
        $pull: { userApplied: userId }
      },
      { new: true }
    );

    if (!property) {
      return next(new AppError("No property found with that slug", 404));
    }

    // Send success response
    res.status(200).json({
      status: "success",
      data: {
        property
        // user
      }
    });
  } catch (error) {
    return next(new AppError("Error approving rental", 500));
  }
};

exports.rentProperty = async (req, res, next) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user.id;
    // Find the property by its id
    const property = await RentalProperty.findById(propertyId);

    // Check if the property exists
    if (!property) {
      return next(new AppError("No property found with that ID", 404));
    }

    // Create a new Date object representing the current date
    const today = new Date();

    // Add 30 days to the current date
    today.setDate(today.getDate() + 30);

    // Update the property's next pay date
    property.nextPayDate = today;

    // Update the rental property's status
    property.renter = userId;

    // Add 365 days to the current date for the contract expiration date
    const contractExpires = new Date(today);
    contractExpires.setDate(contractExpires.getDate() + 365);
    property.contractExpires = contractExpires;

    // Save the updated property to the database
    await property.save();

    // Find the user by their id and remove the property from propertyAppliedRental
    await User.findByIdAndUpdate(
      userId,
      { $pull: { propertyAppliedRental: property.slug } },
      { new: true, runValidators: true }
    );

    // Remove the user from userApplied in the RentalProperty model
    await RentalProperty.findByIdAndUpdate(
      propertyId,
      { $pull: { userApplied: userId } },
      { new: true, runValidators: true }
    );

    // Find the updated user
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    // Add the rented property ID to the user's propertiesRented array
    user.propertiesRented.push(property.slug);

    // Save the updated user to the database
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      data: {
        property
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};

exports.endRentalContract = async (req, res, next) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user.id;

    // Find the rental property by its id
    const property = await RentalProperty.findById(propertyId);

    // Check if the property exists
    if (!property) {
      return next(new AppError("No property found with that ID", 404));
    }

    // Check if the user is the renter or the owner of the property
    if (property.renter !== userId) {
      return next(
        new AppError("You do not have permission to end this contract", 403)
      );
    }

    // Set the property's rented status to false and clear renter-related fields
    property.rented = false;
    property.renter = null;
    property.userApproved = null;
    property.nextPayDate = null;
    property.contractExpires = null;

    // Save the updated property to the database
    await property.save();

    // Find the user by their id
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return next(new AppError("No user found with that ID", 404));
    }

    // Remove the rented property ID from the user's propertiesRented array
    user.propertiesRented.pull(propertyId);

    // Save the updated user to the database
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      data: {
        property
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};

exports.renewRentalContract = async (req, res, next) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user.id;

    // Find the rental property by its id
    const property = await RentalProperty.findById(propertyId);

    // Check if the property exists
    if (!property) {
      return next(new AppError("No property found with that ID", 404));
    }

    // Check if the user is the renter of the property
    if (property.renter !== userId && property.userApproved !== userId) {
      return next(
        new AppError("You do not have permission to renew this contract", 403)
      );
    }

    // Set the next pay date to 30 days from today
    const currentDate = new Date();
    const nextPayDate = new Date(
      currentDate.setMonth(currentDate.getMonth() + 1)
    );
    property.nextPayDate = nextPayDate;

    // Set the contract expiration date to 1 year from today
    const contractExpires = new Date(
      currentDate.setFullYear(currentDate.getFullYear() + 1)
    );
    property.contractExpires = contractExpires;

    // Save the updated property to the database
    await property.save();

    res.status(200).json({
      status: "success",
      data: {
        property
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};

exports.payRent = async (req, res, next) => {
  try {
    const { propertyId } = req.body;
    const userId = req.user.id;

    // Find the rental property by its id
    const property = await RentalProperty.findById(propertyId);

    // Check if the property exists
    if (!property) {
      return next(new AppError("No property found with that ID", 404));
    }

    // Check if the user is the renter of the property
    if (property.renter !== userId) {
      return next(
        new AppError(
          "You do not have permission to pay rent for this property",
          403
        )
      );
    }

    // Verify if the rent is due
    const currentDate = new Date();
    if (property.nextPayDate > currentDate) {
      return next(new AppError("Rent is not due yet", 400));
    }

    // Set the next pay date to 30 days from today
    const nextPayDate = new Date(
      currentDate.setMonth(currentDate.getMonth() + 1)
    );
    property.nextPayDate = nextPayDate;

    // Save the updated property to the database
    await property.save();

    res.status(200).json({
      status: "success",
      data: {
        property
      }
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};
