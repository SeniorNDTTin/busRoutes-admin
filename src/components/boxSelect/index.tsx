import { Select, Typography } from 'antd';
const { Title } = Typography;

import "./boxSelect.css";

interface props {
  value: string;
  label: string;
  options: { value: string, label: string }[];
  onChange: (value: string) => void;
};

function BoxSelect({ value, label, options, onChange }: props) {
  return (
    <div className="box-select">
      <Title level={5}>{label}</Title>
      <Select
        value={value}
        style={{ width: 360 }}
        onChange={onChange}
        options={options}
      />
    </div>
  );
}

export default BoxSelect;