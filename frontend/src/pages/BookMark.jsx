import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NewsCompCard } from '../component/NewsCompCard';
import { fetchBookmarks, removeBookmarkFromServer, addBookmarkToServer } from '../feature/bookmarkSlice';

const BookMark = () => {
  const dispatch = useDispatch();
  const bookmark = useSelector((state) => state.bookmark.bookmark);
  const { user } = useSelector((state) => state.auth);
  const userId = user ? user._id : null;

  useEffect(() => {
    if (userId) {
      dispatch(fetchBookmarks(userId));
    }
  }, [dispatch, userId]);

  const handleBookmark = async (news) => {
    if (userId) {
      if (bookmark.some(item => item._id === news._id)) {
        await dispatch(removeBookmarkFromServer({ userId, newsId: news._id }));
      } else {
        await dispatch(addBookmarkToServer({ userId, news }));
      }
      // Fetch updated bookmarks
      dispatch(fetchBookmarks(userId));
    }
  };

  if (!Array.isArray(bookmark)) {
    return <p>No bookmarks available</p>;
  }

  return (
    <div className='h-[100vh] flex justify-evenly mx-4 items-center gap-8'>
      {bookmark.map((item) => (
        <NewsCompCard 
          key={item._id}
          {...item}
          handlebookmark={handleBookmark}
          bookmark={bookmark}
        />
      ))}
    </div>
  );
};

export default BookMark;
