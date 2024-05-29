import React, {useCallback} from 'react';
import {usePagination,DOTS} from "hooks/usePagination";
import classNames from "classnames";


import "./pagination.sass"


const Pagination = React.memo(props => {



    const {
        onPageChange,
        totalCount,
        siblingCount = 1,
        currentPage,
        pageSize,
        className
    } = props;

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize
    });
    
    const renderPageNumbers = useCallback(() => {
        return paginationRange.map((pageNumber,index) => {
            if (pageNumber === DOTS) {
                return <li key={index} className="pagination-item dots">&#8230;</li>;
            }

            return (
                <li
                    key={index}
                    className={classNames('pagination-item', {
                        selected: pageNumber === currentPage
                    })}
                    onClick={() => onPageChange(pageNumber)}
                >
                    {pageNumber}
                </li>
            );
        })
    },[currentPage, onPageChange, paginationRange])
    
    
    
    
    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];
    
    
    
    const renderedPages = renderPageNumbers()


    return (
        <ul
            className={classNames('pagination-container', { [className]: className })}
        >
            <li
                key={10000}
                className={classNames('pagination-item arrow', {
                    disabled: currentPage === 1
                })}
                onClick={onPrevious}
            >
                <i className="fas fa-angle-left" />
            </li>
            <div className="numbers">
                {renderedPages}
            </div>

            <li
                key={100001}
                className={classNames('pagination-item arrow', {
                    disabled: currentPage === lastPage
                })}
                onClick={onNext}
            >
                <i className="fas fa-angle-right" />
            </li>
        </ul>
    );
})

export default Pagination;