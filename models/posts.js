const { postValidation } = require("../models/validation");
const { postSchema } = require("../schema/postSchema");
const { userSchema } = require("../schema/userSchema");

const getPosts = async (request, response) => {
  try {
    const postList = await postSchema.find();
    response.json(postList);
  } catch (error) {
    response.json({ message: error });
  }
};

const addPost = async (request, response) => {
  //Validate the request data
  const validation = postValidation.validate(request.body);
  if (validation.error) return response.status(400).send(validation.error);

  //Find the user
  const checkID = await userSchema.findOne({
    _id: request.user._id,
  });

  //Add the post to db
  const post = new postSchema({
    title: request.body.title,
    description: request.body.description,
    user: checkID.name,
    userid: checkID._id,
  });
  try {
    const savedPost = await post.save();
    response.send(savedPost);
  } catch (error) {
    response.status(400).send(error);
  }
};

const deletePost = async (request, response) => {
  //Validate the request data
  if (!request.body._id || request.body._id.length < 12)
    return response.status(400).send({ message: "Missing / Invalid Post ID" });

  const checkID = await postSchema.findOne({
    _id: request.body._id,
  });

  if (checkID == null)
    return response.status(400).send({ message: "Invalid Post ID" });

  //Check if the user is valid
  const checkAuthID = await userSchema.findOne({
    _id: request.user._id,
  });
  if (checkID.userid == checkAuthID._id) {
    await postSchema.deleteOne({
      _id: checkID._id,
    });
    return response.send("success");
  }

  response
    .status(401)
    .send({ message: "You are not authorized to perform this action" });
};

module.exports = { getPosts, addPost, deletePost };
