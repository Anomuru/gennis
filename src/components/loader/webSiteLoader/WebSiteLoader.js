import React, {useEffect, useState} from 'react';
import {motion, useAnimation} from "framer-motion"

import "./webSiteLoader.sass"

import logoShapka from "assets/logo/shapka.png"
import logoMoylov from "assets/logo/moylov.png"
import {containerStudentsNum} from "frame-motion";


export const forTitle = {
    hidden: {
        opacity: 0,
        scale: 0,
        zIndex: 1,
        backgroundColor: "rgba(255,255,255,0.9)"
    },
    show: ([num_1,num_2]) => {
        return {
            opacity: 1,
            scale: num_2,
            transition: {
                ease: [0.6, 0.01, 0.05, 0.95],
                duration: 2,
                repeat: Infinity,
                delay: num_1 * 0.3

            },
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.1)"
        }
    },
    exit: {
        scale: 0,
        opacity: 0,
    }
};

export const forTitle_2 = {
    hidden: {
        opacity: 0,
        scale: 8,
        zIndex: 10,
        // y: -1000,
    },
    show: (height = 1000) =>  {
        return {

            opacity: 1,
            scale: 1,
            // y: 0,
            transition: {
                ease: [0.6, 0.01, 0.05, 0.1],
                duration: 1,
                delay: 0.5

            },
            zIndex: 10
        }

    },
    exit: {
        scale: 0,
        opacity: 0
    }

};

export const forMoylov = {
    show:  {
        opacity: 1,
        rotate: 360,
        transition: {
            ease: [0.6, 0.01, 0.05, 0.95],
            duration: 1.3,
            repeat: Infinity,
            delay: 0.5
        }

    }

};

const WebSiteLoader = () => {
    const [animation,setAnimation] = useState(false)

        const controls = useAnimation()
    
    useEffect(() => {
        if (animation) {
            controls.start("show")

        }
    }, [animation, controls])

    return (
        <motion.div
            key={1}
            variants={containerStudentsNum}
            initial="hidden"
            exit="exit"
            animate="show"
            className="Loader"
        >
            <motion.div

                variants={forTitle}
                initial="hidden"
                animate="show"
                exit="exit"
                custom={[1,2.6]}
                className="Loader-box"
            >

            </motion.div>
            <motion.div
                variants={forTitle}
                initial="hidden"
                animate="show"
                exit="exit"
                custom={[2,2.2]}

                className="Loader-box"
            >
            </motion.div>
            <motion.div
                variants={forTitle}
                initial="hidden"
                animate="show"
                exit="exit"
                custom={[3,1.8]}
                className="Loader-box"
            >
            </motion.div>
            <motion.div
                variants={forTitle}
                initial="hidden"
                animate="show"
                exit="exit"
                custom={[4,1.4]}
                className="Loader-box"
            >
            </motion.div>

            <motion.div
                variants={forTitle_2}
                initial="hidden"
                animate="show"
                className="Loader-logo"
                onAnimationComplete={() => setAnimation(true)}
            >
                <img src={logoShapka} alt="Logo"/>
                <motion.img
                    src={logoMoylov}
                    variants={forMoylov}
                    initial="hidden"
                    animate="show"
                    exit="exit"  alt="Logo"
                />
            </motion.div>

        </motion.div>
    );
};


export default WebSiteLoader;