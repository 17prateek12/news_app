import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../feature/authSlice';
import SearchBar from './SearchBar';
import ThemeIconbutton from './ThemeIconbutton';
import axios from 'axios';
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
    const [dropdown, setDropdown] = useState(false);
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);

    const handleExploreClick = () => {
        setDropdown((prevState) => !prevState);
    };

    const loginWithGoogle = () => {
        window.location.href = `https://news-app-4h7w.onrender.com/auth/google/callback`;
        handleExploreClick();
    };

    const handleLogout = async () => {
        try {
            await axios.get(`https://news-app-4h7w.onrender.com/auth/logout`, { withCredentials: true });
            localStorage.removeItem('user'); // Clear any user data from local storage
            dispatch(logout()); // Dispatch the logout action
            window.location.href = '/';
            handleExploreClick();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navlist = [
        { label: 'Home', link: '/' },
        { label: 'Categories', link: '/category' },
        { label: 'Live', link: '/latest' },
        { label: 'Show Case', link: '/showcase' },
    ];

    return (
        <div className='w-full bg-white dark:bg-gray-700 h-16 top-0 fixed z-[100]'>
            <div className='max-w-full justify-around items-center flex h-full mx-4 gap-4'>
                <div className='w-[400px] flex items-center justify-between lg:hidden'>
                    {navlist.map((item) => (
                        <Link key={item.label} to={item.link}>
                            <button className='text-base text-gray-700 dark:text-white font-medium'>
                                {item.label}
                            </button>
                        </Link>
                    ))}
                    {user && (
                        <Link to='/bookmark'>
                            <button className='text-base text-gray-700 dark:text-white font-medium'>
                                Bookmark
                            </button>
                        </Link>
                    )}
                </div>
                <SearchBar />
                <div className='md:hidden'>
                    <ThemeIconbutton />
                </div>
                <div className='relative'>
                    <button onClick={handleExploreClick} className='text-base text-gray-700 dark:text-white font-medium'>
                        {user ? (
                            <img src={user.photo} alt="Profile" className='w-11 h-12 rounded-full' />
                        ) : (
                            <FaUserCircle className='text-gray-700 dark:text-white text-[40px]' />
                        )}
                    </button>
                    {dropdown &&
                        (
                            <div>
                            <div className='w-[300px] sm:w-[275px] absolute right-0 h-auto rounded-[20px] bg-neutral-200 dark:bg-gray-500 flex flex-col gap-4 py-8 px-4 shadow-lg z-[100]'>
                                <div className='hidden md:flex'>
                                    <ThemeIconbutton />
                                </div>
                                {user ? (
                                    <button className='p-2 rounded-lg w-full flex justify-center items-center bg-black dark:bg-gray-100 text-white font-medium dark:text-gray-900'
                                        onClick={handleLogout}>
                                        LOGOUT
                                    </button>
                                ) : (
                                    <button className='p-2 rounded-lg w-full flex justify-center items-center bg-black dark:bg-gray-100 text-white font-medium dark:text-gray-900'
                                        onClick={loginWithGoogle}>
                                        LOGIN
                                    </button>
                                )}
                                <div className='hidden lg:flex lg:flex-col gap-4 w-full'>
                                    {navlist.map((item) => (
                                        <Link key={item.label} to={item.link}>
                                            <button className='p-2 rounded-lg w-full flex justify-center items-center bg-black dark:bg-gray-100 text-white font-medium dark:text-gray-900'
                                            onClick={handleExploreClick}>
                                                {item.label}
                                            </button>
                                        </Link>
                                    ))}
                                    {user && (
                                        <button className='p-2 rounded-lg flex w-full justify-center items-center bg-black dark:bg-gray-100 text-white font-medium dark:text-gray-900'
                                        onClick={handleExploreClick}>
                                            <Link to='/bookmark'>
                                                Bookmark
                                            </Link>
                                        </button>
                                    )}
                                </div>
                            </div>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default Navbar;
