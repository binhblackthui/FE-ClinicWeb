// import { createBrowserRouter } from 'react-router-dom';
// import PrivateRoute from '../components/PrivateRoute/PrivateRoute.jsx';
// import Headers from '../components/Header/Header.jsx';
// import LoginPage from '../page/LoginPage/LoginPage.jsx';
// import Homepage from '../page/Homepage/Homepage.jsx';
// import SearchPage from '../page/SearchPage/SearchPage.jsx';
// import ReportSalePage from '../page/ReportPages/ReportSalePage/ReportSalePage.jsx';
// import ReportMedicinePage from '../page/ReportPages/ReportMedicinePage/ReportMedicinePage.jsx';
// import PharmacyPage from '../page/RegulationPages/PharmacyPage/PharmacyPage.jsx';
// import DiseaseListPage from '../page/RegulationPages/DiseaseListPage/DiseaseListPage.jsx';
// import OtherRegulationsPage from '../page/RegulationPages/OtherRegulationsPage/OtherRegulationsPage.jsx';
// import MedicalExaminationPage from '../page/MedicalExaminationPage/MedicalExaminationPage.jsx';
// import MakePage from '../page/MedicalExaminationPage/make.jsx';
// import PayPage from '../page/MedicalExaminationPage/pay.jsx';

// // Authentication routes
// const authenticationRoutes = [
//     { path: '/login', element: <LoginPage /> },
// ];

// // Medical Examination routes
// const medicalExaminationRoutes = [
//     { path: 'examination', element: <MedicalExaminationPage /> },
//     { path: 'make', element: <MakePage /> },
//     { path: 'pay', element: <PayPage /> },
// ];

// // Report routes
// const reportRoutes = [
//     { path: 'report/sales', element: <ReportSalePage /> },
//     { path: 'report/medicines', element: <ReportMedicinePage /> },
// ];

// // Regulation routes
// const regulationRoutes = [
//     { path: 'regulations/pharmacy', element: <PharmacyPage /> },
//     { path: 'regulations/disease-list', element: <DiseaseListPage /> },
//     { path: 'regulations/other', element: <OtherRegulationsPage /> },
// ];

// // Main router configuration
// export const routes = createBrowserRouter([
//     ...authenticationRoutes,
//     {
//         path: '/',
//         element: (
//             <PrivateRoute>
//                 <Headers />
//             </PrivateRoute>
//         ),
//        children: [

//         {   path: 'search', element: <SearchPage /> },
//         ...medicalExaminationRoutes,
//         ...reportRoutes,
//         ...regulationRoutes,

//     ]
//     },
// ]);

