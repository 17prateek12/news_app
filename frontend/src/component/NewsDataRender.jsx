import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { PaginationComp } from './Pagination';
import { NewsCompCard } from './NewsCompCard';
import socket from '../socket/socket';
import LoadCircle from './LoadCircle';
import { fetchBookmarks, addBookmarkToServer, removeBookmarkFromServer } from '../feature/bookmarkSlice';
import { useSelector, useDispatch } from 'react-redux';


const NewsDataRender = ({ filter }) => {
    const [allnews, setAllnews] = useState([]); 
    const [totalpage, setTotalpage] = useState(1);
    const [currentpage, setCurrentpage] = useState(1);
    const [isloading, setIsloading] = useState(false);
    const containerRef = useRef(null);
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const userId = user ? user._id : null;
    console.log("user id", userId);
    const bookmark = useSelector((state) => state.bookmark.bookmark);


    useEffect(() => {
        if (userId) {
          dispatch(fetchBookmarks(userId));
        }
      }, [dispatch, userId]);
    
      const handlebookmark = async (news) => {
        if (userId) {
          if (bookmark.some(item => item._id === news._id)) {
            // Remove bookmark
            await dispatch(removeBookmarkFromServer({ userId, newsId: news._id }));
            dispatch(fetchBookmarks(userId)); // Refresh bookmarks
          } else {
            // Add bookmark
            await dispatch(addBookmarkToServer({ userId, news }));
            dispatch(fetchBookmarks(userId)); // Refresh bookmarks
          }
        }
      };

   
    const fetchallnews = useCallback(async (page, filter) => {
        setIsloading(true);
        try {
            let response;
            if (filter) {
                response = await axios.get(`/api/news/${filter}`,{
                    params:{
                        page:page,
                        limit:16
                    }
                });
                console.log("Category news:", response.data);
                const newsData = response.data.data || response.data;
                setAllnews(Array.isArray(newsData) ? newsData : []); // Ensure response data is an array
                setTotalpage(response.data.totalPages);
            } else {
                response = await axios.get(`/api/news`, {
                    params: {
                        page: page,
                        limit: 30
                    }
                });
                console.log("All news on this page:", response.data);
                const newsData = response.data.data || response.data;
                setAllnews(Array.isArray(newsData) ? newsData : []); // Ensure response data is an array
                setTotalpage(response.data.totalPages);
            }
        } catch (error) {
            console.log(`Error in fetching data: ${error}`);
            setAllnews([]); // Set to empty array on error
        } finally {
            setIsloading(false);
        }
    }, []);

    useEffect(() => {
        fetchallnews(currentpage, filter);
        socket.on('news-update', (data) => {
            console.log('Socket update:', data); // Debug socket data
            setAllnews((prevShowcase) => Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : [])); // Ensure data is an array
        });
        return () => {
            socket.off('news-update');
        };
    }, [currentpage, fetchallnews, filter]);

    const handlePageChange = (newPage) => {
        setCurrentpage(newPage);
        if (containerRef.current) {
            containerRef.current.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                const offset = -50;
                const elementPosition = containerRef.current.getBoundingClientRect().top + window.scrollY + offset;
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
            });
        }
    };

    return (
        <div className='flex flex-col justify-center items-center' ref={containerRef}>
            {isloading ? (
                <div className='item flex w-full justify-center'><LoadCircle /></div>
            ) : (
                <>{
                    filter?(
                        <>
                    <div className='flex flex-wrap justify-center gap-8 items-center mb-10'>
                        {allnews.map((val) => (
                                 <NewsCompCard key={val._id} {...val} handlebookmark={handlebookmark} bookmark={bookmark || []} />
                        ))}
                    </div>
                    <PaginationComp currentPage={currentpage} totalPages={totalpage} onPageChange={handlePageChange} />
                    </>
                    ):(
                        <>
                    <div className='flex flex-wrap justify-center gap-8 items-center mb-10'>
                        {allnews.map((val) => (
                                 <NewsCompCard key={val._id} {...val} handlebookmark={handlebookmark} bookmark={bookmark || []} />
                        ))}
                    </div>
                    <PaginationComp currentPage={currentpage} totalPages={totalpage} onPageChange={handlePageChange} />
                    </>
                    )
                }
                </>
            )}
        </div>
    );
}

export { NewsDataRender };
