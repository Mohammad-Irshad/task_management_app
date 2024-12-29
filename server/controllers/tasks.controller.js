const Task = require('../models/tasks.model')
const mongoose = require('mongoose')

const addNewTask = async (req, res) => {
    try{
        const newTask = req.body
        const addedTask = await Task.create(newTask)
        res.status(201).json({ message: "Task added successfully", addedTask})
    }catch(error){
        res.status(500).json({message : "Failed to add new task : ", error : error.message});
    }
}

const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json({ message: "Tasks fetched successfully", tasks });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch tasks", error: error.message });
    }
};


const updateTask = async (req, res) => {
    try{

        const taskId = req.params.id
        const updatedData = req.body

        // Find the task by ID and update it
        const updatedTask = await Task.findByIdAndUpdate(taskId, updatedData, { 
            new: true, 
            runValidators: true 
        });

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task updated successfully", updatedTask });

    }catch(error){
        res.status(500).json({message : "Failed to update the task", error : error.message})
    }
}


const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id

        // Validate the ObjectId
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({ message: "Invalid Task ID" })
        }

        // Attempt to find and delete the task
        const deletedTask = await Task.findByIdAndDelete(taskId)

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" })
        }

        res.status(200).json({ message: "Task deleted successfully", deletedTask })
    } catch (error) {
        res.status(500).json({ message: "Failed to delete the task", error: error.message })
    }
}

const getTasksByPage = async (req, res) => {
    try{
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit;

        const tasks = await Task.find().skip(skip).limit(limit)
        const totalTasks = await Task.countDocuments()

        const taskPages = {
            page,
            limit,
            totalPages: Math.ceil(totalTasks / limit),
            totalTasks,
            tasks
        }

        res.status(200).json({message : "Task pages fetched successfully", taskPages})
    }catch(error){
        res.status(500).json({ message: "Failed to fetch task pages", error: error.message })
    }
}


module.exports = {addNewTask, getTasks, updateTask, deleteTask, getTasksByPage}


















// const addNewTask = async (req, res) => {
//     try {
//         // Input validation
//         const { name, project, team, timeToComplete } = req.body;

//         if (!name || !project || !team || !timeToComplete) {
//             return res.status(400).json({ message: "Missing required fields" });
//         }

//         // ObjectId validation
//         if (!mongoose.Types.ObjectId.isValid(project)) {
//             return res.status(400).json({ message: "Invalid project ID" });
//         }
//         if (!mongoose.Types.ObjectId.isValid(team)) {
//             return res.status(400).json({ message: "Invalid team ID" });
//         }
//         if (req.body.owners && !req.body.owners.every(owner => mongoose.Types.ObjectId.isValid(owner))) {
//             return res.status(400).json({ message: "One or more owner IDs are invalid" });
//         }

//         // Task creation
//         const newTask = req.body;
//         const addedTask = await Task.create(newTask);

//         res.status(201).json({ message: "Task added successfully", addedTask });
//     } catch (error) {
//         // Handle validation errors
//         if (error.name === 'ValidationError') {
//             return res.status(400).json({ message: "Validation failed", error: error.message });
//         }

//         // General error handling
//         res.status(500).json({ message: "Failed to add new task", error: error.message });
//     }
// };