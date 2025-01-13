import React from 'react'
import './App.css'
function FollowUs() {
  return (
      <div>

          <div className="w-full h-2 line-color"></div>
          <div className="flex justify-center mt-20 mb-20">
            <div className="r1 flex-">
                <div className="text-6xl font-extrabold mb-1 text-pink-500">
                  Subscribe   
                  <div className="text-cyan-400">TO</div>
                </div>
                <div className="text-5xl font-extrabold mb-1 text-fuchsia-900 ">
                Get Notification for the Latest Articles
              </div>
            </div>
           
            

          </div>
          <div className="flex justify-center mb-20">
            <img src='/assets/PaperPlane.png' className='w-40 h-40'></img>
          <form>
                <input type='email' id='email' placeholder='Enter your Email' className=' w-80 h-16 border-pink-500 border-4 justify-center rounded-lg'></input>
            </form>
          </div>
          
      </div>
  )
}

export default FollowUs