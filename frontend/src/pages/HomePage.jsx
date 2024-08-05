import React, { useEffect, useState, useCallback, useRef } from 'react';
import { ShowCaseCard } from '../component/ShowCaseCard';
import axios from 'axios';
import { NewsCompCard } from '../component/NewsCompCard';
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { PaginationComp } from '../component/Pagination';
import { Link } from 'react-router-dom';
import socket from '../socket/socket';
import LoadCircle from '../component/LoadCircle';
import { fetchBookmarks, addBookmarkToServer, removeBookmarkFromServer  } from '../feature/bookmarkSlice';
import { useSelector, useDispatch } from 'react-redux';

const HomePage = ({ latest, shownews }) => {
  const showcasenewsData = Array.isArray(shownews) ? shownews : [];
  const livenewsData = latest;
  const [isLoading, setIsLoading] = useState(false);
  const [allNews, setAllNews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const containerRef = useRef(null);
  const bookmark = useSelector((state) => state.bookmark.bookmark);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const userId = user ? user._id : null;
  console.log("user id", userId);
  console.log("live news data",livenewsData)
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


  const fetchAllNews = useCallback(async (page) => {
    setIsLoading(true);
    try {
        const response = await axios.get(`/api/news`, {
            params: {
                page: page,
                limit: 30
            }
        });
        console.log('API Response:', response.data);
        setTotalPages(response.data.totalPages || 1);
        const newsData = response.data.data || response.data;
        setAllNews(Array.isArray(newsData) ? newsData : []);
    } catch (error) {
        console.error('Error fetching all news:', error);
    } finally {
        setIsLoading(false);
    }
}, []);


  useEffect(() => {
    fetchAllNews(currentPage);
    socket.on('news-update', (data) => {
      console.log('Socket update:', data);
      setAllNews((prevShowcase) => Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []));
    });
    return () => {
      socket.off('news-update');
    };
  }, [currentPage, fetchAllNews]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className='max-w-[1440px] mx-auto px-6 py-10 bg-white dark:bg-gray-700'>
      <div className='flex md:flex-col-reverse justify-between items-start w-full h-auto' ref={containerRef}>
        <div className='w-[76%] md:w-full flex flex-col px-4'>
          <div className='w-full flex flex-wrap gap-4 items-baseline justify-between lg:justify-center'>
            {isLoading ? (
              <div className='item flex w-full justify-center'><LoadCircle /></div>
            ) : (
              <>
                {allNews.slice(0, 3).map((val) => (
                  <NewsCompCard key={val._id} {...val} handlebookmark={handlebookmark} bookmark={bookmark || []} />
                ))}
              </>
            )}
          </div>
          <div className='w-full my-12'>
            <div className='max-w-full mx-auto'>
              <Swiper
                centeredSlides={true}
                slidesPerView={1}
                spaceBetween={20}
                breakpoints={{
                  648: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 40,
                  },
                }}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                modules={[Pagination, Autoplay]}
              >
                {showcasenewsData.slice(0, 6).map((news) => (
                  <SwiperSlide key={news._id}>
                    <div className='mb-8 flex justify-center'>
                      <ShowCaseCard {...news} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <div className='w-full flex flex-col justify-center items-center'>
            <div className='flex flex-wrap gap-4 items-baseline w-full justify-between lg:justify-center mb-10'>
              {isLoading ? (
                <p></p>
              ) : (
                <>
                  {allNews.slice(4, showAll ? allNews.length : 7).map((item) => (
                    <NewsCompCard key={item._id} {...item} handlebookmark={handlebookmark} bookmark={bookmark || []} />
                  ))}
                </>
              )}
            </div>
            {!showAll ? (
              <div className='w-[120px] h-[50px] text-[14px] rounded-xl flex justify-center items-center gap-4 md:gap-2 hover:scale-105 transition-all ease-in-out duration-500 dark:text-white dark:bg-black hover:dark:border-2 hover:dark:border-white text-black hover:border-gray-500 hover:bg-gray-100'
                onClick={() => setShowAll(true)}>
                Show All
              </div>
            ) : (
              <div className='w-[120px] h-[50px] text-[14px] rounded-xl flex justify-center items-center gap-4 md:gap-2 hover:scale-105 transition-all ease-in-out duration-500 dark:text-white dark:bg-black hover:dark:border-2 hover:dark:border-white text-black hover:border-gray-500 hover:bg-gray-100'
                onClick={() => setShowAll(false)}>
                Show Less
              </div>
            )}
          </div>
          <div className='w-full flex justify-center mt-8'>
            <PaginationComp currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        </div>
        <div className='w-[20%] md:w-full overflow-hidden'>
          <p className='text-xl text-blue-800 dark:text-white font-semibold mb-8'>LATEST UPDATE</p>
          {livenewsData && (
            <div className='w-full gap-4 flex flex-col md:flex-row md:animate-marquee md:mb-10'>
              {livenewsData.slice(0, 6).map((val) => (
                <div key={val._id} className='w-full md:w-[250px] h-auto px-2 rounded-xl border shadow-xl dark:border-gray-100 bg-white dark:bg-[#787777]'>
                  <Link to={val.link==='false'?`https://www.google.com/search?q=${val.source}+${val.title}`:val.link} target='_blank'>
                    <div className='flex justify-between items-center gap-4'>
                      <div className='w-[150px] h-[100px] overflow-hidden'>
                        {val.image ?(
                           <img
                           src={val.image}
                           alt="..."
                           fetchpriority="high"
                           className='w-full h-full object-contain' />
                        ):(
                          <img
                          src='https://via.placeholder.com/350x210.png?text=Image+Not+Available'
                          alt="..."
                          fetchpriority="high"
                          className='w-full h-full object-contain' />
                        )}
                      </div>
                      <div className='flex flex-col justify-start items-start gap-1'>
                        <p className='text-[12px] font-normal text-black dark:text-white'>{val.source}</p>
                        <p className='text-[12px] font-normal text-black dark:text-white line-clamp-1'>{val.title}</p>
                        <p className='text-[12px] font-normal text-black dark:text-white'>
                          {new Date(val.datetime).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' })}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { HomePage };
