import React from 'react';
import {useForm} from "react-hook-form";
import {useHttp} from "hooks/http.hook";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";

const Delete = () => {
    const {
        register,
        handleSubmit,
    } = useForm({
        mode: "onBlur"
    })

    const {userId} = useParams()




    const {request} = useHttp()
    const navigate = useNavigate()
    const dispatch = useDispatch()


    const onSubmit = (data,e) => {
        e.preventDefault()



        // request("http://127.0.0.1:5000/login","POST", JSON.stringify(user))
        //     .then(res => {
        //         dispatch(setUser({
        //             id: res.id,
        //             username: res.username,
        //             role: res.role,
        //             token: res.access_token
        //         }))
        //         setUsername("")
        //         setPassword("")
        //         navigate("/platform")
        //     })
        //     .catch(setActiveError(true))

    }





    return (
        <div>
            <form
                action=""
                onSubmit={handleSubmit(onSubmit)}
            >
                <label htmlFor="reason">
                    <div>
                        <span className="name-field">Sabab</span>
                        <input
                            defaultValue={""}
                            id="reason"
                            className="input-fields "
                            {...register("reason",{
                                required: "Iltimos to'ldiring"
                            })}
                        />
                    </div>
                </label>
                <input type="submit" className="input-submit" value="O'chirish"/>
            </form>
        </div>

    );
};

export default Delete;