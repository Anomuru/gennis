import {useCallback, useRef} from "react";

const useThrottle = (callback, delay) => {
    let timer;

    // Return an anonymous function that takes in any number of arguments
    return function (...args) {
        // Clear the previous timer to prevent the execution of 'mainFunction'
        clearTimeout(timer);

        // Set a new timer that will execute 'mainFunction' after the specified delay
        timer = setTimeout(() => {
            callback(...args);
        }, delay);
    };
};


export default useThrottle