import React, {useCallback, useEffect} from 'react';


import "./platformDeveloperTools.sass"
import {Link,Outlet} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchDataToChange, fetchDataTools} from "slices/dataToChangeSlice";


const PlatformDeveloperTools = () => {

    const {tools} = useSelector(state => state.dataToChange)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchDataTools())
    },[])


    const renderCreatedTools = useCallback(() => {
        return tools.map(tool => {

            return (
                <div className="createdLists__item">
                    <div className="createdLists__item-title">{tool.title}</div>
                    <div className="createdLists__item-tools">
                        <Link to={`../createConstant/${tool.title}`}>
                            <i className="fas fa-pen"></i>
                        </Link>
                    </div>
                    <div className="createdLists__item-list">
                        {
                            tool.values.map(item => {
                                const keysValues = Object.keys(item)
                                return (
                                    <div className="item">
                                        {
                                            keysValues.map(key => {
                                                if (key === "id") return
                                                return (
                                                    <div>
                                                        <span>{key}:</span>
                                                        <span>{item[key]}</span>
                                                    </div>

                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
            )
        })
    },[tools])


    return (
        <div className="developerTools">
            <div className="container">

                <header>
                    <div>
                        <h1>Developer Tools</h1>
                    </div>
                    <div className="tools">
                        <Link to={"../createConstant/new"}>
                            <i className="fas fa-plus"></i>
                        </Link>
                    </div>
                </header>


                <main>
                    <div className="createdLists">

                        <h1>Created Lists</h1>

                        {renderCreatedTools()}


                    </div>
                </main>

                <Outlet/>

            </div>
        </div>
    );
};

export default PlatformDeveloperTools;