const { postValidation } = require("../models/validation");
const { postSchema } = require("../schema/postSchema");
const { userSchema } = require("../schema/userSchema");

const getPosts = (request, response) => {
  postSchema.find({}, (error, posts) => {
    var postList = [];

    posts.forEach((post) => {
      postList[postList._id] = post;
    });
    response.send(postList);
  });
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
  });
  try {
    const savedPost = await post.save();
    response.send(savedPost);
  } catch (error) {
    response.status(400).send(error);
  }
};

module.exports = { getPosts, addPost };
