import React, { useState, useEffect } from 'react';
import { CiSearch } from "react-icons/ci";
import axios from 'axios';
import ResponseModal from './ResponseModel';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
 
  const searchArticles = async (query) => {
    try {
      const response = await axios.get(`/api/search-all`, {
        params: { q: query }
      });
      setSearchResults(response.data);
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        searchArticles(searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };


  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      searchArticles(searchTerm);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSearchResults([]); // Clear response messages
  };

  return (
    <div className='w-[500px]'>
      <div className='w-full flex justify-end items-center relative h-[2rem] rounded-2xl overflow-hidden border border-gray-400'>
        <input
          type="text"
          placeholder='Search for article...'
          className='w-full h-full pl-4 rounded-2xl focus:outline-none' 
          value={searchTerm}
          onChange={handleInputChange}
        />
        <CiSearch
          className='text-base absolute mr-4 cursor-pointer'
          onClick={handleSearch}
        />
      </div>
      
      <ResponseModal 
        open={modalOpen} 
        handleClose={handleCloseModal} 
        messages={searchResults} 
      />
    </div>
  );
};

export default SearchBar;
