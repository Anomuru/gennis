import React, {useEffect} from 'react';


import "./locationMoneys.sass"
import {useDispatch, useSelector} from "react-redux";
import {fetchLocationMoney} from "slices/dataToChangeSlice";
import {ExampleLoaderComponent} from "dev/palette";

const LocationMoneys = ({locationId}) => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchLocationMoney(locationId))
    },[dispatch, locationId])
    const {locationMoneys} = useSelector(state => state.dataToChange)



    return (
        <div className="locationMoneys">
            {
                locationMoneys?.map((item,index) => {
                    return (
                        <div key={index} className="locationMoneys__item">
                            <span>{item.type}:</span>
                            <span>{item?.value?.toLocaleString()}</span>
                        </div>
                    )
                })
            }

        </div>
    );
};

export default LocationMoneys;