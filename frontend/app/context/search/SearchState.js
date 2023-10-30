'use client'
import { useState } from "react";
import SearchContext from "./searchContext";

const SearchState = (props) => {

    const [searchQuery, setSearchQuery] = useState('')

    return (
        <SearchContext.Provider
            value={{
                searchQuery, setSearchQuery
            }}
        >
            {props.children}
        </SearchContext.Provider>
    )
}

export default SearchState;