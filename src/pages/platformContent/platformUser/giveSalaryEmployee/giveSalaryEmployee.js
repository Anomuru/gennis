import React, {useEffect, useState} from 'react';
import {useForm} from "react-hook-form";
import {useHttp} from "hooks/http.hook";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import {BackUrl, headers} from "constants/global";
import {setMessage} from "slices/messageSlice";

const GiveSalaryEmployee = ({userId}) => {




    const {
        register,
        formState: {errors},
        handleSubmit,
        reset
    } = useForm({
        mode: "onBlur"
    })







    const {request} = useHttp()
    const dispatch = useDispatch()

    const onSubmit = (data,e) => {
        e.preventDefault()




        request(`${BackUrl}set_salary/${userId}`,"POST", JSON.stringify(data),headers())
            .then(res => {
                if (res.success) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))

                    reset()
                }
                if (res.found) {
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "error",
                        active: true
                    }))

                }

            })
            .catch()
    }



    return (
        <div>

            <form
                action=""
                onSubmit={handleSubmit(onSubmit)}
            >
                <label htmlFor="salary">
                    <div>
                        <span className="name-field">Qiymat</span>
                        <input
                            defaultValue={""}
                            id="salary"
                            type={"number"}
                            className="input-fields "
                            {...register("salary",{
                                required: "Iltimos to'ldiring"
                            })}
                        />
                    </div>
                    {
                        errors?.salary &&
                        <span className="error-field">
                        {errors?.salary?.message}
                    </span>
                    }
                </label>


                <input  className="input-submit" type="submit" />

            </form>
        </div>

    );
};

export default GiveSalaryEmployee;