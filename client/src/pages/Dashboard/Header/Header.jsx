import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import Sidebar from '../Sidebar/Sidebar';
import useWidth from '../../../hooks/useWidth';

function Header({ value }) {
  const [, setShowSidebar] = value;
  const width = useWidth()
  const [mobilebar, setMobilebar] = useState(false)
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const formattedTime = time.toLocaleTimeString();

  function toggleMobilebar() {
    setMobilebar((prevState) => !prevState);
  }
  
  function toggleSidebar() {
    setShowSidebar((prevState) => !prevState);
  }
  
  const sidebarRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setMobilebar(() => false); 
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobilebar]);

  return (
    <>
      <div className="flex justify-between items-center p-5 sticky top-2.5 z-10 bg-[#1C2428] w-[99%] mx-auto text-white md:w-[97%]">
        <div className="search">
          <div className="container">
            <Link to="/"><FaHome /></Link>
          </div>        
        </div>
        <div className="flex items-center gap-3 md:gap-2.5">
          <h1 className="w-1.5 h-1.5 bg-red-500 rounded-full p-0.5"></h1>
          <span className="opacity-70 text-sm font-light">{formattedTime}</span>
          <Link to="/dashboard/setting">
            <IoMdSettings className="text-xl opacity-70 hover:opacity-100 cursor-pointer" />
          </Link>
          <IoMenu 
            onClick={width >= 850 ? toggleSidebar : toggleMobilebar} 
            className="text-xl opacity-70 hover:opacity-100 cursor-pointer" 
          />        
        </div>
      </div>
      {mobilebar && (
        <div ref={sidebarRef} className="fixed top-0 left-0 h-full w-1/2 z-10000">
          <Sidebar />
        </div>
      )}
    </>
  )
}

export default Header