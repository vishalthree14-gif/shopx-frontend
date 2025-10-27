import { useState } from 'react';
import './SearchBar.css'


const SearchBar = () =>{
    const [query, setQuery] = useState("");

    const handleQuery = (e) => {

        setQuery(e.target.value);
    }

    const handleSearch = (e) => {

        e.preventDefault();
        console.log('search for :->',query)
    }


    return (
        <>
            <div className='search-sec'>
                <form >

                    <input
                        name="name"
                        type="text"
                        placeholder="product name..."
                        onChange={handleQuery}
                        value={query}
                        autoComplete='off'
                    />
                    <button>Search</button>
                </form>
            </div>
        </>
    )
};

export default SearchBar;
