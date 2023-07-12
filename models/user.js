const mongoose = require("mongoose");
const PLM = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

userSchema.plugin(PLM);

module.exports = mongoose.model("User", userSchema);
