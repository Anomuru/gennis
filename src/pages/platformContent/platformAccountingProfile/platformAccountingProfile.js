import { Routes, Route } from "react-router-dom";

import PlatformOtchot from "./platformOtchot/platformOtchot";
import AccountingProfileSalary from "./accountingProfileSalary/accountingProfileSalary";
import AccountingProfileStudentsDebt from "./accountingProfileStudentsDebt/accountingProfileStudentsDebt";
import AccountingProfileOverhead from "./accountingProfileOverhead/accountingProfileOverhead";
import AccountingProfileCategory from "./accountingProfileCategory/accountingProfileCategory";
import AccountingProfileOverall from "./accountingProfileOverall/accountingProfileOverall";

const PlatformAccountingProfile = () => {
    return (
        <div
            style={{
                "padding": "2rem 5rem"
            }}
        >
            <Routes>
                <Route index element={<PlatformOtchot />} />
                <Route path="salary" element={<AccountingProfileSalary />} />
                <Route path="students-debt" element={<AccountingProfileStudentsDebt />} />
                <Route path="overhead">
                    <Route index element={<AccountingProfileOverhead />} />
                    <Route path=":categoryId/:date" element={<AccountingProfileCategory />} />
                    <Route path="overall/:date" element={<AccountingProfileOverall />} />
                </Route>
            </Routes>
        </div>
    );
};

export default PlatformAccountingProfile;