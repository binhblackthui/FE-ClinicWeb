import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import routes from './Router/routers.js';

function App() {
    return (
        <Router>
            <Header />
            <Routes>
                {routes.map((route, index) => (
                    <Route
                        key={index}
                        path={route.path}
                        element={<route.component />}
                    />
                ))}
            </Routes>
        </Router>
    );
}

export default App;
