import { Button, Table } from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    ExportOutlined,
    PlusCircleOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import ActionsButtonsTable from "./ActionsButtonsTable";
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query } from "firebase/firestore";
import { db, storage } from "../config/firebase";
import FormRegistro from './FormRegistro';
import { HORAS } from "../config/collections";
import * as moment_ from 'moment';
import * as XLSX from 'xlsx';
import { getDownloadURL, ref } from "firebase/storage";
const moment = moment_;


const TableRegistros = () => {
    const [loading, setLoading] = useState(false);
    const [datasource, setDatasource] = useState([]);
    const [selection, setSelection] = useState(null);
    const [visibleForm, setVisibleForm] = useState(false);
    const [action, setAction] = useState("");

    const deleteData = async (id) => {
        await deleteDoc(doc(db, HORAS, id));
    }

    const convertJsonToExcel = () => {
        const data = datasource.map((item) => {
            return {
                "Nombre completo" : item.nombre,
                "Fecha": item.fecha,
                "Obra": item.obra,
                "Justificacion": item.justificacion,
                "Hora de ingreso": item.horaIngreso,
                "Hora de salida" : item.horaSalida,
                "Evidencia ingreso": item.evidenciaIngreso,
                "Evidencia salida" : item.evidenciaSalida
            };
        });
        const workSheet = XLSX.utils.json_to_sheet(data);
        const workBook = XLSX.utils.book_new();
    
        XLSX.utils.book_append_sheet(workBook, workSheet, "horas")
        // Generate buffer
        XLSX.write(workBook, { bookType: 'xlsx', type: "buffer" })
    
        // Binary string
        XLSX.write(workBook, { bookType: "xlsx", type: "binary" })
    
        XLSX.writeFile(workBook, "horasExtra.xlsx")
    
    }

    const handleChangeRowSelection = (selectedRowKeys, selectedRows) => {
        setSelection(selectedRows[0] ? selectedRows[0] : null);
    };

    const handleAdd = () => {
        setAction("add");
        setVisibleForm(true);
    };

    const handleExport = () => {
        convertJsonToExcel();
    };

    const handleRemove = () => {
        deleteData(selection.id);
    };

    const buttonsActions = [
        {
            key: "add",
            label: "Registrar",
            icon: PlusCircleOutlined,
            action: handleAdd,
            disabled: false,
        },
        {
            key: "export",
            label: "Exportar",
            icon: ExportOutlined,
            action: handleExport,
            disabled: !datasource.length,
        },
        {
            key: "remove",
            label: "Eliminar",
            icon: DeleteOutlined,
            action: handleRemove,
            disabled: !selection,
        },
    ];

    const showModal = () => {
        setVisibleForm(true);
    };

    const closeModal = () => {
        setVisibleForm(false);
    };

    useEffect(() => {
        const horasRef = collection(db, HORAS);
        const q = query(horasRef,orderBy("fecha", "desc"));;
        const unsub = onSnapshot(q, (querySnapshot) => {
            const result = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                result.push({
                    id: doc.id,
                    ...data,
                    horaSalida: moment(data.horaSalida.toDate()).format("HH:mm"),
                    horaIngreso: moment(data.horaIngreso.toDate()).format("HH:mm"),
                    fecha: moment(data.fecha.toDate()).format("DD/MM/YYYY"),
                });
            });
            setDatasource(result);
        });
        return () => {
            unsub();
        }
    }, []);

    const downloadEvidencia = (evidencia) => {
        const pathReference = ref(storage, evidencia);
        getDownloadURL(pathReference)
        .then((url) => {
            window.open(url,'_blank');
        })
        .catch((error) => {
        });
    }



    const columns = [
        {
            title: "Nombre completo",
            dataIndex: "nombre",
        },
        {
            title: "Fecha",
            dataIndex: "fecha",
        },
        {
            title: "Obra",
            dataIndex: "obra",
        },
        {
            title: "Justificacion",
            dataIndex: "justificacion",
        },
        {
            title: "HoraIngreso",
            dataIndex: "horaIngreso",
        },
        {
            title: "HoraSalida",
            dataIndex: "horaSalida",
        },
        {
            title: "Evidencia ingreso",
            dataIndex: "evidenciaIngreso",
            render: (text)=> <Button onClick={() => downloadEvidencia(text)} >Descargar evidencia </Button>
        },
        {
            title: "Evidencia salida",
            dataIndex: "evidenciaSalida",
            render: (text)=> <Button onClick={() => downloadEvidencia(text)} >Descargar evidencia </Button>
        },
    ];

    return (
        <>
            <ActionsButtonsTable items={buttonsActions} />
            <Table
                rowSelection={{
                    type: "radio",
                    onChange: handleChangeRowSelection,
                }}
                loading={loading}
                columns={columns}
                rowKey={"id"}
                dataSource={datasource}
                responsive={['xxl', 'xl', 'lg', 'md', 'sm', 'xs']}
            />
            <FormRegistro closeModal={closeModal} visible={visibleForm} data={selection} action={action} />
        </>
    );
};

export default TableRegistros;
