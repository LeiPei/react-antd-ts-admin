import { useState } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { connect } from "react-redux";
import MyIcon from "@/components/icon";
import { saveUser, getLocalUser, saveToken } from "@/utils";
import { setUserInfoAction } from "@/store/user/action";
import { login } from "@/api";
import { UserInfo, Dispatch } from "@/types"
import "./index.less";

interface LoginProps {
  setUserInfo: (info: UserInfo) => void
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  setUserInfo: (info: UserInfo) => dispatch(setUserInfoAction(info)),
});

const IPT_RULE_USERNAME = [
  {
    required: true,
    message: "请输入用户名",
  },
];

const IPT_RULE_PASSWORD = [
  {
    required: true,
    message: "请输入密码",
  },
];

function useLogin(setUserInfo: LoginProps["setUserInfo"]) {
  const [btnLoad, setBtnLoad] = useState(false);
  const onFinish = (values: any) => {
    setBtnLoad(true);
    login(values)
      .then((res) => {
        const { data, msg, status, token } = res;
        setBtnLoad(false);
        if (status === 1 && !data) return;
        const info = Object.assign(data, { isLogin: true })
        saveToken(token);
        message.success(msg);
        if (values.remember) {
          saveUser(info);
        }
        setUserInfo(info);
      })
      .catch(() => {
        setBtnLoad(false);
      });
  };
  return { btnLoad, onFinish };
}

function Login({ setUserInfo }: LoginProps) {
  const { btnLoad, onFinish } = useLogin(setUserInfo);
  return (
    <div className="login-container">
      <div className="wrapper">
        <div className="title">react-ant-admin</div>
        <div className="welcome">欢迎使用，请先登录</div>
        <Form
          className="login-form"
          initialValues={{
            remember: true,
            ...getLocalUser(),
          }}
          onFinish={onFinish}
        >
          <Form.Item name="account" rules={IPT_RULE_USERNAME}>
            <Input
              prefix={<MyIcon type="icon_nickname" />}
              placeholder="账号:admin/user"
            />
          </Form.Item>
          <Form.Item name="pswd" rules={IPT_RULE_PASSWORD}>
            <Input
              prefix={<MyIcon type="icon_locking" />}
              type="password"
              autoComplete="off"
              placeholder="密码:admin123/user123"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住我</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item className="btns">
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={btnLoad}
            >
              登录
            </Button>
            <Button htmlType="reset">重置</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(Login);
