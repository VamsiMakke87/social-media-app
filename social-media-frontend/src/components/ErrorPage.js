import React from 'react'
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
    const navigate= useNavigate();
  return (
    <div className='mt-10 justify-items-center'>
        <a className=' block text-2xl font-bold'>Opps page do not exist!!</a>
        <a onClick={()=>{navigate("/")}} className='underline text-blue-700 cursor-pointer'>Go Home</a>
    </div>
  )
}

export default ErrorPage;