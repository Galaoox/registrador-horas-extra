import { Typography } from 'antd';
import TableRegistros from '../components/TableRegistros';

const { Title } = Typography;

const ListadoRegistros = () => {
  return (
      <>
      <Title>Registro de horas</Title>
      <TableRegistros/>
      </>
  )
}

export default ListadoRegistros