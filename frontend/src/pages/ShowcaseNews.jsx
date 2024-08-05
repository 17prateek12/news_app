import React from 'react';
import { ShowCaseCard } from '../component/ShowCaseCard';
import LoadCircle from '../component/LoadCircle';

const ShowcaseNews = ({ shownews }) => {
  const showcasenewsData = Array.isArray(shownews) ? shownews : [];

  if (showcasenewsData.length === 0) {
    return <div className='item flex w-full justify-center'><LoadCircle /></div>;
  }

  return (
    <div className='max-w-[1440px] mx-auto px-6 py-10 bg-white dark:bg-gray-700'>
      <div className='flex flex-col gap-8 items-center justify-center w-full'>
        <p className='text-2xl font-semibold text-gray-700 dark:text-white'>ShowCase News</p>
        <div className='w-full flex flex-wrap gap-8 items-baseline justify-between lg:justify-center'>
          {showcasenewsData.map((news, index) => (
            <div key={index}>
              <ShowCaseCard {...news} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { ShowcaseNews };
