const express = require("express")
const router = express.Router();
const {
    handleCreateTodo,
    getAllTodos,
    editTodo,
    deleteTodo,
    restoreTodoFromTrash,
    deleteTodoPermanently
} = require('../controllers/todo')

router.post('/create_todo', handleCreateTodo);

router.get('/getAllTodos/:userId', getAllTodos);

router.patch('/editTodo', editTodo);
router.patch('/deleteTodo', deleteTodo);
router.patch('/restoreTodo', restoreTodoFromTrash);

router.delete('/deleteTodoPermanently', deleteTodoPermanently);

module.exports = router;