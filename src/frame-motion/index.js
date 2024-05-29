export const containerStudentsNum = {
    show: {
        transition: {
            staggerChildren: 0.35,
        },
    },
};

export const itemStudentsNum = {
    hidden: { opacity: 0, y: 100 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            ease: [0.6, 0.01, 0.05, 0.95],
            duration: 1
        },
    },
    exit: {
        opacity: 0,
        y: -100,
        transition: {
            ease: "easeInOut",
            duration: 0.5,
        },
    },
};


export const scale = {
    hidden: {
        scale: 0.1
    },
    show: {
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 15,
            duration: 0.3
        },
    },
    exit: {
        opacity: 0,
        y: -100,
        transition: {
            ease: "easeInOut",
            duration: 0.5,
        },
    },
};

export const forTitle = {
    hidden: { opacity: 0, y: 100 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            ease: [0.6, 0.01, 0.05, 0.95],
            duration: 1,
        },
    },
    exit: {
        opacity: 0,
        y: 200,
        transition: {
            ease: "easeInOut",
            duration: 0.5,
        },
    },
};


export const forErrorMessage = {
    hidden: {
        opacity: 0,
        y:  -100,
        x: "-50%"
    },
    show: {
        opacity: 1,
        y: 0,
        x: "-50%",
        transition: {
            ease: [0.6, 0.01, 0.05, 0.95],
            duration: 1,
        },
    },
    exit: {
        opacity: 0,
        y: 200,
        transition: {
            ease: "easeInOut",
            duration: 0.5,
        },
    },
};

export const onLikeClick = {
    hidden: {
        scale: 0.7
    },
    animate: {
        scale: 1.2,
        color: "red",
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 15,
            duration: 0.3
        },
        transitionEnd :{
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 15,
                duration: 0.3
            }
        }
    },
    inanimate: {
        scale: 1.2,
        color: "#afafaf",
        transition: {
            type: "spring",
            stiffness: 500,
            damping: 15,
            duration: 0.3
        },
        transitionEnd : {
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 500,
                damping: 15,
                duration: 0.3
            }
        }
    },
    exit: {
        opacity: 0,
        transition: {
            ease: "easeInOut",
            duration: 0.1,
        },
    },
};



export const animateText = {
    hidden: {
        opacity: 0,
        x: -150
    },
    show: (num) => ({
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.7,
            delay: num * 0.2
        }
    }),
    exit: {
        opacity: 1,
        x: 0
    }
}

export const animateBox = {
    hidden: {
        opacity: 0,
        x: 150
    },
    show: (num) => ({
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.7,
            delay: num * 0.2
        }
    }),
    exit: {
        opacity: 1,
        x: 0
    }
}




