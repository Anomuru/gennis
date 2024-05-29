import React, {useEffect, useMemo} from 'react';
import {Outlet} from "react-router-dom";
import AccountingTable from "components/platform/platformUI/tables/accountingTable";
import {useDispatch, useSelector} from "react-redux";


import "./accountingBooks.sass"
import {fetchBooksAccData} from "slices/booksSlice";
import {fetchLocations} from "slices/locationsSlice";
import Select from "components/platform/platformUI/select";
import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";
import {ROLES} from "constants/global";
import {useAuth} from "hooks/useAuth";


const AccountingBooks = () => {


    const {id} = useAuth()

    const { booksAcc } = useSelector(state => state.books)
    const { locations } = useSelector(state => state.locations)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchLocations())
        dispatch(fetchBooksAccData({type: "book"}))
    },[])

    const activeItems = useMemo(()=> {
        return {
            month: true,
            exist: true,
            taken_money: true,
            total_money: true
        }
    },[])

    const extraInfo = {
        userId: id
    }

    const onChange = (id) => {
        dispatch(fetchBooksAccData({id,type:"book"}))
    }


    console.log(booksAcc)

    return (
        <div className="bookAcc">

            <div className="bookAcc__header">
                <RequireAuthChildren allowedRules={[ROLES.Director]}>
                    <Select title={"Manzillar"} options={locations} onChangeOption={onChange}/>
                </RequireAuthChildren>
            </div>

            <div className="bookAcc__wrapper">
                <AccountingTable
                    typeOfMoney={"book"}
                    activeRowsInTable={activeItems}
                    users={booksAcc}
                    extraInfo={extraInfo}
                />
            </div>
        </div>
    );
};

export default AccountingBooks;