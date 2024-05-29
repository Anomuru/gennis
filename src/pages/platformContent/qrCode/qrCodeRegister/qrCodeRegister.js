import React, {useEffect, useState} from 'react';

import "pages/platformContent/qrCode/qrCodeRegister/qrCodeRegister.sass"
import img from "assets/logo/original logo.png"
import Input from "components/platform/platformUI/input";
import Confetti from "react-confetti"
import Modal from "components/platform/platformUI/modal";
import {motion} from "framer-motion";
import {forTitle, scale} from "frame-motion";
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";

const QrCodeRegister = () => {

    const [name,setName] = useState()
    const [surname,setSurname] = useState()
    const [phone,setPhone] = useState()

    const [submited,setSubmited] = useState(false)
    const [money,setMoney] = useState(null)
    const [activeModal,setActiveModal] = useState(false)
    const [loading,setLoading] = useState(false)

    const {request} = useHttp()

    const onSubmit = (e) => {
        e.preventDefault()

        const data = {
            name,
            surname,
            phone
        }
        setLoading(true)
        request(`${BackUrl}test_register`,"POST", JSON.stringify(data),headers())
            .then(res => {
                if (res.success) {
                    setSubmited(true)
                    setActiveModal(true)
                    setMoney(res.msg)
                    setLoading(false)
                }
            })

    }


    useEffect(() => {
        if (submited) {
            setTimeout(() => {
                setSubmited(false)
            },3000)
        }
    },[submited])


    return (
        <section className="discount">
            <a href="/">
                <img src={img} alt="Logo"/>
            </a>


            <motion.form
                variants={forTitle}
                initial="hidden"
                animate="show"
                exit="exit"
                action=""
                onSubmit={onSubmit}
            >
                {
                    loading ?
                        <DefaultLoader/>
                        : <>
                            <h1>Toldiring</h1>
                            <Input type={"text"} name={"name"} required={true} title={"Ism"} onChange={setName}/>
                            <Input type={"text"} name={"surname"} required={true} title={"Familiya"} onChange={setSurname}/>
                            <Input type={"number"} name={"number"} required={true} title={"Tel. Raqam"} onChange={setPhone}/>
                            <input type={"submit"} value={"Yuborish"} className="input-submit"/>
                        </>
                }
            </motion.form>

            {
                submited ?
                    <Confetti className="confetti"/>
                    : null
            }

            {
                money ?
                    <Modal setActiveModal={() => setActiveModal(false)} activeModal={activeModal}>
                        <div
                            className="jackpot"
                        >
                            <motion.div
                                variants={scale}
                                initial="hidden"
                                exit="exit"
                                whileInView="show"
                                onViewportLeave="exit"
                                viewport={{ amount: 0.2, once:true}}
                            >
                                <h2>Tabriklaymiz yutug'ingiz</h2>
                                <h1>
                                    {money}
                                </h1>

                            </motion.div>
                        </div>
                    </Modal>
                    : null
            }

        </section>

    );
};

export default QrCodeRegister;