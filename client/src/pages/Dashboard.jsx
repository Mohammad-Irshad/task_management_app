import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import axios from 'axios'

const Dashboard = () => {
  
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedPercent: 0,
    pendingPercent: 0,
    averageCompletionTime: 0,
    pendingSummary: {
      pendingTasks: 0,
      totalTimeLapsed: 0,
      totalTimeToFinish: 0,
      prioritySummary: [],
    },
  })

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('accessToken')
      if (!token) {
          return rejectWithValue('No token found');
      }
      try {
        const response = await axios.get('http://localhost:3000/dashboard/stats', {
          headers: {
              'Authorization': `Bearer ${token}`
          }
      })
        setStats(response.data.taskStats)
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      }
    }
    fetchStats()
  }, []);



  return (
    <div>
      <Header/>
      <main className='container py-3'>
        <h3>Dashboard</h3>

        <section className='py-3'>
          <h4 className='text-center mb-3'>Summary</h4>
          <div className='row'>
            <div className='col-md-3 text-center'>
              <h5 className='text-primary fs-3'>{stats.totalTasks}</h5>
              <p className='text-black-50 fw-medium'>Total Tasks</p>
            </div>
            <div className='col-md-3 text-center'>
              <h5 className='text-primary fs-3'>{stats.completedPercent}%</h5>
              <p className='text-black-50 fw-medium'>Tasks Completed</p>
            </div>
            <div className='col-md-3 text-center'>
              <h5 className='text-primary fs-3'>{stats.pendingPercent}%</h5>
              <p className='text-black-50 fw-medium'>Tasks Pending</p>
            </div>
            <div className='col-md-3 text-center'>
              <h5 className='text-primary fs-3'>{stats.averageCompletionTime} hsr</h5>
              <p className='text-black-50 fw-medium '>Average time per completed task</p>
            </div>
          </div>
        </section>

        <section className='py-3'>
          <h4 className='text-center mb-3'>Pending task summary</h4>
          <div className='row'>
            <div className='col-md-3 text-center'>
              <h5 className='text-primary fs-3'>{stats.pendingSummary.pendingTasks}</h5>
              <p className='text-black-50 fw-medium'>Pending tasks</p>
            </div>
            <div className='col-md-3 text-center'>
              <h5 className='text-primary fs-3'>{stats.pendingSummary.totalTimeLapsed} hrs</h5>
              <p className='text-black-50 fw-medium'>Total time lapsed</p>
            </div>
            <div className='col-md-3 text-center'>
              <h5 className='text-primary fs-3'>{stats.pendingSummary.totalTimeToFinish} hsr</h5>
              <p className='text-black-50 fw-medium'>Total time to finish estimated based on endtime</p>
            </div>
          </div>
        </section>

        <section className='text-center'>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Task Priority</th>
                  <th scope="col">Pending Tasks</th>
                  <th scope="col">Time lapsed (hsr)</th>
                  <th scope="col">Time to finish (hsr)</th>
                </tr>
              </thead>
              <tbody>
                {stats.pendingSummary.prioritySummary.map((priorityData, index) => (
                  <tr key={index}>
                    <td>{priorityData.priority}</td>
                    <td>{priorityData.pendingTasks}</td>
                    <td>{priorityData.timeLapsed.toFixed(1)}</td>
                    <td>{priorityData.timeToFinish.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}

export default Dashboard