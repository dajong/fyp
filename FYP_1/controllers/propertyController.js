const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const Property = require("./../models/propertyModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");

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

  // Filter
  const filter = { address: address };

  // Tickets
  const update = {
    biddingPrice: biddingPrice,
    currentHighestBidder: bidder
  };

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
exports.createProperty = factory.createOne(Property);
exports.updateProperty = factory.updateOne(Property);
exports.deleteProperty = factory.deleteOne(Property);
