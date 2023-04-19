const Query = require("./../models/queryModel");
const catchAsync = require("./../utils/catchAsync");
const EmailWithContent = require("./../utils/emailWithContent");
const Email = require("./../utils/email");
const factory = require("./handlerFactory");

exports.getAllQueries = factory.getAll(Query);
exports.getQuery = factory.getOne(Query);
exports.createQuery = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const doc = await Query.create(req.body);
  await new Email(req.body.queryName, req.body.queryEmail).sendAutomatedQuery(
    req.body.querySubject
  );
  res.status(201).json({
    status: "success",
    data: {
      data: doc
    }
  });
});

exports.replyQuery = catchAsync(async (req, res, next) => {
  const { replyMessage, queryId } = req.body;
  const query = await Query.findById(queryId);
  const update = { replied: true };
  await new EmailWithContent(
    query.queryName,
    query.queryEmail,
    replyMessage
  ).sendQueryReply(query.querySubject);
  const updatedQuery = await Query.findByIdAndUpdate(queryId, update, {
    new: true
  });
  console.log(query);
  res.status(200).json({
    status: "success",
    data: {
      updatedQuery
    }
  });
});
exports.updateQuery = factory.updateOne(Query);
exports.deleteQuery = factory.deleteOne(Query);
