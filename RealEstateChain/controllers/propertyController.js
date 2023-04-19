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

exports.soldProperty = catchAsync(async (req, res, next) => {
  const { address } = req.body;

  // Filter
  const filter = { address: address };

  // Tickets
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
  const url = `http://localhost:3000/property/${property.slug}`;
  await new EmailWithContent(
    preHighestBidder.name,
    preHighestBidder.email,
    url
  ).sendOutbidNotification(property.address);
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
    price,
    description,
    biddingPrice
  } = req.body;

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
    price: price,
    description: description,
    imageCover: "test.JPG",
    propertySold: false,
    propertyViews: 0,
    biddingPrice: biddingPrice
  });

  res.status(200).json({
    status: "success",
    data: {
      newProperty
    }
  });
});
exports.updateProperty = factory.updateOne(Property);
exports.deleteProperty = factory.deleteOne(Property);