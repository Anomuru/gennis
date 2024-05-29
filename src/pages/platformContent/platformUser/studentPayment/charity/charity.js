import React, {useEffect, useState} from 'react';
import Select from "components/platform/platformUI/select";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchPaymentOptions} from "slices/usersProfileSlice";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import {setMessage} from "slices/messageSlice";

const Charity = () => {


    const {userId} = useParams()

    const {payment} = useSelector(state => state.usersProfile)


    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchPaymentOptions(userId))
    },[userId])

    const {request} = useHttp()


    const [selectedGroup,setSelectedGroup] = useState()
    const [selectedGroupCharity,setSelectedGroupCharity] = useState(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps


    const onSubmit = () => {

        const newData = {
            type: "discount",
            discount: selectedGroupCharity,
            group_id: selectedGroup
        }


        request(`${BackUrl}charity/${userId}`,"POST",JSON.stringify(newData),headers())
            .then( res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                    dispatch(fetchPaymentOptions(userId))
                } else {
                    dispatch(setMessage({
                        msg: "Serverda hatolik",
                        type: "error",
                        active: true
                    }))

                }
            })
    }
    
    useEffect(() => {
        // eslint-disable-next-line array-callback-return
        payment?.groups?.map(group => {
            if (group.id === +selectedGroup) {
                setSelectedGroupCharity(group?.charity)
            }
        })
    },[payment?.groups, selectedGroup])



    return (
        <div className="formBox">
            <h1>Xayriya</h1>
            <Select
                group={true}
                onChangeOption={setSelectedGroup}
                options={payment?.groups}
                name={"groups"}
                defaultValue={selectedGroup}
            />
            <form action="" onSubmit={onSubmit}>
                <label htmlFor="payment">
                    <div>
                        <span className="name-field">Chegirma miqdori</span>
                        <input
                            value={selectedGroupCharity}
                            id="payment"
                            className="input-fields"
                            onChange={e => setSelectedGroupCharity(e.target.value)}
                        />
                    </div>
                </label>
                <input className="input-submit" type="submit" value="Tasdiqlash"/>
            </form>

        </div>
    );
};

export default Charity;