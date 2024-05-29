import React, {useCallback, useMemo} from 'react';
import {useDispatch} from "react-redux";

import Button from "components/platform/platformUI/button";


import "./filters.sass"
import FilterFromTo from "components/platform/platformUI/filters/filterFromTo";
import FilterSelect from "components/platform/platformUI/filters/filterSelect";
import {setActive} from "slices/filtersSlice";

const Filters = React.memo(({activeOthers,heightOtherFilters,filterRef,filters}) => {

    const clazzOtherFilters = activeOthers ? "otherFilters otherFilters_active" : "otherFilters "

    const style = useMemo(() => ({
        height: heightOtherFilters + "px"
    }),[heightOtherFilters])

    const styleOtherFilters = activeOthers ? style : null

    const renderFilters = useCallback(() => {
        const filtersKeys = Object.keys(filters)
        return filtersKeys?.map((key ,index) => {
            if (filters[key].type === "select") {
                return (
                    <div data-key={index} key={index} className="otherFilters__item">
                        <h2>{filters[key].title}:</h2>
                        <div>
                            <FilterSelect
                                options={filters[key].filtersList}
                                activeFilter={key}
                                name={filters[key].name}
                            />
                        </div>
                    </div>
                )
            }
            else if (filters[key].type === "btn") {
                return (
                    <div data-key={index} key={index} className="otherFilters__item">
                        <h2>{filters[key].title}:</h2>
                        <div>
                            <FilterSubItem
                                activeBtns={filters[key].activeFilters}
                                itemBtns={filters[key].filtersList}
                                activeFilter={key}
                            />
                        </div>
                    </div>
                )
            }
            else if (filters[key].type === "input") {
                return (
                    <div data-key={index} key={index} className="otherFilters__item">
                        <h2>{filters[key].title}:</h2>
                        <div>
                            <FilterFromTo
                                activeFilter={key}
                            />
                        </div>
                    </div>
                )
            }



        })
    },[filters])


    const renderedFilters = renderFilters()


    return (
        <div>
            <div
                className={clazzOtherFilters}
                style={styleOtherFilters}
                ref={filterRef}
            >
                {renderedFilters}
            </div>

        </div>
    );
})




const FilterSubItem = React.memo(({funcsSlice,itemBtns,activeFilter,activeBtns}) => {


    const dispatch = useDispatch()
    const onChangeFilter = (subFilter,activeFilter) => {
        dispatch(setActive({activeFilter : activeFilter, subFilter:subFilter}))
    }


    return itemBtns.map( (item,index) => {


        if (Array.isArray(activeBtns)) {
            return (
                <Button
                    key={index}
                    onClickBtn={() => onChangeFilter(item,activeFilter)}
                    active={activeBtns.includes(item)}
                >
                    {item}
                </Button>

            )
        } else {

            return (
                <Button
                    key={index}
                    onClickBtn={() => onChangeFilter(item,activeFilter)}
                    active={item === activeBtns}
                >
                    {item}
                </Button>

            )
        }

    })
})





export default Filters;