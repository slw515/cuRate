const { model, Schema } = require("mongoose");
const postSchema = new Schema({
  title: String,
  body: String,
  username: String,
  createdAt: String,
  gallery: [
    {
      id: String,
      title: String,
      imgSrc: String,
      userDescription: String,
      artist: String
    }
  ],
  comments: [
    {
      body: String,
      username: String,
      createdAt: String
    }
  ],
  likes: [
    {
      username: String,
      createdAt: String
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "users"
  }
});

module.exports = model("Post", postSchema);
