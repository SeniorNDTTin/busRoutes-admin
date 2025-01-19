import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import type { FormProps } from "antd";
import { Button, Form, Input } from "antd";

import configs from "../../../configs";

type FieldType = {
  email: string;
  password: string;
};

function Login() {
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
    try {
      navigate(`/${configs.prefixAdmin}/dashboard`);
      console.log("OK");
    } catch {
      toast.error("Có lỗi xảy ra!");
    }
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = () => {
    toast.error("Có lỗi xảy ra!");
  };

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ minWidth: 600, backgroundColor: "#ffffff", borderRadius: "20px", padding: "60px 30px" }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item<FieldType>
        label="Email"
        name="email"
        initialValue="admin@gmail.com"
        rules={[{ required: true, message: "Nhập email" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Mật khẩu"
        name="password"
        initialValue="Abc@12345"
        rules={[{ required: true, message: "Nhập mật khẩu" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item label={null}>
        <Button type="primary" htmlType="submit">
          Đăng nhập
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Login;