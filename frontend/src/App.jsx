import { useState, useEffect } from "react";
import axios from "axios";
import { FiTrash2, FiEdit2, FiCheck, FiX, FiPlus } from "react-icons/fi";

const API = "/api/todos";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // ── Fetch all todos on mount ──────────────────────────────
  useEffect(() => {
    axios.get(API)
      .then((res) => setTodos(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Add ──────────────────────────────────────────────────
  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const res = await axios.post(API, { text: newTodo.trim() });
      setTodos([res.data, ...todos]);
      setNewTodo("");
    } catch (err) { console.error(err); }
  };

  // ── Toggle complete ───────────────────────────────────────
  const toggleTodo = async (todo) => {
    try {
      const res = await axios.patch(`${API}/${todo._id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t._id === todo._id ? res.data : t)));
    } catch (err) { console.error(err); }
  };

  // ── Delete ────────────────────────────────────────────────
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/${id}`);
      setTodos(todos.filter((t) => t._id !== id));
    } catch (err) { console.error(err); }
  };

  // ── Edit ──────────────────────────────────────────────────
  const startEdit = (todo) => {
    setEditId(todo._id);
    setEditText(todo.text);
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const res = await axios.patch(`${API}/${id}`, { text: editText.trim() });
      setTodos(todos.map((t) => (t._id === id ? res.data : t)));
      setEditId(null);
    } catch (err) { console.error(err); }
  };

  // ── Filter ────────────────────────────────────────────────
  const visible = todos.filter((t) =>
    filter === "all" ? true : filter === "active" ? !t.completed : t.completed
  );

  const doneCount   = todos.filter((t) => t.completed).length;
  const activeCount = todos.length - doneCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 to-indigo-200 flex items-start justify-center p-6 pt-16">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg">

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-1">My Todos ✅</h1>
        <p className="text-gray-400 text-sm mb-6">Stay organised, get things done.</p>

        {/* Stats */}
        <div className="flex gap-3 mb-6">
          {[
            { label: "Total",  value: todos.length },
            { label: "Active", value: activeCount },
            { label: "Done",   value: doneCount },
          ].map((s) => (
            <div key={s.label} className="flex-1 bg-indigo-50 rounded-2xl p-3 text-center">
              <div className="text-2xl font-bold text-indigo-500">{s.value}</div>
              <div className="text-xs text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Add form */}
        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 p-3 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-indigo-400 transition"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition flex items-center gap-1"
          >
            <FiPlus size={18} />
          </button>
        </form>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition border-2 ${
                filter === f
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "bg-white text-gray-500 border-gray-100 hover:border-indigo-300"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Todo list */}
        {loading ? (
          <p className="text-center text-gray-400 py-8">Loading…</p>
        ) : visible.length === 0 ? (
          <p className="text-center text-gray-300 py-8 text-4xl">🎉</p>
        ) : (
          <ul className="space-y-2">
            {visible.map((todo) => (
              <li
                key={todo._id}
                className={`flex items-center gap-3 p-3 rounded-2xl border-2 transition ${
                  todo.completed ? "bg-gray-50 border-gray-100 opacity-60" : "bg-white border-gray-100"
                }`}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleTodo(todo)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                    todo.completed
                      ? "bg-indigo-500 border-indigo-500 text-white"
                      : "border-gray-300 hover:border-indigo-400"
                  }`}
                >
                  {todo.completed && <FiCheck size={12} />}
                </button>

                {/* Text / Edit input */}
                {editId === todo._id ? (
                  <input
                    autoFocus
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(todo._id)}
                    className="flex-1 px-2 py-1 border border-indigo-300 rounded-lg text-sm outline-none"
                  />
                ) : (
                  <span
                    className={`flex-1 text-sm ${
                      todo.completed ? "line-through text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {todo.text}
                  </span>
                )}

                {/* Action buttons */}
                <div className="flex gap-1">
                  {editId === todo._id ? (
                    <>
                      <button onClick={() => saveEdit(todo._id)} className="p-1.5 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition">
                        <FiCheck size={14} />
                      </button>
                      <button onClick={() => setEditId(null)} className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition">
                        <FiX size={14} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(todo)} className="p-1.5 rounded-lg bg-indigo-50 text-indigo-400 hover:bg-indigo-100 transition">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => deleteTodo(todo._id)} className="p-1.5 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition">
                        <FiTrash2 size={14} />
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default App;
