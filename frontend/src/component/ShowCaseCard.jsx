import React from 'react';
import { Link } from 'react-router-dom';

const ShowCaseCard = ({ image, heading, innercards, showdata }) => {
    const cleanText = (text) => {
        return text.replace(/�/g, "");
      };

    return (
        <div className='w-[360px] sm:w-full h-auto overflow-hidden shadow-lg rounded-xl border-2 border-gray-100'>
            <div className='py-4 px-2 flex flex-col w-full bg-white dark:bg-[#787777]'>
                <div className='w-full'>
                    <img
                        src={image}
                        alt="..."
                        fetchpriority="high"
                        className='object-contain'
                    />
                </div>
                <div className='w-full h-8 rounded-xl bg-orange-50 my-2 px-3 flex items-center'>
                    <p className='text-base font-medium text-black'>{heading}</p>
                </div>
                <div className='w-full h-full flex flex-col gap-2'>
                    {innercards.map((val, index) => (
                        <div key={index} className='w-full h-auto flex justify-between items-center gap-2 border border-gray-300 dark:border-gray-100 rounded-lg p-2'>
                            <div className='flex flex-col gap-2 items-start justify-start'>
                                <p className='text-[14px] text-gray-700 font-medium dark:text-white'>
                                    {val.source}
                                </p>
                                <Link to={val.titlelink} target='_blank'>
                                    <p className='text-[14px] text-gray-700 font-medium dark:text-white line-clamp-2'>
                                        {cleanText(val.title)}
                                    </p>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <div className='w-full mt-2 dark:border-gray-100 border-gray-200 border flex-wrap px-2 py-1 rounded-xl flex items-center justify-around'>
                    {showdata.map((val, idx) => (
                        <div key={idx} className='flex flex-wrap justify-around items-center w-full'>
                            <img
                                src={val.imageUrl}
                                alt="..."
                                loading='lazy'
                                fetchpriority="high"
                                className='w-4 h-4 object-contain'
                            />
                            <p className='text-[14px] text-gray-700 font-medium dark:text-white'>{val.showcaseText}</p>
                            <p className='text-[14px] text-gray-700 font-medium dark:text-white'>{new Date(val.datetime).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' })}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export { ShowCaseCard };
