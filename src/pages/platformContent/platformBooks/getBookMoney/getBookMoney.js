import React, {useEffect, useState} from 'react';


import styles from "./getBookMoney.module.sass"
import Select from "components/platform/platformUI/select";
import {useDispatch, useSelector} from "react-redux";
import {fetchLocations} from "slices/locationsSlice";
import BackButton from "components/platform/platformUI/backButton/backButton";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import Table from "components/platform/platformUI/table";
import {useNavigate} from "react-router-dom";
const GetBookMoney = () => {

    const {locations} = useSelector(state => state.locations)
    const [loc,setLoc] = useState(1)

    const [months,setMonths] = useState([])

    const dispatch = useDispatch()
    const {request} = useHttp()

    useEffect(() => {
        dispatch(fetchLocations())
    },[])

    useEffect(() => {
        const locationData = JSON.parse(localStorage.getItem("extraData"))
        if (Object.values(locationData).length > 0) {
            setLoc(locationData.location)
        }

        localStorage.removeItem("extraData")

    },[])


    console.log(loc)

    useEffect(() => {
        localStorage.setItem("extraData", JSON.stringify({location: loc}))
        request(`${BackUrl}collected_book_payments/${loc}`,"GET",null,headers())
            .then(res => {
                setMonths(res.data.debts)
            })
    },[loc])


    const navigate = useNavigate()

    const toLink = (id) => {
        navigate(`${id}`)
    }


    return (
        <div className={styles.getMoney}>
            <div className={styles.getMoney__header}>
                <BackButton/>

                <h1>Pul olish</h1>

                <Select options={locations} defaultValue={loc} onChangeOption={setLoc} />
            </div>
            <div className={styles.getMoney__wrapper}>
                <Table className={styles.table}>
                    <tr>
                        <th>No</th>
                        <th>Oy</th>
                        <th>Qarz</th>
                    </tr>
                    {
                        months.map((item,index) => {
                            return (
                                <tr onClick={() => toLink(item.month_id)}>
                                    <td style={{width: 40 + "px"}}>{index+1}</td>
                                    <td>{item.month}</td>
                                    <td>{item.debt}</td>
                                </tr>
                            )
                        })
                    }
                </Table>
            </div>
        </div>
    );
};

export default GetBookMoney;