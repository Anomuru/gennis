import { Routes, Route } from "react-router-dom";

import { BranchStatistics } from "./branchStatistics/branchStatistics";
import { DailyReport } from "./dailyReport/dailyReport";

const PlatformOneDay = () => {
    return (
        <Routes>
            <Route path="/" element={<BranchStatistics />} />
            <Route path="dailyReport" element={<DailyReport />} />
        </Routes>
    );
}

export default PlatformOneDay;