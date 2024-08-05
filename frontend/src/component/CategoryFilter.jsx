import React, { useState } from 'react'

const CategoryFilter = ({onData}) => {
    const [showall, setShowall] = useState(false);
    const [activeButton, setActiveButton] = useState(null);
    const handleButtonClick = (category) => {
        if (activeButton === category) {
            setActiveButton(null); 
            onData(''); 
        } else {
          setActiveButton(category); 
            onData(category); 
        }
      };
    const categories = [
        { label: 'education' },
        { label: 'sports' },
        { label: 'market' },
        { label: 'economy' },
        { label: 'technology' },
        { label: 'india' },
        { label: 'entertainment' },
        { label: 'science' },
        { label: 'health' },
        { label: 'government' },
        { label: 'world' },
        { label: 'business' },
        { label: 'climate' },
        { label: 'ani' },
        { label: 'politics' },
        { label: 'finance' },
        { label: 'startup' },
        { label: 'food' },
        { label: 'travel' },
        { label: 'gaming' },
        { label: 'real estate' },
        { label: 'lifestyle' },
        { label: 'crime' },
        { label: 'automotive' },
        { label: 'fashion' },
        { label: 'culture' }
    ];
    return (
        <div className='flex justify-center items-center flex-wrap gap-8'>
            {categories.slice(0, showall ? categories.length : 7).map((item, idx) => (
                <button className={`w-[120px] h-[50px] text-[14px] rounded-xl sm:w-auto sm:h-auto sm:p-2
            flex justify-center items-center gap-4 md:gap-2 hover:scale-105 transition-all ease-in-out duration-500
           dark:text-white dark:bg-black ${activeButton===item.label ? 'bg-orange-400 text-white dark:bg-orange-400':''}
           hover:dark:border-2 hover:dark:border-white text-black hover:border-2 hover:border-black`}
           onClick={()=>handleButtonClick(item.label)} key={idx}>
                    {(item.label).slice(0, 1).toUpperCase() + (item.label).slice(1,)}
                </button>
            ))}
            {!showall ? (
                <div className='w-[120px] h-[50px] text-[14px] rounded-xl sm:w-auto sm:h-auto sm:p-2
                  flex justify-center items-center gap-4 md:gap-2 hover:scale-105 transition-all ease-in-out duration-500
                 dark:text-white dark:bg-black hover:dark:border-2 hover:dark:border-white text-black hover:border-2 hover:border-black'
                    onClick={() => setShowall(true)}>
                    Show All
                </div>
            ) : (
                <div className='w-[120px] h-[50px] text-[14px] rounded-xl  mt-6 sm:w-auto sm:h-auto sm:p-2
                  flex justify-center items-center gap-4 md:gap-2 hover:scale-105 transition-all ease-in-out duration-500
                 dark:text-white dark:bg-black hover:dark:border-2 hover:dark:border-white text-black hover:border-2 hover:border-black'
                    onClick={() => setShowall(false)}>
                    Hide
                </div>
            )}
        </div>
    )
}

export { CategoryFilter }