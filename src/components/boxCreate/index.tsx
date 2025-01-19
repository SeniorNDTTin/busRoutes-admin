import { Button } from "antd";

import "./boxCreate.css";

interface props {
  onClick: React.MouseEventHandler<HTMLElement>
};

function BoxCreate({ onClick }: props) {
  return (
    <div className="box-create">
      <Button className="button-primary" onClick={onClick}>Tạo</Button>
    </div>
  );
}

export default BoxCreate;