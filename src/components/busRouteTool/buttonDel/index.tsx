import { Button } from "antd";


interface props {
  // id : string,
  onClick: ( )=> void
}
const ButtonDel = ({onClick}: props) => {

  return (
     <Button color="danger" variant="solid" onClick={onClick}>
        <i className="fa-solid fa-trash" style={{color: 'white'}}></i>
      </Button>
  );
}
// 
export default ButtonDel;