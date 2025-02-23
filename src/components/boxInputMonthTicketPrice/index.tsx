import { Input, Typography } from 'antd';
const { Title } = Typography;

import "./boxInput.css";

interface Props {
  label: string;
  name: string;
  value: string | number;
  onChange: (name: string, value: string | number) => void; 
  type?: "text" | "number" | "date" | "datetime-local";
}

function BoxInputMonthTicketPrice({ label, name, value, onChange, type = "text" }: Props) {
  return (
    <div className="box-input">
      <Title level={5}>{label}</Title>
      <Input type={type} value={value} onChange={(e) => onChange(name, e.target.value)} />
    </div>
  );
}

export default BoxInputMonthTicketPrice;

