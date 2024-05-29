import React, {memo} from 'react';

import "./search.sass"

const PlatformSearch = memo(({search,setSearch}) => {

    const clazzClearInput = search ? "active" : "inActiveClear"

    const clearInput = () => {
        setSearch("")
    }
    return (
        <label id="search" className="search">
            <span><i className="fas fa-search" /></span>
            <input
                value={search}
                placeholder={"Qidiruv "}
                onInput={e => {
                    setSearch(e.target.value)
                }}
                id="search" type="text"
            />
            <span><i onClick={clearInput} className={`fas fa-times  ${clazzClearInput}`} /></span>


        </label>
    );
},)

export default PlatformSearch;