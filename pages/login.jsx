import React from "react";
import http from "../services/httpService";
const tokenKey = "token";
import { useEffect } from "react";
import {
  Input,
  useToast,
  Text,
  Stack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";

const Login = (props) => {
  const toast = useToast();
  const login = async (email, password) => {
    try {
      const { data: jwt } = await http.post("/auth", { email, password });
      window.localStorage.setItem(tokenKey, jwt);
      window.location = "/admin";
      toast({
        title: "Success",
        description: "Redirecting...",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (ex) {
      toast({
        title: "Error",
        description: "Cannot Login to Account",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    const token = window.localStorage.getItem("token");

    if (token) {
      window.location = "/admin";
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email().label("Email").required(),
      password: Yup.string().label("Password").required(),
    }),
    onSubmit: (values) => {
      login(values.email, values.password);

      //alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <div className="w-full max-w-sm mx-auto overflow-hidden rounded-lg">
      <div className="px-6 py-4">
        <h2 className="mt-1 text-3xl font-medium text-center">Welcome Back</h2>
        <p className="mt-1 text-center">Login to continue</p>
        <form onSubmit={formik.handleSubmit}>
          <Stack>
            <Text>Email</Text>
            <Input
              id="email"
              name="email"
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Enter here"
              isInvalid={
                formik.touched.email && formik.errors.email ? true : false
              }
            />
            {formik.touched.email && formik.errors.email ? (
              <Alert status="error">
                <AlertIcon />
                {formik.errors.email}
              </Alert>
            ) : null}
          </Stack>
          <Stack>
            <Text>Password</Text>
            <Input
              id="password"
              name="password"
              type="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder="Enter here"
              isInvalid={
                formik.touched.password && formik.errors.password ? true : false
              }
            />
            {formik.touched.password && formik.errors.password ? (
              <Alert status="error">
                <AlertIcon />
                {formik.errors.password}
              </Alert>
            ) : null}
          </Stack>
          {/* Login */}
          <div className="flex items-center  mt-4">
            <button
              style={{ backgroundColor: "#3747D4" }}
              className="px-4 py-2 text-white rounded hover:bg-black focus:outline-none"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
