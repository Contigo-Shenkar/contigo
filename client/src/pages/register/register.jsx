import React, { useState } from "react";
import { Form, Input, Checkbox } from "antd";
import spaceship from "../assets/register-spaceship.svg";
import logo from "../assets/logo.svg";
import styles from "./register.module.scss";
import {
  getRequrieRules,
  getStrongPasswordRules,
  getValidateEmailRules,
} from "../../helpers/forms";
import Button from "../../components/button/button";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../features/authSlice";
import { useEffect } from "react";

export function Register() {
  const [email, setEmail] = useState(null);
  const [pass, setPass] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [fName, setFName] = useState(null);
  const [lName, setLName] = useState(null);
  const [terms, setTerms] = useState(false);
  const navigate = useNavigate();

  const [
    register,
    { data, isLoading, error: isRegisterError, isSuccess: isRegisterSuccess },
  ] = useRegisterMutation({});

  const formSubmitHandler = async (data) => {
    await register({ email, fName, lName, pass, terms, imageUrl });
  };

  useEffect(() => {
    if (isRegisterSuccess && data) {
      console.log(data);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    }
  }, [data, navigate, isRegisterSuccess]);

  return (
    <div
      className={`${styles.login} min-h-screen relative flex gap-32 justify-between`}
    >
      <div className="xlg:pl-40 lg:px-20 md:px-10 px-2 mt-10 md:mt-14 lg:mt-28  xl:mt-40 xxl:w-[40%] xl:w-[40%] xlg:w-[60%] w-full">
        <h1 className="xl:text-5xl text-4xl whitespace-nowrap font-bold xl:mb-4 lg:mb-0 text-center">
          Register Yourself
        </h1>
        <p className="text-center text-lg font-semibold xl:mb-8 lg:mb-6 mb-4">
          Begin your journey with us today
        </p>
        <div className={styles["form-con"]}>
          <Form onFinish={formSubmitHandler} layout="vertical">
            <div className="flex gap-4 justify-between">
              <Form.Item
                className="flex-1"
                name="fName"
                label="First Name"
                rules={[getRequrieRules("First Name")]}
              >
                <Input
                  onChange={(e) => setFName(e.target.value)}
                  placeholder="First Name"
                  size="large"
                  className="bottom-1  lg:py-3  sm:py-2 py-1 border-black"
                />
              </Form.Item>
              <Form.Item className="flex-1" name="lName" label="Last Name">
                <Input
                  onChange={(e) => setLName(e.target.value)}
                  placeholder="Last Name"
                  size="large"
                  className="bottom-1  lg:py-3  sm:py-2 py-1 border-black"
                />
              </Form.Item>
            </div>
            <Form.Item
              name="imageUrl"
              label="Image Url"
              rules={[getRequrieRules("Image Url")]}
            >
              <Input
                placeholder="Image Url"
                size="large"
                className="bottom-1  lg:py-3  sm:py-2 py-1 border-black"
                onChange={(e) => setImageUrl(e.target.value)}
                value={imageUrl}
              />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[getRequrieRules("email")]}
            >
              <Input
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                size="large"
                className="bottom-1  lg:py-3  sm:py-2 py-1 border-black"
              />
            </Form.Item>
            <Form.Item
              validateTrigger="onChange"
              validateFirst
              label="Password"
              name={"password"}
              rules={[getRequrieRules("Password")]}
            >
              <Input.Password
                onChange={(e) => setPass(e.target.value)}
                className="bottom-1 xl:py-3 lg:py-2 border-black"
                size="large"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item
              valuePropName="checked"
              name={"terms"}
              className="mb-4"
              rules={[
                {
                  required: true,
                  message: `Please agreed to our terms and conditions to proceed`,
                },
              ]}
            >
              <Checkbox
                onChange={(v) => setTerms(v.target.checked)}
                style={{ color: "white" }}
              >
                I read and agree all statements in Terms and Conditions
              </Checkbox>
            </Form.Item>
            <Button htmlType="submit">Sign in</Button>
          </Form>
        </div>
        <div className="flex gap-8 justify-center mt-10">
          <p className="text-base text-gray-500 font-bold">
            Already have an account?
          </p>
          <Link to={"/"}>
            <p className="font-bold text-blueLight">SIGN IN</p>
          </Link>
        </div>
      </div>
      <div
        className={`${styles["logo-con"]} xlg:flex  hidden align-middle xxl:pt-0 md:pt-6 `}
      >
        <img src={logo} className="pr-9" alt="landing page " />
      </div>
      <div
        className={
          "xlg:block hidden absolute xxl:top-3 xl:top-0 lg:top-1 xxl:left-[45%] xl:left-[37%] lg:left-[40%]"
        }
      >
        <img src={spaceship} alt="spaceship" />
      </div>
    </div>
  );
}
