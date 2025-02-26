
import "./checkbox.css";
import { Checkbox, Col, Row } from "antd";

interface Props {
  selectedValues: string[];
  options: { value: string; label: string }[];
  onCheck: (value: string[]) => void;
  orderMap: Map<string, number>;
}

function CheckBox({ options, selectedValues, onCheck, orderMap }: Props) {
  return (
    <div className="box-select">
      <Checkbox.Group style={{ width: "100%" }} value={selectedValues} onChange={onCheck}>
        <Row>
          {options.map((item) => (
            <Col span={8} key={item.value}>
              <Checkbox value={item.value}>
                {item.label}
                {orderMap.has(item.value) ? (
                  <span className="order-badge">{orderMap.get(item.value)}</span>
                ) : null}{" "}
              </Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
    </div>
  );
}

export default CheckBox;
