import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";
import spaceship from "../assets/login-spaceship.svg";
import logo from "../assets/logo.svg";
import styles from "./login.module.scss";
import { getRequrieRules, getValidateEmailRules } from "../../helpers/forms";
import Button from "../../components/button/button";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/authSlice";
import { toast } from "react-toastify";

export function Login() {
  const [email, setEmail] = useState(null);
  const [password, setPass] = useState(null);
  const navigate = useNavigate();

  const [
    login,
    { data, isLoading, error: loginError, isSuccess: isLoginSuccess },
  ] = useLoginMutation({});

  const handleSubmit = async (e) => {
    //e.preventDefault();
    try {
      if (email && password) {
        await login({ email, password });
      }
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (isLoginSuccess && data) {
      console.log(data);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    }
  }, [isLoginSuccess, data, navigate]);

  return (
    <div
      className={`${styles.login} min-h-screen relative flex gap-32 justify-between`}
    >
      <div className=" xlg:pl-60 lg:px-20 md:px-10 px-2 mt-10 md:mt-14 lg:mt-28  xl:mt-40 xxl:w-[40%] xl:w-[45%] xlg:w-[50%] w-full ">
        <h1 className="xl:text-5xl text-4xl whitespace-nowrap lg:text-4xl font-bold xl:mb-4 lg:mb-2  text-center">
          Welcome Back
        </h1>
        <p className="text-center text-lg font-semibold mb-2 whitespace-nowrap">
          Sign in to continue your progress
        </p>
        <div className={styles["form-con"]}>
          <Form onFinish={handleSubmit} layout="vertical">
            <Form.Item
              name="email"
              label="Email"
              rules={[getRequrieRules("email"), getValidateEmailRules()]}
            >
              <Input
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
                size="large"
                className="bottom-1 lg:py-3  sm:py-2 py-1 border-black"
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
                className="bottom-1 lg:py-3 sm:py-2 py-1 border-black"
                size="large"
                placeholder="Password"
              />
            </Form.Item>
            <p className="text-end mb-4 text-base text-blueLight font-medium ">
              Forgot Password
            </p>
            <Button htmlType="submit">Sign in</Button>
          </Form>
        </div>
        <div className="flex gap-8 justify-center mt-10">
          <p className="text-base text-gray-500 font-bold">
            Not our Member yet?
          </p>
          <Link to={"/register"}>
            <p className="font-bold text-blueLight">SIGN UP</p>
          </Link>
        </div>
      </div>
      <div className={`${styles["logo-con"]} xlg:flex  hidden align-middle`}>
        <img src={logo} className="pr-9" alt="landing page " />
      </div>
      <div
        className={`absolute xlg:block hidden  bottom-0 xxl:left-[42%] xl:left-[33%] lg:left-[37%]`}
      >
        <img src={spaceship} alt="spaceship" />
      </div>
    </div>
  );
}
