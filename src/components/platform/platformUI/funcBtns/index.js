import React, {useCallback, useEffect, useState} from 'react';

import "./funcBtns.sass"
import {Link} from "react-router-dom";
import Button from "../button";
import {setActiveBtn} from "slices/newStudentsSlice";
import {useDispatch} from "react-redux";
import Select from "components/platform/platformUI/select";


const FuncBtns = React.memo(({funcsSlice,dataBtns,locationId}) => {
    
    const [btns,setBtns] = useState([])


    useEffect(() => {
        setBtns(dataBtns)
    },[dataBtns])


    const dispatch = useDispatch()

    const changeActive = (name) => {
        dispatch(setActiveBtn({name:name}))
    }

    const onChangeOption = (option) => {
        funcsSlice?.onChangeOption(option)
    }



    const renderBtns = useCallback(()=>{
        // eslint-disable-next-line array-callback-return
        return btns.map((btn) => {
            if (btn.type === "btn") {
                if (btn.typeOfChild === "text") {
                    return (
                        <Button
                            key={btn.id}
                            onClickBtn={changeActive}
                            name={btn.name}
                            active={btn.activeModal}
                        >
                            {btn.title}
                        </Button>
                    )
                } else {
                    return (
                        <Button key={btn.id}>
                            <i className={btn.iconClazz}/>
                        </Button>
                    )
                }
            }
            else if (btn.type === "link") {
                const isLocation = btn.location ? `/${locationId}` : null
                return (
                    <Link to={`../../${btn.link}${isLocation}`}>
                        <Button
                            key={btn.id}
                        >
                            {btn.title}
                        </Button>
                    </Link>
                )
            }
            // else if (btn.type === "select" ) {
            //     return (
            //         <Select title={btn.title} options={btn.options} name={btn.name} onChangeOption={onChangeOption} />
            //     )
            // }
        })
    },[btns])

    const renderedBtns = renderBtns()

    return (
        <div className="funcButtons">
            {renderedBtns}
        </div>
    );
})

export default FuncBtns;