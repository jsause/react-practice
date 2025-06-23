import React from 'react'

const Search = ({searchTerm, setSearchTerm}) => {
  return (
    <div className="search">
      <div>
        <img src={`${import.meta.env.BASE_URL}search.svg`} alt="" />
        <input type="text" name="" id="" placeholder='Search through thousands of movies'
        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
      </div>
    </div>
  )
}

export default Search