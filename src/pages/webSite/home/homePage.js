import React from 'react';
import Home from "components/webSite/home";
import About from "components/webSite/about";
import Course from "components/webSite/course";
import Result from "components/webSite/result";
import Teacher from "components/webSite/teacher";
import News from "components/webSite/news";
import Advantages from "components/webSite/advantages";
import Footer from "components/webSite/footer";

import cls from "./style.module.sass";

const HomePage = () => {
    return (
        <div className={cls.main}>
            <Home/>
            <About/>
            <Course/>
            <Result/>
            <Teacher/>
            <News/>
            <Advantages/>
            <Footer/>
        </div>
    );
};

export default HomePage;