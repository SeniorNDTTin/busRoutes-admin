import { Input, Typography } from 'antd';
const { Title } = Typography;

import "./index.css"

interface Props {
  label: string;
  value: string | number; 
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string; 
}

function BoxTime({ label, value, onChange, type = "text" }: Props) { 
  return (
    <div className="boxTime">
      <Title level={5}>{label}</Title>
      <Input type={type} value={value} onChange={onChange} />
    </div>
  );
}

export default BoxTime;
