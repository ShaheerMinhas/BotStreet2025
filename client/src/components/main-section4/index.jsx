import React from 'react'
import './App.css'

const Section4 = () => {
  return (
    <div className='flex flex-col md:flex-row  w-full bg-black div-height'>
      <p className='text-white text-xl mt-20 md:mt-60 md:ml-40 text-center'>
        At Bot Street, we offer a blend of insightful articles and engaging audio content by delving into the heart of technical research, ensuring you stay informed and inspired in the world of
      </p>
      
      <div className='h-full w-0 md:w-2/5 back-color-right'>
        <h1 className='text-white text-5xl font-bold mt-16 md:mt-60 ml-20 md:ml-40 ' style={{ color: "#BDFF00" }}>Specials</h1>
      </div>
    </div>
  )
}

export default Section4
