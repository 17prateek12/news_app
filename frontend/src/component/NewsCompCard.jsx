import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaBookmark } from 'react-icons/fa';
import { useSelector } from 'react-redux';


const NewsCompCard = ({ image, datetime, _id, link, source, title, handlebookmark, bookmark }) => {
  const bookmarksArray = Array.isArray(bookmark) ? bookmark : [];
  const isBookmarked = bookmarksArray.some((bok) => bok._id === _id);
  const { user } = useSelector((state) => state.auth);

  const handleBookmarkClick = () => {
    if (!user) {
      alert('Please log in to save bookmarks.');
    } else {
      handlebookmark({ image, datetime, _id, link, source, title });
    }
  };


  return (
    <div className='w-[300px] sm:w-full h-auto overflow-hidden rounded-xl bg-white dark:bg-[#4b4b4b] border-2 border-gray-100 shadow-lg'>
      <div className='w-full flex flex-col items-center justify-center relative'>
        <div className='w-full h-[200px] top-0 -mt-[1.2rem] rounded-xl'>
          {image ? (
            <img
              src={image}
              alt="..."
              fetchpriority="high"
              className='w-full h-full object-fill rounded-xl'
            />
          ) : (
            <img
              src='https://via.placeholder.com/350x210.png?text=Image+Not+Available'
              alt="..."
              fetchpriority="high"
              className='w-full h-full object-contain rounded-xl'
            />
          )}
        </div>
        <div className='w-full h-auto px-4 py-2 flex flex-col gap-2 justify-start items-start'>
          <p className='text-[12px] font-medium dark:text-white'>{source}</p>
          <p className='text-[16px] font-medium line-clamp-2 dark:text-white'>{title}</p>
          <p className='text-[14px] font-normal text-gray-600 dark:text-white'>{new Date(datetime).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' })}</p>
          <div className='w-full flex flex-wrap items-center justify-between'>
            <Link className='no-underline' to={link==='false' ? `https://www.google.com/search?q=${source}+${title}`:link} target='_blank'>
              <button className='w-[120px] h-[40px] rounded-lg bg-black dark:bg-white text-white dark:text-gray-600 flex justify-center items-center text-[14px] my-2'>
                Read more
              </button>
            </Link>
            <button
              className={`flex justify-center items-center text-[14px] p-2 rounded-[50%] ${isBookmarked ? 'bg-gray-200' : 'bg-gray-300'}`}
              onClick={ handleBookmarkClick}>
              <FaBookmark className={`font-semibold ${isBookmarked ? 'text-orange-500' : 'text-black'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

NewsCompCard.propTypes = {
  image: PropTypes.string,
  datetime: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  handlebookmark: PropTypes.func.isRequired,
  bookmark: PropTypes.array.isRequired, // Updated to PropTypes.array
};

export { NewsCompCard };
