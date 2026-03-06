import express from "express";
import { Todo } from "../model/todo.model.js";

const router = express.Router();

router.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/todos", async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    completed: req.body.completed,
  });
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.patch("/todos/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        text: req.body.text,
        completed: req.body.completed,
      },
      { new: true },
    );
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.delete("/todos/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedTodo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
