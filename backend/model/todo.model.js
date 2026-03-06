import Mongoose from "mongoose";

const todoSchema = new Mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

export const Todo = Mongoose.model("Todo", todoSchema);
