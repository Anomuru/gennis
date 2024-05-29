import {useForm} from "react-hook-form";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";

import {BackUrl} from "constants/global";
import {useHttp} from "hooks/http.hook";
import {fetchLocations} from "slices/locationsSlice";

import cls from 'pages/fastRegister/style.module.scss';
import img from 'assets/logo/Gennis logo.png';
import classNames from "classnames";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import PlatformMessage from "components/platform/platformMessage";
import {setMessage} from "slices/messageSlice";

const FastRegister = () => {

    useEffect(() => {
        dispatch(fetchLocations())
    }, [])

    const {register, handleSubmit} = useForm()
    const {request} = useHttp()
    const dispatch = useDispatch()
    const {locations} = useSelector(state => state.locations)
    const [locationId, setLocationId] = useState()
    const [massage, setMassage] = useState('')
    const [modalStatus, setModalStatus] = useState(false)
    const [timeoutStatus, setTimeoutStatus] = useState(false)
    const [loading, setLoading] = useState(false)

    const onSubmit = (data) => {
        const res = {
            location_id: locationId,
            ...data
        }

        setLoading(true)
        request(`${BackUrl}register_lead`, 'POST', JSON.stringify(res))
            .then(res => {
                setLoading(false)
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                } else {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "error",
                        active: true
                    }))
                }
            })
            .catch(err => {
                setLoading(false)
                setMassage(err.msg)
                setModalStatus(res.success)
            })
    }

    if (modalStatus) {
        setTimeout(() => {
            setTimeoutStatus(true)
        }, 2000)
    }


    return (
        <div className={cls.main}>
            <PlatformMessage>
                {massage}
            </PlatformMessage>
            <div className={cls.main__back}>
                <Link to={'/'}>
                    <img src={img} alt="Gennis_img"/>
                </Link>
            </div>
            <div className={cls.main__item}>
                {
                    loading ?
                        <DefaultLoader/>
                        :
                        <form onSubmit={handleSubmit(onSubmit)}
                              className={cls.main__item_inner}>
                            <h1>Birinchi darsimizga yoziling!</h1>
                            <input
                                required
                                {...register('name')}
                                className={cls.input}
                                type="text"
                                placeholder="Ism"/>
                            <input
                                required
                                {...register('phone')}
                                className={cls.input}
                                type="number"
                                placeholder="+998 (__) ___ __ __"/>
                            <select
                                onChange={(e) => setLocationId(e.target.value)}
                                className={cls.input}
                                required
                            >
                                <option value="">Tanlang</option>
                                {
                                    locations.map(item =>
                                        <option value={item.value}>{item.name}</option>
                                    )
                                }
                            </select>
                            <button className={cls.button}>Register</button>
                        </form>

                }
            </div>
        </div>
    )
}

export default FastRegister;