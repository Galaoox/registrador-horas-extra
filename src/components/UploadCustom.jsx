import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload } from "antd";

const UploadCustom = ({ text, files, setFiles }) => {
    const handleUpload = () => {

    };

    const onRemove = (file) => {
        setFiles({
            fileList: [],
        });
    };

    const beforeUpload = (file) => {
        setFiles({
            fileList: [file]
        });
        return false;
    };

    return (
        <>
            <Upload listType="picture" fileList={files.filesList} maxCount={1} handleUpload={handleUpload} onRemove={onRemove} beforeUpload={beforeUpload} >
                <Button icon={<UploadOutlined />}>{text}</Button>
            </Upload>
        </>
    );
};

export default UploadCustom;
