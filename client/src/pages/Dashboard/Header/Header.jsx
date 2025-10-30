import React, { useState, useEffect,useRef  } from 'react'
import CSS from './Header.module.css'
import { Link } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { FaHome } from "react-icons/fa";
import Sidebar from '../Sidebar/Sidebar';
import useWidth from '../../../hooks/useWidth';

function Header({value} ) {
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
    <div className={CSS.header}>
      <div className={CSS.search}>
      <div className={CSS.container}>
        <Link to="/"><FaHome /></Link>
      </div>        
      </div>
      <div className={CSS.icons}>
        <h1></h1>
        <span className={CSS.time}>{formattedTime}</span>
        <Link to="/dashboard/setting"><IoMdSettings /></Link>
        <IoMenu onClick={width >= 850 ? toggleSidebar : toggleMobilebar} />        
      </div>
    </div>
       {
      mobilebar && <div ref={sidebarRef} className={CSS.mobilebar}>
        <Sidebar />
        </div>
      }
    </>
  )
}

export default Header

