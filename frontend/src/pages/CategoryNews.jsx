import React , {useState} from 'react';
import { CategoryFilter } from '../component/CategoryFilter';
import { NewsDataRender } from '../component/NewsDataRender';


const CategoryNews = () => {
    const [selectfilter, setSelectfilter] = useState("")
    const handleData=(category)=>{
        setSelectfilter(category);
        console.log("selected filter",category);
    }
  return (
    <div className='max-w-[1440px] mx-auto px-6 py-10 bg-white dark:bg-gray-700'>
        <div className='flex flex-col gap-8 items-center justify-center w-full'>
            <CategoryFilter onData={handleData} />
            <NewsDataRender filter={selectfilter} />
        </div>
    </div>
  )
}

export {CategoryNews}