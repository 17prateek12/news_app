import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <>
    <Navbar />
    <div className='pt-16 max-w-full bg-white dark:bg-gray-700'>
        <Outlet />
    </div>
    </>
  )
}

export {Layout}