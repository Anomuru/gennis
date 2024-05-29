import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useHttp} from "hooks/http.hook";
import {fetchBook} from "slices/booksSlice";
import {BackUrlForDoc} from "constants/global";
import BackButton from "components/platform/platformUI/backButton/backButton";


import styles from "./book.module.sass"

const Book = () => {

    const {id} = useParams()
    const [activeOptions, setActiveOptions] = useState(false)
    const [activeChangeModal, setActiveChangeModal] = useState(false)
    const [activeChangeModalName, setActiveChangeModalName] = useState("")
    const [activeCheckPassword, setActiveCheckPassword] = useState(false)

    const [selectedImg, setSelectedImg] = useState(null)

    const {isCheckedPassword} = useSelector(state => state.me)
    const {book} = useSelector(state => state.books)


    const refs = useRef([])


    const dispatch = useDispatch()
    const {request} = useHttp()

    useEffect(() => {
        dispatch(fetchBook({id}))
    }, [id])


    useEffect(() => {
        if (Object.keys(book).length > 0) {
            setSelectedImg(book?.images[0]?.img)
        }
    }, [book])


    useEffect(() => {
        if (isCheckedPassword && activeChangeModalName) {
            setActiveCheckPassword(false)
            setActiveChangeModal(true)
        }
    }, [activeChangeModalName, isCheckedPassword])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const changeModal = (name) => {
        setActiveChangeModalName(name)
        if (!isCheckedPassword) {
            setActiveCheckPassword(true)
        } else {
            setActiveChangeModal(true)
        }
    }

    const changeActiveImg = (index) => {

        for (let i = 0; i < refs.current.length; i++) {
            if (i === index) {
                for (let x = 0; x < refs.current.length; x++) {
                    refs.current[x].classList.remove("active")
                }

                refs.current[index].classList.add("active")
                setSelectedImg(book.images.filter((item, m) => m === index)[0]?.img)

            }
        }
    }


    const navigate = useNavigate()
    const navigateToPlatform = () => {
        localStorage.setItem("navigate",`books/${id}`)
        navigate("/login")
    }


    return (
        <div className={styles.book}>
            <div className={styles.book__header}>
                <BackButton/>
            </div>

            <div className={styles.book__wrapper}>
                <div className={styles.book__slides}>
                    <img className={styles.main} src={`${BackUrlForDoc}/${selectedImg}`} alt={"Img"}/>


                    <div className={styles.wrapper}>
                        {
                            book?.images?.map((item, index) => {
                                if (index === 0) {
                                    return (
                                        <img
                                            className={styles.active}
                                            key={index}
                                            onClick={() => changeActiveImg(index)}
                                            src={`${BackUrlForDoc}/${item?.img}`}
                                            ref={el => refs.current[index] = el}
                                            alt=""
                                        />
                                    )
                                }

                                return (
                                    <img
                                        key={index}
                                        onClick={() => changeActiveImg(index)}
                                        src={`${BackUrlForDoc}/${item?.img}`}
                                        ref={el => refs.current[index] = el}
                                        alt=""
                                    />
                                )
                            })
                        }
                    </div>
                </div>

                <div className={styles.book__info}>
                    <h1>{book.name}</h1>
                    <p>{book.desc}</p>

                    <div className={styles.line}></div>

                    <div onClick={navigateToPlatform} className={styles.book__infoBtn}>
                        {book.price}
                    </div>
                </div>
            </div>

            {/*<Modal activeModal={activeCheckPassword} setActiveModal={() => setActiveCheckPassword(false)}>*/}
            {/*    <CheckPassword/>*/}
            {/*</Modal>*/}
            {/*{*/}
            {/*    activeChangeModalName === "buy" && isCheckedPassword ?*/}

            {/*        <Modal activeModal={activeChangeModal} setActiveModal={() => setActiveChangeModal(false)}>*/}
            {/*            /!*<Buying disableModal={() => setActiveChangeModal(false)} price={book.price} id={book.id}/>*!/*/}
            {/*        </Modal> : null*/}
            {/*}*/}
        </div>
    );
};

export default Book;