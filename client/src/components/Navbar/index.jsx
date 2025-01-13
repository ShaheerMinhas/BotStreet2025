// eslint-disable-next-line no-unused-vars
import React from 'react'
import './App.css'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <div className='flex flex-row justify-center h-20 bg-black'>
        <Link to='/' className='text-white p-3 px-7 mt-3 font-size hovercolor'>Home</Link>
        <Link to='/about' className='text-white p-3 px-7 mt-3 font-size hovercolor'>About</Link>
        <Link to='/signin' className='text-white p-3 px-7 mt-3 font-size hovercolor'>Contact</Link>
    </div>
  )
}

export default Navbar