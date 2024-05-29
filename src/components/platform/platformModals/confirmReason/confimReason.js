import React, {useEffect, useState} from 'react';

import cls from "./style.module.sass"


import Select from "components/platform/platformUI/select";
import Input from "components/platform/platformUI/input";

const ConfirmReason = ({getConfirm,text,student,reason}) => {


    const [typeLocation,setTypeLocation] = useState()
    const [typeReason,setTypeReason] = useState()
    const [otherReason,setOtherReason] = useState()


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
        }


        getConfirm(data)
    }



    return (
        <div className={cls.confirm}>
            <div className={cls.confirm__container}>
                <h1 dangerouslySetInnerHTML={{__html: text}}></h1>

                {
                    student ?
                        <form className={cls.types} onSubmit={onSubmit}>
                            <Select
                                name={"locationStudent"}
                                title={"O'quvchi borish joyi"}
                                options={listOptions}
                                defaultValue={typeLocation}
                                onChangeOption={setTypeLocation}
                            />
                            <div className={cls.reasons}>
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
                    reason ?
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

export default ConfirmReason;