import React, {useEffect, useMemo, useState} from 'react';
import Button from "components/platform/platformUI/button";
import Table from "components/platform/platformUI/table";
import Modal from "components/platform/platformUI/modal";
import CheckPassword from "components/platform/platformModals/checkPassword/CheckPassword";
import Select from "components/platform/platformUI/select";
import Confirm from "components/platform/platformModals/confirm/confirm";
import {useDispatch, useSelector} from "react-redux";
import {fetchHistoryOverheadBooks} from "slices/booksSlice";
import {fetchDataToChange} from "slices/dataToChangeSlice";



import "./historyOverheadBooks.sass"

const HistoryOverheadBooks = () => {

    const {booksOverheadHistory} = useSelector(state => state.books)
    const {dataToChange} = useSelector(state => state.dataToChange)


    const [year,setYear] = useState()
    const [paymentType,setPaymentType] = useState()

    const dispatch = useDispatch()


    const filteredHistory = useMemo(() => {
        const filters = {
            year,
            payment_type: paymentType
        }

        const keysFilters = Object.keys(filters)

        return booksOverheadHistory?.editor_balances?.filter(item => {
            return keysFilters.every(key => {
                if (!filters[key] || filters[key] === "all") return true

                if (typeof item[key] === "object") {
                    return item[key].id === +filters[key]
                }
                return item[key] === filters[key]
            })
        })
    },[booksOverheadHistory.editor_balances,paymentType,year])


    useEffect(() => {
        dispatch(fetchHistoryOverheadBooks())
        dispatch(fetchDataToChange())
    },[])

    useEffect(() => {
        if (booksOverheadHistory?.years?.length < 2) {
            setYear(booksOverheadHistory?.years[0])
        }
    },[booksOverheadHistory?.years])



    return (
        <div className="historyOverhead">
            <div className="historyOverhead__header">
                {
                    booksOverheadHistory?.years?.length >= 2 ?
                        <Select
                            name={"year"}
                            title={"Yil"}
                            defaultValue={year}
                            onChangeOption={setYear}
                            options={booksOverheadHistory?.years}
                        />
                        : null
                }

                <Select
                    all={true}
                    group={true}
                    name={"paymentType"}
                    title={"Turi"}
                    defaultValue={paymentType}
                    onChangeOption={setPaymentType}
                    options={dataToChange?.payment_types}
                />

            </div>
            <div className="historyOverhead__wrapper">
                <Table>
                    <tr>
                        <th></th>
                        <th>Hisob</th>
                        <th>Harajatlar </th>
                        <th>Tolovlar </th>
                        <th>Oy</th>
                        <th>To'lov turi</th>
                    </tr>
                    {
                        filteredHistory?.map((item, index) => {
                            return (
                                <tr>
                                    <td>{index + 1}</td>
                                    <td>{item.balance}</td>
                                    <td>{item.overheads_sum}</td>
                                    <td>{item.payments_sum}</td>
                                    <td>{item.month}</td>
                                    <td>{item.payment_type.name}</td>
                                </tr>
                            )
                        })
                    }
                </Table>
            </div>

        </div>
    )
};

export default HistoryOverheadBooks;