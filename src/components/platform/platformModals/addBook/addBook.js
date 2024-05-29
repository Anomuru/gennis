import React, {useRef, useState} from 'react';


import "./addBook.sass"
import Modal from "components/platform/platformUI/modal";
import Input from "components/platform/platformUI/input";
import {BackUrl, headers} from "constants/global";
import {useHttp} from "hooks/http.hook";
import {useDispatch} from "react-redux";
import {setBook} from "slices/booksSlice";
import {setMessage} from "slices/messageSlice";
const AddBook = ({activeModal,setActiveModal}) => {

    const [name,setName] = useState("")
    const [editorShare,setEditorShare] = useState(0)
    const [eductionShare,setEductionShare] = useState(0)
    const [desc,setDesc] = useState("")
    const [img,setImg] = useState({
        images: [],
        lastId: 1
    })

    const refImg = useRef()


    const {request} = useHttp()
    const dispatch = useDispatch()
    const onSubmit = (e) => {
        e.preventDefault()

        let formData = new FormData();

        const token = sessionStorage.getItem("token")
        const headers1 = {
            "Authorization": "Bearer " + token,
            // "Content-Type": "multipart/form-data"
        }

        for (let i = 0 ; i < img.images.length ; i++) {
            formData.append(`file-${i}`, img.images[i].file);
        }

        const newData = {
            name,
            desc,
            editorShare,
            eductionShare
        }


        formData.append("info", JSON.stringify(newData))

        request(`${BackUrl}book`, "POST",formData,headers1)
            .then(res => {
                if (res.success ){
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                    dispatch(setBook({book: res.book}))
                }
            })
            .then(() => {
                setActiveModal(false)
            })

    }

    const onClickImg = () => {
        refImg.current.click()
    }

    const getImg = (e) => {

        const images = []
        for (let i = 0; i < e.target.files.length; i++) {
            const data = {
                id: img.lastId,
                img: URL.createObjectURL(e.target.files[i]),
                file: e.target.files[i]
            }
            images.push(data)
        }

        setImg({
            images: [...images,...img.images],
            lastId: img.lastId+1
        })
    }

    const deleteSelectedImg = (id) => {
        const newArray = img.images.filter(item => item.id !== id)

        setImg({
            ...img,
            images: newArray
        })
    }




    return (
        <Modal activeModal={activeModal} setActiveModal={() => setActiveModal(false)}>
            <div className="addBookModal">
                <form className="modal-form" action="" onSubmit={onSubmit}>
                    {
                        img.images.length < 3 &&
                            <div className={"img"} onClick={onClickImg}>
                                <input
                                    onChange={(e) => getImg(e)}
                                    ref={refImg}
                                    type="file"
                                />
                                {img.images.length !== 0 ?
                                    <h1>Rasm qo'shish</h1> : <h1>Rasmlarni tanlang</h1>
                                }
                            </div>
                    }


                    <div className="images">
                        {img.images.length !== 0 ?
                            img?.images?.map(item => {
                                return (
                                    <div className="images__item">
                                        <div className="images__item-del" onClick={() => deleteSelectedImg(item.id)}>
                                            <i className="fas fa-times"></i>
                                        </div>
                                        <img src={item.img} alt="rasm"/>
                                    </div>
                                )
                            }) : null
                        }
                    </div>

                    <Input required={true} title={"Nomi"}  onChange={setName}/>

                    <Input required={true} title={"Kitobсhi uchun dolya"} type={"number"}  onChange={setEditorShare}/>
                    <Input required={true} title={"Filial uchun dolya"} type={"number"}  onChange={setEductionShare}/>


                    <textarea
                        required={true}
                        onChange={e => setDesc(e.target.value)}
                        value={desc}
                        name=""
                        id=""
                        cols="30"
                        rows="10"
                    >

                    </textarea>
                    <input
                        className="input-submit"
                        // disabled={isSubmit}
                        type="submit"
                    />


                </form>
            </div>
        </Modal>
    );
};

export default AddBook;