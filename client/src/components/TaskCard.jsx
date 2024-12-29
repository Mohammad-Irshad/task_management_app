import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { deleteTask, editTask } from '../app/features/taskSlice'

const TaskCard = ({task}) => {

    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    const dispatch = useDispatch()
    
    const [isFinished, setIsFinished] = useState(false)
    const [taskData, setTaskData] = useState({
        title : "",
        startTime : "",
        endTime : "",
        priority : 1,
        status : "Pending"
    })

    const handleChange = (e) => {
        const { id, value } = e.target;
        setTaskData((prevData) => ({
            ...prevData,
            [id]: value, 
        }))
    }

    const statusHandler = () => {
        const newStatus = !isFinished
        setIsFinished(newStatus);
        setTaskData((prevData) => ({
            ...prevData,
            status: newStatus ? "Finished" : "Pending", 
        }))
    }
    
    const updateTaskHandler = async (e, task) => {
        e.preventDefault()
        setLoading(true)
        try{
            const result = await dispatch(editTask({taskId : task._id, updatedData : taskData})).unwrap()
            setErrorMessage(null)
            setSuccessMessage(result.message)
            setTaskData({
                title : "",
                startTime : "",
                endTime : "",
                priority : 1,
                status : "Pending"
            })
            setIsFinished(false)

        }catch(err){
            setSuccessMessage(null)
            setErrorMessage(`${err.message} ${ err.error || "Something went wrong"}`)
        }finally{
            setLoading(false)
        }
                
    }
    
    
    const deleteHandler = (taskId) => {
        dispatch(deleteTask(taskId))
    }

    const populateModalData = (task) => {
        setTaskData({
            title: task.title,
            startTime: new Date(task.startTime).toISOString().slice(0, 16),
            endTime: new Date(task.endTime).toISOString().slice(0, 16),
            priority: task.priority,
            status: task.status,
        })
        setIsFinished(task.status === "Finished")
    }
    const taskStartTime = task.startTime
    const taskEndTime= task.endTime

    const startTimeObj = new Date(taskStartTime)
    const endTimeObj = new Date(taskEndTime)

    const getStartDate = { day: '2-digit', month: 'short', year: '2-digit' }
    const startDate = new Intl.DateTimeFormat('en-GB', getStartDate).format(startTimeObj)

    const getStartTime = { hour: '2-digit', minute: '2-digit', hour12: true }
    const startTime = new Intl.DateTimeFormat('en-US', getStartTime).format(startTimeObj)

    const getEndDate = { day: '2-digit', month: 'short', year: '2-digit' }
    const endDate = new Intl.DateTimeFormat('en-GB', getEndDate).format(endTimeObj)

    const getEndTime = { hour: '2-digit', minute: '2-digit', hour12: true }
    const endTime = new Intl.DateTimeFormat('en-US', getEndTime).format(endTimeObj)



  return (
    <>    
        <div class="card mb-3">
            <div class="card-body">
                <p class="card-subtitle mb-2 text-body-secondary">Task ID : {task._id}</p>
                <h5 class="card-title text-primary">{task.title}</h5>            
                <div className='d-flex justify-content-between mt-3 mb-5'>
                    <div>
                        <p
                            className={`border rounded-pill px-2  text-center ${task.status === 'Pending' ? 'text-danger border-danger' : 'text-success border-success'}`}
                        >
                        {task.status}</p>
                        <p className='mb-0 text-secondary-emphasis fw-medium '>Start</p>
                        <p className='mb-0 text-body-secondary'>{startDate}</p>
                        <p className='mb-0 text-body-secondary'>{startTime}</p>
                    </div>
                    <div>
                        <p>Priority: {task.priority}</p>
                        <p className='mb-0 text-secondary-emphasis fw-medium '>End</p>
                        <p className='mb-0 text-body-secondary'>{endDate}</p>
                        <p className='mb-0 text-body-secondary'>{endTime}</p>
                    </div>
                </div>
                <hr/>
                <div className="d-flex justify-content-around ">
                    <button 
                        className="btn btn-link p-0 text-decoration-underline text-secondary"
                        data-bs-toggle="modal"
                        data-bs-target={`#editTaskModal-${task._id}`}
                        onClick={() => populateModalData(task)}
                    >
                        Edit
                    </button>
                    <button className="btn btn-link p-0 text-decoration-underline text-danger" onClick={() => deleteHandler(task._id)}>                    
                        Delete
                    </button>
                </div>
            </div>
        </div>

        <section>
            <div
                className="modal fade"
                id={`editTaskModal-${task._id}`}
                tabindex="-1"
                aria-labelledby={`editTaskModalLabel-${task._id}`}
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id={`editTaskModalLabel-${task._id}`}>Add New Task</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            {/*  Add Task Form  */}
                            <form onSubmit={(e) => updateTaskHandler(e, task)}>
                                <div className="mb-3">
                                    <label for="title" className="form-label">Title</label>
                                    <input type="text" value={taskData.title} class="form-control" id="title" onChange={(e) => handleChange(e)} /><br/>
                                    <div className='d-flex justify-content-between'>
                                        <div className=''>
                                            <label className='form-label' for="priority">Priority</label>
                                            <select value={taskData.priority || 1} className='form-select' id='priority' onChange={(e) => handleChange(e)}>
                                                <option value={1}>1</option>
                                                <option value={2}>2</option>
                                                <option value={3}>3</option>
                                                <option value={4}>4</option>
                                                <option value={5}>5</option>
                                            </select>
                                            <div className='mt-3'>
                                                <label className='form-label' for="startTime">Start Time</label>
                                                <input type="datetime-local" value={taskData.startTime} className="form-control" id="startTime" name="dateTime" onChange={(e) => handleChange(e)} />
                                            </div>                                            
                                        </div>
                                        <div>
                                            <label className='form-label'>Status</label>
                                            <div className="form-check form-switch d-flex align-items-center">
                                                <input 
                                                    className="form-check-input me-2" 
                                                    type="checkbox" 
                                                    role="switch" 
                                                    id="status" 
                                                    checked={isFinished}
                                                    onChange={statusHandler}
                                                />
                                                <label className="form-check-label" for="status">
                                                    {isFinished ? 'Finished' : 'Pending'}
                                                </label>
                                            </div>
                                            <div className='mt-4 pt-1'>
                                                <label className='form-label' for="endTime">End Time</label>
                                                <input type="datetime-local" value={taskData.endTime} className="form-control" id="endTime" name="dateTime" onChange={(e) => handleChange(e)}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Updating...' : 'Update Task'}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
  )
}

export default TaskCard
