const multer = require("multer");
const sharp = require("sharp");
const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

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

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser
    }
  });
});

exports.match;

exports.addFavoriteProperty = catchAsync(async (req, res, next) => {
  // Get the user ID from the request
  const userId = req.user.id;
  // Get the property ID from the request body
  const { slug } = req.body;
  console.log(slug);
  // Find the user by ID
  const user = await User.findById(userId);

  // Check if the propertyId is not already in the favoriteProperties list
  if (!user.favoriteProperties.includes(slug)) {
    await User.findByIdAndUpdate(req.user.id, {
      $push: { favoriteProperties: slug }
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      user: user
    }
  });
});

exports.removeFavoriteProperty = catchAsync(async (req, res, next) => {
  // Get the property ID from the request body
  const { slug } = req.body;

  // Find the user by ID and update the favoriteProperties list
  const user = await User.findByIdAndUpdate(req.user.id, {
    $pull: { favoriteProperties: slug }
  });
  res.status(200).json({
    status: "success",
    data: {
      user: user
    }
  });
});

exports.placeBid = catchAsync(async (req, res, next) => {
  const { address } = req.body;

  await User.findByIdAndUpdate(req.user.id, {
    $push: { currentBiddingProperty: address }
  });

  res.status(204).json({
    status: "success",
    data: null
  });
});

exports.removeBidding = catchAsync(async (req, res, next) => {
  const { address } = req.body;
  await User.findByIdAndUpdate(req.user.id, {
    $pull: { currentBiddingProperty: address }
  });
  res.status(200).json({
    status: "success",
    data: null
  });
});

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
