import { Input, Typography } from 'antd';
const { Title } = Typography;

import "./boxInput.css";

interface props {
  label: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

function BoxInput({ label, value, onChange }: props) {
  return (
    <div className="box-input">
      <Title level={5}>{label}</Title>
      <Input value={value} onChange={onChange} />
    </div>
  );
}

export default BoxInput;