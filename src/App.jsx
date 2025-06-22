import React, { useState } from 'react'
import Search from './components/search'

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');


  return (
    <main>
      <div className='pattern'>

      </div>
      <div className='wrapper'> 
        <header>
          <img src="./hero-img.png" alt="" />
          <h1>
            Bored? Find the <span className='text-gradient'>Movies</span> You'll Enjoy Below!
          
          </h1>
        </header>

        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
        <h1 className='text-white'>{searchTerm}</h1>
      </div>
  </main>
  )
}

export default App
