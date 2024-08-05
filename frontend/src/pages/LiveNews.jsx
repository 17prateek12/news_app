import React, { useState, useRef, useEffect } from 'react';
import { NewsCompCard } from '../component/NewsCompCard';
import { PaginationComp } from '../component/Pagination';
import LoadCircle from '../component/LoadCircle';
import { fetchBookmarks, addBookmarkToServer, removeBookmarkFromServer } from '../feature/bookmarkSlice';
import { useSelector, useDispatch } from 'react-redux';

const LiveNews = ({latest}) => {
    const livenewsData = latest;
    const [currentpage, setCurrentpage] = useState(1);
    const containerRef = useRef(null);
    const cardsperpage = 16;
    const indexoflastnews = currentpage * cardsperpage;
    const indexoffirstnews = indexoflastnews - cardsperpage;
    const totalpage = livenewsData ? Math.ceil(livenewsData.length / cardsperpage) : 1;
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


    if (livenewsData.length === 0) {
        return <div className='item flex w-full justify-center'><LoadCircle /></div>;
      }

    const handlePageChange = (newPage) => {
        setCurrentpage(newPage);
        if (containerRef.current) {
            containerRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <div className='max-w-[1440px] mx-auto px-6 py-10 bg-white dark:bg-gray-700' ref={containerRef}>
            <div className='flex flex-col gap-8 items-center justify-center w-full'>
                <p className='text-2xl font-semibold text-gray-700 dark:text-white'>Latest News</p>
                <div className='w-full flex flex-wrap gap-8 items-baseline justify-between lg:justify-center'>
                    {livenewsData && (
                        <>
                            {livenewsData.slice(indexoffirstnews, indexoflastnews).map((val, index) => (
                                <div key={index}>
                                    <NewsCompCard key={val._id} {...val} handlebookmark={handlebookmark} bookmark={bookmark || []} />
                                </div>
                            ))}
                        </>
                    )}
                </div>
                <PaginationComp currentPage={currentpage} totalPages={totalpage} onPageChange={handlePageChange} />
            </div>
        </div>
    );
}

export { LiveNews };