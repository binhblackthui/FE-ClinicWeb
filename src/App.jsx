import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Homepage from './page/Homepage/Homepage';
import SearchPage from './page/SearchPage/SearchPage';
import ReportSalePage from './page/ReportPages/ReportSalePage/ReportSalePage';
import ReportMedicinePage from './page/ReportPages/ReportMedicinePage/ReportMedicinePage';
import PharmacyPage from './page/RegulationPages/PharmacyPage/PharmacyPage';
import DiseaseListPage from './page/RegulationPages/DiseaseListPage/DiseaseListPage';
import OtherRegulationsPage from './page/RegulationPages/OtherRegulationsPage/OtherRegulationsPage';
import MedicalExaminationPage from './page/MedicalExaminationPage/MedicalExaminationPage';
import MakePage from './page/MedicalExaminationPage/make';
import PayPage from './page/MedicalExaminationPage/pay';
import LoginPage from './page/LoginPage/LoginPage';
import Headers from './components/Header/Header';
import './App.css';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { useEffect } from 'react';
import { useAuth } from './components/AuthContext/AuthContext';
import { postIntrospection } from './service/service';
const routes = createBrowserRouter([
    {
        path: '/login',
        element: <LoginPage />,
    },
    {
        path: '/',
        element:(
            <PrivateRoute>
                <Headers />
            </PrivateRoute>
        ),
        children: [
            { path: '', element: <Homepage /> },
            { path: 'examination', element: <MedicalExaminationPage /> },
            {path : 'make', element: <MakePage />},
            {path : 'pay', element: <PayPage />},
            { path: 'search', element: <SearchPage /> },
            { path: 'report/sales', element: <ReportSalePage /> },
            { path: 'report/medicines', element: <ReportMedicinePage /> },
            { path: 'regulations/pharmacy', element: <PharmacyPage /> },
            { path: 'regulations/disease-list', element: <DiseaseListPage /> },
            { path: 'regulations/other', element: <OtherRegulationsPage /> },
        ],
    },
]);


function App() {
    const isAuthenticated = useAuth();
    useEffect(() => async () => {
        if (isAuthenticated) {
            try {
            const response = await postIntrospection(localStorage.getItem('token'));
            if (response.data.valid === false) {
                localStorage.removeItem('token');
            }}
            catch (error) {
                console.log(error); 
            }
        } 
    }, []);
    return <RouterProvider router={routes} />;
}

export default App;

