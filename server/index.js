const express = require("express")
const cors = require("cors")
const { initializeDatabase } = require("./database/db")
const verifyJWT = require("./middleware/auth.middleware")
const { userSignUp, userLogIn} = require("./controllers/user.controller")
const {addNewTask, getTasks, updateTask, deleteTask, getTasksByPage} = require("./controllers/tasks.controller")
const getStatistics = require("./controllers/statistics.controller")


const app = express()

app.use(express.json())
app.use(cors())

initializeDatabase()

// Welcome Api

app.get("/", (req, res) => {
    res.send("Welcome to Mohammad Irshad's Server ! Happy Coding.")
})

// User Api
app.post("/auth/signup", userSignUp); // User signup
app.post("/auth/login", userLogIn); // User Login

// Task Api
app.post("/tasks",verifyJWT, addNewTask); // create a new task
app.get("/tasks",verifyJWT, getTasks); // Fetch task with filtering 
app.put("/tasks/:id",verifyJWT, updateTask); // update a task
app.delete("/tasks/:id",verifyJWT, deleteTask); // delete a task

// Task Api by page
app.get("/tasks/page", verifyJWT, getTasksByPage) // Fetch tasks by page

// Statistic Api
app.get("/dashboard/stats",verifyJWT, getStatistics) // Fetch statistics

module.exports = {app}