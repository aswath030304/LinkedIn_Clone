const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, default: "" },
    degree: { type: String, default: "" },
    field: { type: String, default: "" },
    startYear: { type: String, default: "" },
    endYear: { type: String, default: "" },
  },
  { _id: true } 
);

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    link: { type: String, default: "" },
  },
  { _id: true } 
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    securityQuestion: {
      type: String,
      enum: [
        "",
        "What is your favorite childhood nickname?",
        "What is the name of your first pet?",
        "What city were you born in?",
        "What is your mother's maiden name?",
        "What is your favorite teacher's name?",
      ],
      default: "",
    },
    securityAnswer: { type: String, default: "" },
    bio: { type: String, default: "" },
    profilePic: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    },
    location: { type: String, default: "" },
    phone: { type: String, default: "" },
    website: { type: String, default: "" },
    education: [educationSchema],
    projects: [projectSchema],
  },
  { timestamps: true }
);
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
