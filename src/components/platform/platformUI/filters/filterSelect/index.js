import React, { useEffect, useState } from 'react';
import Select from "components/platform/platformUI/select";
import { useDispatch, useSelector } from "react-redux";
import { setSelectOption } from "slices/filtersSlice";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";

const FilterSelect = React.memo(({ options, activeFilter, name, onChangeActiveFilter }) => {
    const [option, setOption] = useState(null)
    const { filters, activeFilters } = useSelector(state => state.filters)


    const dispatch = useDispatch()
    useEffect(() => {
        if (option) {
            dispatch(setSelectOption({ activeFilter: activeFilter, selectedOption: option }))
        }
    }, [option, activeFilter, dispatch])


    const onChangeOption = (e) => {
        setOption(e)
        if (onChangeActiveFilter) {
            onChangeActiveFilter(activeFilter, e)
        }
    }


    const [optionGroup, setOptionGroup] = useState(null)
    const [optionDate, setOptionDate] = useState(null)

    useEffect(() => {
        if (optionGroup) {
            dispatch(setSelectOption({ activeFilter: "group", selectedOption: optionGroup }))
        }
    }, [optionGroup])
    // useEffect(() => {
    //     if (optionDate?.length){
    //         setOptionGroup(optionDate[0]?.id)
    //     }
    // } , [optionDate])

    const { request } = useHttp()
    useEffect(() => {
        if (activeFilters.teacher) {
            request(`${BackUrl}group/groups_by_teacher/${activeFilters.teacher}`, "GET", null, headers())
                .then(res => {
                    setOptionDate(res.info)
                })
        }
    }, [activeFilters?.teacher])

    function sortByIsDeleted(items) {
        return items.sort((a, b) => Number(a.is_deleted) - Number(b.is_deleted));
    }


    return (
        <div>

            <Select
                all={true}
                defaultValue={activeFilters[activeFilter]}
                onChangeOption={onChangeOption}
                options={sortByIsDeleted(
                    [...options].map(item => item.is_deleted ? { ...item, color: "red" } : item)
                )}
                name={"select-filter"}
                title={name}
            />


            {name === "O'qtuvchi" && <div style={{ marginTop: "10px" }}>
                <h2>Gruhlar:</h2>
                <div>
                    <Select all={true} defaultValue={optionGroup} onChangeOption={setOptionGroup} options={optionDate} />
                </div>
            </div>}
        </div>
    );
});

export default FilterSelect;