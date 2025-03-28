import { Input, Typography } from 'antd';
const { Title } = Typography;

import "./boxInput.css";

interface Props {
  label: string;
  name: string ;
  value: string | number; 
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string; 
}

function BoxInputBusRouteN({ label, name , value, onChange, type = "number" }: Props) { 
  return (
    <div className="box-input">
      <Title level={5}>{label}</Title>
      <Input type={type} name={name} value={value} onChange={onChange} />
    </div>
  );
}

export default BoxInputBusRouteN;
