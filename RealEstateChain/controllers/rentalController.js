const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const User = require("./../models/userModel");
const RentalProperty = require("./../models/rentalPropertyModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");

exports.updateRentalProperty = factory.updateOne(RentalProperty);

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
    // imageCover,
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
    imageCover: "imageCover",
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

//exports.createRentalProperty = factory.createOne(RentalProperty);
exports.rentProperty = catchAsync(async (req, res, next) => {
  const { propertyId } = req.params;
  const renterId = req.user.id;
  const depositAmount = req.body.deposit;

  const property = await RentalProperty.findById(propertyId);

  if (property.isRented) {
    return res
      .status(400)
      .json({ status: "fail", message: "Property already rented" });
  }

  if (depositAmount !== property.securityDeposit) {
    return res
      .status(400)
      .json({ status: "fail", message: "Incorrect security deposit" });
  }

  await RentalProperty.findByIdAndUpdate(propertyId, {
    isRented: true,
    renter: renterId,
    lastPaidDate: Date.now()
  });

  res
    .status(200)
    .json({ status: "success", message: "Property rented successfully" });
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

exports.endRental = catchAsync(async (req, res, next) => {
  const { propertyId } = req.params;
  const renterId = req.user.id;

  const property = await RentalProperty.findById(propertyId);

  if (property.renter.toString() !== renterId) {
    return res
      .status(400)
      .json({ status: "fail", message: "Only the renter can end the rental" });
  }

  await RentalProperty.findByIdAndUpdate(propertyId, {
    isRented: false,
    renter: null
  });

  res
    .status(200)
    .json({ status: "success", message: "Rental ended successfully" });
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

    // Update the user
    // const user = await User.findByIdAndUpdate(
    //   userId,
    //   {
    //     $pull: { propertyAppliedRental: slug }
    //     // $addToSet: { propertiesRented: slug },
    //   },
    //   { new: true }
    // );

    // if (!user) {
    //   return next(new AppError("No user found with that ID", 404));
    // }

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
