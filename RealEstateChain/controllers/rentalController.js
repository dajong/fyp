const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");
const User = require("./../models/userModel");
const RentalProperty = require("./../models/rentalPropertyModel");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory");
const AppError = require("./../utils/appError");

exports.createRentalProperty = factory.createOne(RentalProperty);
