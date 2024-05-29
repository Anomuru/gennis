import React, {useMemo} from 'react';
import {useSelector} from "react-redux";

const useFilteredData = (data, currentPage, PageSize) => {

    const {filters} = useSelector(state => state.filters)
    const {search} = useSelector(state => state.accounting)

    const multiPropsFilter = useMemo(() => {
        const filterKeys = Object.keys(filters);

        console.log(filters)
        console.log(data)
        return data?.filter(user => {
            return filterKeys?.every(key => {
                if (!filters[key]?.activeFilters?.length) return true;
                if (Array.isArray(user[key])) {
                    if (Array.isArray(filters[key]?.activeFilters)) {
                        return user[key].some(keyEle =>
                            filters[key].activeFilters.some(
                                keyFil => keyFil.toLowerCase().includes(keyEle.toLowerCase())
                            )
                        );
                    }
                    return user[key].some(keyEle =>
                        filters[key]?.activeFilters === keyEle
                    );
                }
                if (Array.isArray(filters[key]?.activeFilters)) {
                    return filters[key]?.activeFilters.includes(user[key]);
                }
                return filters[key]?.activeFilters === user[key];
            });
        });
    }, [filters, data]);

    const searchedUsers = useMemo(() => {
        const filteredHeroes = multiPropsFilter?.slice()
        return filteredHeroes?.filter(item =>
            item.name?.toLowerCase().includes(search?.toLowerCase()) ||
            item.surname?.toLowerCase().includes(search?.toLowerCase()) ||
            item.username?.toLowerCase().includes(search?.toLowerCase())
        )
    }, [multiPropsFilter, search])

    const memoized = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return searchedUsers?.slice(firstPageIndex, lastPageIndex);
    }, [PageSize, currentPage, searchedUsers])



    if (memoized && searchedUsers) {
        return [memoized, searchedUsers]
    }
    return [[],[]]


};

export default useFilteredData;