const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const Property = require("./../models/propertyModel");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");
const EmailWithContent = require("./../utils/emailWithContent");

exports.aliasTopProperties = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "price";
  req.query.fields = "address, price, numBedrooms, numBathrooms, description";
  next();
};

exports.addContract = catchAsync(async (req, res, next) => {
  const { address, nftContract } = req.body;

  // Filter
  const filter = { address: address };

  // Tickets
  const update = { nftContract: nftContract };

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

const updateUsersAfterPropertySold = async (
  propertyId,
  userId,
  slug,
  address
) => {
  // Fetch the sold property
  const soldProperty = await Property.findById(propertyId);
  if (!soldProperty) {
    throw new Error("No property found with that ID");
  }

  // Remove the property from favoriteProperties and currentBiddingProperty arrays for all users
  await User.updateMany(
    {},
    {
      $pull: {
        favoriteProperties: slug,
        currentBiddingProperty: address
      }
    }
  );

  // Add the property address to the propertyPurchased array of the user who purchased the property
  await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        propertyPurchased: soldProperty.address
      }
    },
    { new: true }
  );
};

exports.soldProperty = catchAsync(async (req, res, next) => {
  // Fetch
  const { address, slug, propertyId } = req.body;

  const userId = req.user.id; // Assuming the user ID is available in req.user.id

  // Mark the property as sold (update the propertySold field in the Property document)
  const soldProperty = await Property.findByIdAndUpdate(
    propertyId,
    { propertySold: true },
    { new: true }
  );

  if (!soldProperty) {
    return next(new AppError("No property found with that ID", 404));
  }

  // Update users after the property is sold
  await updateUsersAfterPropertySold(propertyId, userId, slug, address);

  res.status(200).json({
    status: "success",
    data: {
      property: soldProperty
    }
  });
});

exports.placeBid = catchAsync(async (req, res, next) => {
  const { address, biddingPrice, bidder } = req.body;
  console.log(address);
  // Filter
  const filter = { address: address };

  // Tickets
  const update = {
    biddingPrice: biddingPrice,
    currentHighestBidder: bidder
  };
  const property = await Property.findOne(filter);

  console.log(property.currentHighestBidder);

  const preHighestBidder = await User.findById(property.currentHighestBidder);
  if (preHighestBidder) {
    const url = `http://localhost:3000/property/${property.slug}`;
    await new EmailWithContent(
      preHighestBidder.name,
      preHighestBidder.email,
      url
    ).sendOutbidNotification(property.address);
  }
  const updatedProperty = await Property.findOneAndUpdate(filter, update, {
    new: true
  });
  console.log(updatedProperty);
  res.status(200).json({
    status: "success",
    data: {
      updatedProperty
    }
  });
});

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

  const imageName = `${req.body.listingNum}.JPG`;
  const dir = `public/img/properties/large/${req.body.listingNum}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const imagePath = `public/img/properties/large/${req.body.listingNum}/${imageName}`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(imagePath);

  req.body.imageCover = imageName;

  next();
});

exports.getAllProperties = factory.getAll(Property);
exports.getProperty = factory.getOne(Property);
exports.createProperty = catchAsync(async (req, res, next) => {
  const {
    address,
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
    imageCover,
    description,
    biddingPrice
  } = req.body;
  console.log(imageCover);
  const newProperty = await Property.create({
    address: address,
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
    description: description,
    imageCover: imageCover,
    propertySold: false,
    propertyViews: 0,
    biddingPrice: biddingPrice
  });

  res.status(201).json({
    status: "success",
    data: {
      newProperty
    }
  });
});
exports.updateProperty = factory.updateOne(Property);
exports.deleteProperty = factory.deleteOne(Property);
