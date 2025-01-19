import "./boxHead.css";

interface props {
  title: string
};

function BoxHead({ title }: props) {
  return (
    <div className="box-head">
      <h1 className="title">{title}</h1>
    </div>
  );
}

export default BoxHead;