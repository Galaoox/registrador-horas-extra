import { Route, Routes } from "react-router-dom";
import IndexLayout from "../layouts/IndexLayout";
import FormularioRegistros from '../pages/FormularioRegistros';
import ListadoRegistros from '../pages/ListadoRegistros';


const Navigator = () => {
    return (
        <Routes>
            <Route path="/" element={<IndexLayout />}>
                <Route index element={<ListadoRegistros />} />
            </Route>
        </Routes>
    );
};

export default Navigator;
