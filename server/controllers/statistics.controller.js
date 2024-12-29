const Task = require('../models/tasks.model')


const getStatistics = async (req, res) => {
    try{
        const now = new Date();

        
        const totalCount = await Task.countDocuments({})
        
        if (totalCount === 0) {
        return res.json({
                totalTasks: 0,
                completedPercent: 0,
                pendingPercent: 0,
                averageCompletionTime: 0,
                pendingSummary: {
                pendingTasks: 0,
                totalTimeLapsed: 0,
                totalTimeToFinish: 0,
                prioritySummary: [],
                }
            })
        }

        // Count completed and pending tasks
        const completedTasks = await Task.countDocuments({ status: 'Finished' })
        const pendingTasks = totalCount - completedTasks;

        // Calculate percentages
        const completedPercent = ((completedTasks / totalCount) * 100).toFixed(2)
        const pendingPercent = ((pendingTasks / totalCount) * 100).toFixed(2)

        // Pending task statistics
        const pendingTasksData = await Task.find({ status: 'Pending' })
        const timeLapsedByPriority = {}
        const balanceTimeByPriority = {}
        const prioritySummary = []

        pendingTasksData.forEach(task => {
        const priority = task.priority;
        const lapsedHours = Math.max(0, (now - task.startTime) / (1000 * 60 * 60)) // Prevent negative values
        const balanceHours = Math.max(0, (task.endTime - now) / (1000 * 60 * 60)) // Prevent negative values

        timeLapsedByPriority[priority] = (timeLapsedByPriority[priority] || 0) + lapsedHours
        balanceTimeByPriority[priority] = (balanceTimeByPriority[priority] || 0) + balanceHours
        })

        // Summarize the priority data for pending tasks
        for (let priority = 1; priority <= 5; priority++) {
        prioritySummary.push({
            priority,
            pendingTasks: pendingTasksData.filter(task => task.priority === priority).length,
            timeLapsed: timeLapsedByPriority[priority] || 0,
            timeToFinish: balanceTimeByPriority[priority] || 0,
        });
        }

        // Average completion time for finished tasks
        const finishedTasks = await Task.find({ status: 'Finished' })
        const totalTimeTaken = finishedTasks.reduce((total, task) => {
        const timeTaken = (task.endTime - task.startTime) / (1000 * 60 * 60)
        return total + timeTaken
        }, 0);

        const averageCompletionTime = finishedTasks.length
        ? (totalTimeTaken / finishedTasks.length).toFixed(2)
        : 0;

        // Calculate pending summary
        const totalTimeLapsed = Object.values(timeLapsedByPriority).reduce((sum, value) => sum + value, 0)
        const totalTimeToFinish = Object.values(balanceTimeByPriority).reduce((sum, value) => sum + value, 0)

        const taskStats = {
            totalTasks: totalCount,
            completedPercent: parseFloat(completedPercent),
            pendingPercent: parseFloat(pendingPercent),
            averageCompletionTime: parseFloat(averageCompletionTime).toFixed(1),
            pendingSummary: {
                pendingTasks,
                totalTimeLapsed: totalTimeLapsed.toFixed(1),
                totalTimeToFinish: totalTimeToFinish.toFixed(1),
                prioritySummary,
            }
        }

        // Send statistics
        res.status(200).json({ message: "Stats fetched successfully", taskStats })
    }catch(error){
        console.error(err);
        res.status(500).json({ message: "Failed to get statistics of the tasks", error: error.message })
    }
}


module.exports = getStatistics