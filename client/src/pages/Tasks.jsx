import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import TaskCard from '../components/TaskCard'
import { useDispatch, useSelector } from 'react-redux'
import { addTask, getAllTasks } from '../app/features/taskSlice'

const Tasks = () => {
    const {allTasks, status} = useSelector((state) => state.tasks)
    const dispatch = useDispatch()

    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    const [isFinished, setIsFinished] = useState(false)
    const [taskData, setTaskData] = useState({
            title : "",
            startTime : "",
            endTime : "",
            priority : 1,
            status : "Pending"
    })

    const [priorityFilter, setPriorityFilter] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [sortOption, setSortOption] = useState("")

    const [filteredTasks, setFilteredTasks] = useState([])


    console.log(allTasks)

    useEffect(() => {
        dispatch(getAllTasks())
    },[])

    useEffect(() => {
        applyFiltersAndSort()
    }, [priorityFilter, statusFilter, sortOption, allTasks])


    const handleChange = (e) => {
        const { id, value } = e.target
        setTaskData((prevData) => ({
            ...prevData,
            [id]: value, 
        }))
    }
    

    const statusHandler = () => {
        const newStatus = !isFinished;
        setIsFinished(newStatus);
        setTaskData((prevData) => ({
            ...prevData,
            status: newStatus ? "Finished" : "Pending", 
        }))
    }

    const addTaskHandler = async (e) => {
        e.preventDefault()
        
        try{
            const result = await dispatch(addTask(taskData)).unwrap()
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
        }
                
    }

    const resetFiltersAndSort = () => {
        setPriorityFilter("");
        setStatusFilter("");
        setSortOption("");
    }

    const applyFiltersAndSort = () => {
        let updatedTasks = [...allTasks]

        if (priorityFilter) {
            updatedTasks = updatedTasks.filter(task => task.priority === Number(priorityFilter))
        }

        if (statusFilter) {
            updatedTasks = updatedTasks.filter(task => task.status === statusFilter)
        }

        if (sortOption) {
            updatedTasks.sort((a, b) => {
                if (sortOption === "start-asc") return new Date(a.startTime) - new Date(b.startTime)
                if (sortOption === "start-desc") return new Date(b.startTime) - new Date(a.startTime)
                if (sortOption === "end-asc") return new Date(a.endTime) - new Date(b.endTime)
                if (sortOption === "end-desc") return new Date(b.endTime) - new Date(a.endTime)
                return 0
            })
        }

        setFilteredTasks(updatedTasks)
    }

    const clearMessge = () => {
        setSuccessMessage(null)
        setErrorMessage(null)
    }

  return (
    <div>
      <Header/>
      <main className='container py-3'>
        <h3>Task List</h3>

        <section className='py-3 mt-5'>
            <div className='d-flex justify-content-between'>
                <div>
                    <button className='btn btn-outline-primary' data-bs-toggle="modal" data-bs-target="#addTaskModal" onClick={() => clearMessge()}>+ Add Task</button>
                </div>
                <div className='d-flex justify-content-end' style={{ width: '65%' }}>
                    <button
                        className="btn btn-outline-danger me-3"
                        onClick={resetFiltersAndSort}
                    >
                        Reset All
                    </button>
                    <div className='d-flex justify-content-between' style={{ width: '70%' }}>                    
                        <select className="form-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                            <option value="">Sort</option>
                            <option value="start-asc">Start Time - ASC</option>
                            <option value="start-desc">Start Time - DESC</option>
                            <option value="end-asc">End Time - ASC</option>
                            <option value="end-desc">End Time - DESC</option>
                        </select>
                        <select className="form-select mx-3 " value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                            <option value="">Priority</option>
                            {[1, 2, 3, 4, 5].map(priority => (
                                <option key={priority} value={priority}>{priority}</option>
                            ))}
                        </select>
                        <select className="form-select " value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Finished">Finished</option>
                        </select>
                    </div>
                </div>                
            </div>
        </section>

        <section>
            <div className='row'>
                {status === 'loading' && <p>Loading...</p>}
                {status === 'success' && filteredTasks.length > 0 ? filteredTasks.map((task) => {
                    return (
                        <div className='col-md-3' key={task._id}>
                            <TaskCard task={task}/>
                        </div>
                    )
                    
                }) : 
                <p>Task list is empty</p>
                }
            </div>
            
        </section>

        <section>
            <div
                className="modal fade"
                id="addTaskModal"
                tabindex="-1"
                aria-labelledby="addTaskModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addTaskModalLabel">Add New Task</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/*  Add Task Form  */}
                            <form onSubmit={(e) => addTaskHandler(e)}>
                                <div className="mb-3">
                                    <label for="title" className="form-label">Title</label>
                                    <input type="text" value={taskData.title} className="form-control" id="title" onChange={(e) => handleChange(e)} /><br/>
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
                                                    value={taskData.status}
                                                    checked={isFinished}
                                                    onChange={statusHandler}
                                                />
                                                <label class="form-check-label" for="status">
                                                    {isFinished ? 'Finished' : 'Pending'}
                                                </label>
                                            </div>
                                            <div className='mt-4 pt-1'>
                                                <label className='form-label' for="endTime">End Time</label>
                                                <input type="datetime-local" value={taskData.endTime} class="form-control" id="endTime" name="dateTime" onChange={(e) => handleChange(e)}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary">Save Task</button>
                            </form>
                            {errorMessage && <p className='text-danger mt-3'>{errorMessage}</p>}
                            {successMessage && <p>{successMessage}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </main>
    </div>
  )
}

export default Tasks
