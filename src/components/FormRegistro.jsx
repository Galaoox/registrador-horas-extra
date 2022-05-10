import { Modal, Button, Form, Input, Row, Col, DatePicker, Upload } from "antd";
import {
    Timestamp,
    addDoc,
    collection,
    getDoc,
    updateDoc,
} from "@firebase/firestore";
import { TimePicker } from "antd";
import moment_ from 'moment';
import { HORAS } from "../config/collections";
import { db, storage } from "../config/firebase";
import { useEffect, useState } from "react";
import UploadCustom from "./UploadCustom";
import { uploadBytes, ref } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
const moment = moment_;

const FormRegistro = ({ closeModal, visible, data, action }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [evidenciaIngreso, setEvidenciaIngreso] = useState({
        fileList: [],
    });
    const [evidenciaSalida, setEvidenciaSalida] = useState({
        fileList: [],
    });

    const uploadFileToFirebase = async (file) => {
        const id = uuidv4();
        console.log(file);
        const extensionFile = file.name.split(".").pop();
        const fileName = id + "." + extensionFile;
        const storageRef = ref(storage, "evidencias/" + fileName);

        const result = await uploadBytes(storageRef, file);
        return result.metadata.fullPath;
    };

    const uploadFiles = async (docRef) => {
        debugger;
        const ingreso =
            evidenciaIngreso?.fileList?.length > 0
                ? await uploadFileToFirebase(evidenciaIngreso.fileList[0])
                : "";
        const salida =
            evidenciaSalida?.fileList?.length > 0
                ? await uploadFileToFirebase(evidenciaSalida.fileList[0])
                : "";

        updateDoc(docRef, {
            evidenciaIngreso: ingreso,
            evidenciaSalida: salida,
        });
    };

    const save = async (data) => {
        try {
            const docRef = await addDoc(collection(db, HORAS), data);
            await uploadFiles(docRef);
            setLoading(false);
        } catch (e) {
            console.error("Error adding document: ", e);
            setLoading(false);
        }
    };

    const close = () => {
        form.resetFields();
        closeModal(true);
    };

    const handleSubmit = async () => {
        try {
            const result = await form.validateFields();
            const data = {
                ...result,
                fecha: Timestamp.fromDate(moment(result.fecha).toDate()),
                horaIngreso: Timestamp.fromDate(
                    moment(result.horaIngreso).toDate()
                ),
                horaSalida: Timestamp.fromDate(
                    moment(result.horaSalida).toDate()
                ),
            };
            if (action === "add") {
                setLoading(true);
                await save(data);
                form.resetFields();
                setEvidenciaIngreso({ fileList: [] });
                setEvidenciaSalida({ fileList: [] });
                closeModal(true);
            }
        } catch (error) {}
    };

    const format = "HH:mm";

    const rulesForm = {
        nombre: [{ required: true, message: "El nombre es requerido" }],
        fecha: [{ required: true, message: "La fecha es requerida" }],
        obra: [{ required: true, message: "La Obra es requerida" }],
        justificacion: [
            { required: true, message: "La Justificacion es requerida" },
        ],
        horaIngreso: [
            { required: true, message: "La Hora de Ingreso es requerida" },
        ],
        horaSalida: [
            { required: true, message: "La Hora de Salida es requerida" },
        ],
    };

    const onChange = (e) => {};

    return (
        <Modal
            
            style={{ top: 0 }}
            forceRender
            visible={visible}
            title={action === "add" ? "Crear registro" : "Editar registro"}
            onCancel={close}
            footer={[
                <Button key="back" onClick={close} loading={loading}>
                    Cancelar
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    onClick={handleSubmit}
                    loading={loading}
                >
                    Guardar
                </Button>,
            ]}
            destroyOnClose={true}
            maskClosable={false}
        >
            <Form layout="vertical" form={form} >
                <Form.Item
                    name="nombre"
                    label="Nombre completo"
                    rules={rulesForm.nombre}
                >
                    <Input type="text" required maxLength={50} />
                </Form.Item>

                <Form.Item name="fecha" label="Fecha" rules={rulesForm.fecha}>
                    <DatePicker onChange={onChange} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item name="obra" label="Obra" rules={rulesForm.obra}>
                    <Input type="text" required maxLength={50} />
                </Form.Item>

                <Form.Item
                    name="justificacion"
                    label="Justificacion"
                    rules={rulesForm.justificacion}
                >
                    <Input.TextArea required />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="horaIngreso"
                            label="Hora de Ingreso"
                            rules={rulesForm.horaIngreso}
                        >
                            <TimePicker
                                format={format}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="horaSalida"
                            label="Hora de salida"
                            rules={rulesForm.horaSalida}
                        >
                            <TimePicker
                                format={format}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="Evidencia de ingreso">
                            {visible && (
                                <UploadCustom
                                    files={evidenciaIngreso}
                                    setFiles={setEvidenciaIngreso}
                                    text="Subir evidencia"
                                />
                            )}
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Evidencia de salida">
                            {visible && (
                                <UploadCustom
                                    files={evidenciaSalida}
                                    setFiles={setEvidenciaSalida}
                                    text="Subir evidencia"
                                />
                            )}
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
};

const style = {};

export default FormRegistro;
