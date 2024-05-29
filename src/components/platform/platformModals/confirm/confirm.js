import React, {useEffect, useState} from 'react';

import "./confirm.sass"


import "components/platform/platformModals/confirm/confirm.sass"
import Select from "components/platform/platformUI/select";
import Input from "components/platform/platformUI/input";

const Confirm = ({getConfirm,text,student,reason,setActive,reset}) => {


    const [confirm,setConfirm] = useState("")
    const [typeLocation,setTypeLocation] = useState()
    const [typeReason,setTypeReason] = useState()
    const [otherReason,setOtherReason] = useState()



    useEffect(() => {
        if (confirm && !student && !reason) {
            getConfirm(confirm)
            setConfirm("")
        }
        if (confirm === "no") {
            setActive(false)
            getConfirm(confirm)
            setConfirm("")
        }
    },[confirm, getConfirm, reason, student])

    const listOptions = [
        {
            value: "deletedStudents",
            name: "O'chirilgan o'quvchilar"
        },
        {
            value: "newStudents",
            name: "Yangi o'quvchilar"
        }
    ]

    const typeReasons = [
        {

            name: "O'qituvchi yoqmadi",

        },
        {
            name: "O'quvchi o'qishni eplolmadi"
        },
        {
            name: "Pul oilaviy sharoit"
        },
        {
            name: "boshqa"
        }
    ]

    const onSubmit = (e) => {
        e.preventDefault()

        const data = {
            typeLocation,
            typeReason,
            otherReason,
            confirm
        }

        getConfirm(data)
    }



    return (
        <div className="confirm">
            <div className="confirm__container">
                <h1 dangerouslySetInnerHTML={{__html: text}}></h1>
                {
                    !confirm ?
                        <div className="btns">
                            <div className="btns__item" onClick={() => setConfirm("yes")}>Ha</div>
                            <div className="btns__item" onClick={() => setConfirm("no")}>Yoq</div>
                        </div> : null
                }
                {
                    student && confirm === "yes" ?
                        <form className="types" onSubmit={onSubmit}>
                            <Select
                                name={"locationStudent"}
                                title={"O'quvchi borish joyi"}
                                options={listOptions}
                                defaultValue={typeLocation}
                                onChangeOption={setTypeLocation}
                            />
                            <div className="reasons">
                                {
                                    typeLocation === "deletedStudents" ?
                                        <Select
                                            options={typeReasons}
                                            onChangeOption={setTypeReason}
                                            defaultValue={typeReason}
                                            title={"Sabablar"}
                                            name={"reasons"}
                                        /> : null
                                }
                                {
                                    typeReason === "boshqa" && typeLocation === "deletedStudents" ?
                                        <Input
                                            name={"otherReason"}
                                            title={"Boshqa sabab"}
                                            onChange={setOtherReason}
                                            type={"text"}
                                        /> : null
                                }
                            </div>
                            <input type="submit" className="input-submit"/>
                        </form>
                        : null
                }

                {
                    reason && confirm === "yes"  ?
                        <form action="" onSubmit={onSubmit}>
                            <Input
                                name={"otherReason"}
                                title={"sabab"}
                                onChange={setOtherReason}
                                type={"text"}
                            />
                            <input type="submit" className="input-submit"/>
                        </form>
                        : null
                }
            </div>

        </div>
    );
};

export default Confirm;