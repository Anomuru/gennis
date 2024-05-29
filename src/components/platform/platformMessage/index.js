import React, {useEffect, useState} from 'react';

import "components/platform/platformMessage/message.sass"

import {motion} from "framer-motion";
import {forErrorMessage} from "frame-motion";
import classNames from "classnames";
import {useDispatch, useSelector} from "react-redux";
import {setMessage} from "slices/messageSlice";

const Message =  () => {


    const {active,msg,type} = useSelector(state => state.message)


    const dispatch = useDispatch()

    useEffect(() => {
        if (active) {
            setTimeout(() => {
                dispatch(setMessage({
                    msg: "",
                    type: "",
                    active: false
                }))
            },4000)


        }
    },[active])



    return (
        active ? (
            <motion.div
                variants={forErrorMessage}
                initial="hidden"
                animate="show"
                exit="exit"
                className={classNames("message",{
                    error: type === "error",
                    success: type === "success",
                })}
            >
                {msg}
            </motion.div>
        ) : (
            ""
        )
    )
};

export default Message;