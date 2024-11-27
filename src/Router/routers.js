import Homepage from '../page/Homepage/Hompage.jsx';
import SearchPage from '../page/SearchPage/SearchPage.jsx';
import ReportSalePage from '../page/ReportPages/ReportSalePage/ReportSalePage.jsx';
import ReportMedicinePage from '../page/ReportPages/ReportMedicinePage/ReportMedicinePage.jsx';
import PharmacyPage from '../page/RegulationPages/PharmacyPage/PharmacyPage.jsx';
import DiseaseListPage from '../page/RegulationPages/DiseaseListPage/DiseaseListPage.jsx';
import OtherRegulationsPage from '../page/RegulationPages/OtherRegulationsPage/OtherRegulationsPage.jsx';
import MedicalExaminationPage from '../page/MedicalExaminationPage/MedicalExaminationPage.jsx';
const routes = [
    { path: '/home', component: Homepage },
    {path: '/examination', component: MedicalExaminationPage},
    { path: '/search', component: SearchPage },
    { path: '/report/medicine', component: ReportSalePage },
    { path: '/report/sales', component: ReportMedicinePage },
    { path: '/regulations/pharmacy', component: PharmacyPage },
    { path: '/regulations/disease-list', component: DiseaseListPage },
    { path: '/regulations/other', component: OtherRegulationsPage },
];

export default routes;
