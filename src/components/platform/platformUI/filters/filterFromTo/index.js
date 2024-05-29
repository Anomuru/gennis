import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {setFromToFilter} from "slices/filtersSlice";
import Input from "components/platform/platformUI/input";


import "styles/components/_form.sass"
import "./filterFromTo.sass"



const FilterFromTo = ({funcsSlice,activeFilter}) => {

    const [from,setFrom] = useState()
    const [to,setTo] = useState()


    const dispatch = useDispatch()



    const onSubmit = (e) => {
        e.preventDefault()

        const fromTo = {
            from,to
        }

        dispatch(setFromToFilter({activeFilter:activeFilter,fromTo:fromTo}))

    }

    return (
        <form className="fromToForm" onSubmit={onSubmit}>
            <div>
                <Input title={"От"} name={"from"} onChange={setFrom}/>
                <Input title={"До"} name={"to"} onChange={setTo}/>
            </div>
            <input className="input-submit" type="submit"/>
        </form>
    );
};

export default FilterFromTo;