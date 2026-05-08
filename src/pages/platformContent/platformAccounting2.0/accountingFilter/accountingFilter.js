import cls from "./accountingFilter.module.sass"
import PlatformSearch from "components/platform/platformUI/search";
import Button from "components/platform/platformUI/button";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";
import { fetchFilters, setActive, setActiveFilter } from "slices/filtersSlice";
import FilterSelect from "components/platform/platformUI/filters/filterSelect";
import FilterFromTo from "components/platform/platformUI/filters/filterFromTo";
import { motion, AnimatePresence } from "framer-motion";
import useMeasure from "react-use-measure";
import { fetchLocationMoney } from "slices/dataToChangeSlice";
import { newAccountingData, newAccountingDataLoading, newAccountingSelectOptionValue } from "../model/accountingSelector";
import { fetchAccounting } from "pages/platformContent/platformAccounting2.0/model/accountingThunk";
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";
import Modal from "components/platform/platformUI/modal";
import {
    AccountingAddCapital
} from "pages/platformContent/platformAccounting2.0/accountingAddCapital/accountingAddCapital";
import {
    AccountingAddOverhead
} from "pages/platformContent/platformAccounting2.0/accountingAddOverhead/accountingAddOverhead";


export const AccountingFilter = ({ currentPage, pageSize, setCurrentPage, search, setCurrentPage2, currentPage2 }) => {
    const navigate = useNavigate();
    const { locationId } = useParams();
    const { filters, activeFilters } = useSelector(state => state.filters);
    const dispatch = useDispatch();
    const [activeFilter, setActiveFilter] = useState(false);
    const [ref, bounds] = useMeasure();
    const [activeDeleted, setActiveDeleted] = useState(false);
    const [activeArchive, setActiveArchive] = useState(false);
    const selectOptionValue = useSelector(newAccountingSelectOptionValue);
    const data = useSelector(newAccountingData);
    const loading = useSelector(newAccountingDataLoading);
    const [activeAdd, setActiveAdd] = useState(false);

    useEffect(() => {
        setCurrentPage(1);
        setCurrentPage2(1);
    }, [selectOptionValue, activeFilters, activeDeleted, activeArchive, search]);

    useEffect(() => {
        dispatch(fetchLocationMoney(locationId));
    }, [dispatch, locationId]);

    useEffect(() => {
        let filterType;
        switch (selectOptionValue) {
            case "bookPayment":
                filterType = "accounting_payment";
                break;
            case "debtStudents":
                filterType = "debt_students";
                break;
            case "overhead":
                filterType = "accounting_payment";
                break;
            case "dividends":
                filterType = "dividend";
                break;
            default:
                filterType = "capital_tools";
        }
        if (filterType) {
            dispatch(fetchFilters({ name: filterType, location: locationId }));
        }
    }, [selectOptionValue]);

    useEffect(() => {
        let route;
        switch (selectOptionValue) {
            case "bookPayment":
                route = "book_payments/";
                break;
            case "debtStudents":
                route = "debts/";
                break;
            case "overhead":
                route = "overhead/";
                break;
            case "dividends":
                route = "dividends/";
                break;
            case "investments":
                route = "investments/";
                break;
            case "studentsPayments":
                route = "students_payments/";
                break;
            case "teachersSalary":
                route = "teacher_salary/";
                break;
            case "assistentSalary":
                route = "assistent_salary/";
                break;
            case "studentsDiscounts":
                route = "discounts/";
                break;
            case "employeesSalary":
                route = "staff_salary/";
                break;
            case "capital":
                route = "capital/";
                break;
            case "prepayment":
                route = "prepayments/"
                break;
        }

        if (route) {
            dispatch(fetchAccounting({
                locationId,
                currentPage,
                PageSize: pageSize,
                activeFilters,
                deleted: activeDeleted,
                isArchive: activeArchive,
                search,
                route,
                currentPage2,
                type_pagination: selectOptionValue === "bookPayment" ? "book_payments" : ""
            }));
        }
    }, [activeFilters, activeDeleted, activeArchive, currentPage, search, selectOptionValue, locationId, currentPage2]);


    let normalizedData = [];
    let shouldCalculateTotal = false;

    if (Array.isArray(data)) {
        normalizedData = data;
        shouldCalculateTotal = true;
    } else if (data && typeof data === "object") {
        const values = Object.values(data).flat();
        normalizedData = Array.isArray(values) ? values : [];
    }


    const totalPayment = shouldCalculateTotal
        ? normalizedData.reduce(
            (sum, item) =>
                sum +
                (item?.payment ||
                    item?.salary ||
                    item?.price ||
                    item?.amount ||
                    item?.balance ||
                    0),
            0
        )
        : 0;


    const paymentsByType =
        normalizedData.length > 0
            ? normalizedData.reduce((acc, item) => {
                const type =
                    item?.typePayment ||
                    item?.payment_type?.name ||
                    item?.moneyType ||
                    "unknown";
                acc[type] =
                    (acc[type] || 0) +
                    (item?.payment ||
                        item?.salary ||
                        item?.price ||
                        item?.amount ||
                        item?.balance ||
                        0);
                return acc;
            }, {})
            : {};

    Object.keys(paymentsByType).forEach((key) => {
        paymentsByType[key] = paymentsByType[key]?.toLocaleString("");
    });

    return (
        <div className={cls.filter}>
            <div className={cls.filter__header}>
                <div className={cls.filter__header_buttons}>
                    <Button onClickBtn={() => setActiveFilter(!activeFilter)} active={activeFilter}>Filterlar</Button>
                    <Button onClickBtn={() => navigate(`../collection/${locationId}`)}>Harajatlar to'plami</Button>
                    <Button onClickBtn={() => navigate(`../historyAccounting/${locationId}`)}>Harajatlar tarixi</Button>
                    <Button onClickBtn={() => navigate(`../otchot/${locationId}`)}>Otchot</Button>
                </div>

                <div className={cls.filter__header_type}>
                    {loading ? (
                        <DefaultLoaderSmall />
                    ) : (
                        Object.entries(paymentsByType).map(([type, sum]) => (
                            <div key={type} className={cls.filter__header_type_item}>
                                <h1>{type}:</h1>
                                <h2>{sum}</h2>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <AnimatePresence initial={false}>
                <motion.div
                    animate={{ height: activeFilter ? bounds.height : 0, opacity: activeFilter ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className={cls.filter__body_wrapper}
                >
                    <div className={cls.filter__body} ref={ref}>
                        <RenderFilter filters={filters} />
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className={cls.filter__footer}>
                <div className={cls.filter__footer_btns}>
                    <Button onClickBtn={() => setActiveDeleted(!activeDeleted)} active={activeDeleted}>O'chirilganlar</Button>
                    <Button onClickBtn={() => setActiveArchive(!activeArchive)} active={activeArchive}>Arxiv</Button>
                    {(selectOptionValue === "overhead" ||
                        selectOptionValue === "investments" ||
                        selectOptionValue === "capital") && (
                            <Button onClickBtn={() => setActiveAdd(true)}>Qo'shish</Button>
                        )}
                </div>

                <div className={cls.filter__footer_payment}>
                    {loading ? (
                        <DefaultLoaderSmall />
                    ) : shouldCalculateTotal && (
                        <h1>Total: {totalPayment?.toLocaleString()}</h1>
                    )}
                </div>
            </div>

            <Modal activeModal={activeAdd} setActiveModal={setActiveAdd}>
                <div className={cls.modal}>
                    {selectOptionValue === "overhead" && <AccountingAddOverhead setActive={setActiveAdd} />}
                    {selectOptionValue === "capital" && <AccountingAddCapital setActive={setActiveAdd} />}
                </div>
            </Modal>
        </div>
    );
};


const RenderFilter = ({ filters }) => {
    const dispatch = useDispatch();

    const onChangeActiveFilter = (key, value) => {
        dispatch(setActiveFilter({ key, value }));
    };

    const renderFilters = useCallback(() => {
        const filtersKeys = Object.keys(filters);

        return filtersKeys?.map((key, index) => {
            if (filters[key].type === "select") {
                return (
                    <div data-key={index} key={index} className={cls.filter__item}>
                        <h2>{filters[key].title}:</h2>
                        <div>
                            <FilterSelect
                                options={filters[key].filtersList}
                                activeFilter={key}
                                name={filters[key].name}
                            />
                        </div>
                    </div>
                );
            } else if (filters[key].type === "btn") {
                return (
                    <div data-key={index} key={index} className={cls.filter__item}>
                        <h2>{filters[key].title}:</h2>
                        <div className={cls.filter__item_btns}>
                            <FilterSubItem
                                onChangeActiveFilter={onChangeActiveFilter}
                                activeBtns={filters[key].activeFilters}
                                itemBtns={filters[key].filtersList}
                                activeFilter={key}
                            />
                        </div>
                    </div>
                );
            } else if (filters[key].type === "input") {
                return (
                    <div data-key={index} key={index} className={cls.filter__item}>
                        <h2>{filters[key].title}:</h2>
                        <div>
                            <FilterFromTo activeFilter={key} />
                        </div>
                    </div>
                );
            }
        });
    }, [filters]);

    return renderFilters();
};


const FilterSubItem = React.memo(({ itemBtns, activeFilter, activeBtns, onChangeActiveFilter }) => {
    const dispatch = useDispatch();
    const [activeBtn, setActiveBtn] = useState(null);

    const onChangeFilter = (subFilter, activeFilter) => {
        setActiveBtn(subFilter === activeBtn ? null : subFilter);
        dispatch(setActive({ activeFilter: activeFilter, subFilter: subFilter }));
        if (onChangeActiveFilter) {
            onChangeActiveFilter(activeFilter, subFilter);
        }
    };

    return itemBtns.map((item, index) => (
        <Button
            key={index}
            onClickBtn={() => onChangeFilter(item, activeFilter)}
            active={activeBtn === item}
        >
            {item}
        </Button>
    ));
});
