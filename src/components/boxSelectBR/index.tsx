import { Select, Typography } from 'antd';
import React from 'react';
const { Title } = Typography;

interface props {
  style?: React.CSSProperties
  value: string;
  label: string;
  options: { value: string, label: string }[];
  onChange: (value: string) => void;
};

function BoxSelectBR({ value, label, options, onChange, style }: props) {
    return (
      <div className="box-select" style={style}>
        <Title level={5}>{label}</Title>
        <Select
          value={value}
          style={{ width: "100%" }} 
          onChange={onChange}
          options={options}
        />
      </div>
    );
  }

export default BoxSelectBR;