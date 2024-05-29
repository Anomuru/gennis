import React, {useEffect, useRef, useState} from 'react';
import cls from "./style.module.sass"
import {BackUrlForDoc} from "constants/global";



const ImgInput = ({
	type = "simple",
	setImg,
	img,
	databaseImg,
	url = false,
	title
}) => {


	const ref = useRef()

	const handleClick = () => {
		ref.current.value = ""
		ref.current.click()
	}


	return (
		<div className={cls.imgInput}>

			<input onChange={e => setImg(e.target.files[0])} ref={ref} type="file"/>

			<div className={cls.imgInput__box} onClick={handleClick}>
				{
					img || databaseImg ?
						databaseImg && !img ?
							<img src={  !url ? `${BackUrlForDoc}${databaseImg}` : databaseImg} alt="Img"/>
						:
							<img src={URL.createObjectURL(img)} alt="Img"/>
						:
						title ? <h1>{title}</h1> : <h1>Rasm tanlang</h1>

				}
			</div>
		</div>
	);
};

export default ImgInput;