import { Switch } from "antd";

import "./buttonSwitch.css";

interface Props {
    checked: boolean;
    onChange: (checked: boolean) => void;
    checkedChildren?: string;
    unCheckedChildren?: string;
}

function ButtonSwitch({checked, onChange, checkedChildren, unCheckedChildren} : Props) {

    return (
        <div className="switch-container">
            <Switch 
                className="ant-switch"
                checked={checked} 
                onChange={onChange} 
                checkedChildren={checkedChildren} 
                unCheckedChildren={unCheckedChildren} />
        </div>
    ) 
};

export default ButtonSwitch;