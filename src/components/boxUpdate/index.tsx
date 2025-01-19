import { Button } from "antd";

import "./boxUpdate.css";

interface props {
  onClick: React.MouseEventHandler<HTMLElement>
};

function BoxUpdate({ onClick }: props) {
  return (
    <div className="box-update">
      <Button className="button-primary" onClick={onClick}>Cập nhật</Button>
    </div>
  );
}

export default BoxUpdate;