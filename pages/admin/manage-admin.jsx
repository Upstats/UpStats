import Layout from "../../components/Layout";
import {
  Input,
  Alert,
  AlertIcon,
  Text,
  Stack,
  useToast,
} from "@chakra-ui/react";

import { useEffect, useState } from "react";

import http from "../../services/httpService";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { useFormik, FormikProvider } from "formik";
import { create } from "apisauce";

const Test = (props) => {
  const api = create({
    baseURL: `/api`,
  });
  const toast = useToast();

  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [currentEditUser, setCurrentEditUser] = useState({
    email: "",
  });
  const loadUsers = async () => {
    try {
      const { data } = await http.get("/users");
      setUsers(data);
    } catch (e) {
      toast({
        title: "Error",
        description: "Error Loading Users",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  useEffect(() => {
    const token = window.localStorage.getItem("token");
    http.setJwt(token);

    if (!token) {
      setIsLoggedIn(false);
      toast({
        title: "Error",
        description: "Redirecting to Login Page",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      router.push("/login");
    } else setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (user) => {
    const originalUsers = users;
    const newUsers = originalUsers.filter((s) => s._id !== user._id);

    setUsers(newUsers);
    try {
      await http.delete(`/users/${user._id}`);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast({
          title: "Error",
          description: "User May be Already Deleted",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      setUsers(originalUsers);
    }
  };
  const handleAdd = async (user) => {
    try {
      const { data } = await api.post("/users", user, {
        headers: localStorage.getItem("token"),
      });
      setUsers([...users, data]);
    } catch (ex) {
      toast({
        title: "Error",
        description: "Submit Unsuccessful",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleEdit = async () => {
    const originalUsers = users;
    let newUsers = [...users];
    const idx = newUsers.findIndex((sys) => sys._id === currentEditUser._id);
    newUsers[idx] = { ...currentEditUser };

    setUsers(newUsers);
    try {
      await http.put(`/users/${currentEditUser._id}`, {
        email: currentEditUser.email,
      });
      setCurrentEditUser({ email: "" });
    } catch (ex) {
      toast({
        title: "Error",
        description: "Error Updating The User",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setUsers(originalUsers);
      setCurrentEditUser({ email: "" });
    }
  };
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().label("Email").email().required("Required"),
    }),
    onSubmit: (values) => {
      handleAdd(values);
    },
  });
  return (
    <FormikProvider value={formik}>
      <Layout>
        <>
          {isLoggedIn ? (
            <>
              {/* CRUD Status List */}
              <div className="w-full max-w-sm overflow-hidden rounded-lg items-center mx-auto">
                <h3 className="text-2xl font-black text-black">New Admin</h3>
                <form onSubmit={formik.handleSubmit} className="p-3">
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
                        formik.touched.email && formik.errors.email
                          ? true
                          : false
                      }
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <Alert status="error">
                        <AlertIcon />
                        {formik.errors.email}
                      </Alert>
                    ) : null}
                  </Stack>
                  {/* Add */}
                  <div className="mt-4">
                    <button
                      style={{ backgroundColor: "#3747D4" }}
                      className="px-4 py-2 text-white rounded hover:bg-black focus:outline-none"
                      type="submit"
                    >
                      Add
                    </button>
                  </div>
                </form>
                {users.map((user) => (
                  <div key={user._id} className="status-items-manage">
                    <div className="items">
                      <span className="site-title">{user.name}</span>
                      <div className="i">
                        <EditIcon
                          mr="2"
                          onClick={() => {
                            setCurrentEditUser(user);
                          }}
                        />
                        <DeleteIcon
                          color="red"
                          m="2"
                          onClick={() => {
                            handleDelete(user);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {/* End */}
                {currentEditUser.email ? (
                  <div className="mt-4">
                    <Stack>
                      <h3 className="text-2xl font-black text-black">
                        Edit User
                      </h3>
                      <Stack mt={2}>
                        <Text>Email</Text>
                        <Input
                          placeholder="Enter here"
                          id="email"
                          name="email"
                          type="text"
                          value={currentEditUser.email}
                          onChange={(e) =>
                            setCurrentEditUser({
                              ...currentEditUser,
                              email: e.target.value,
                            })
                          }
                        />
                      </Stack>
                    </Stack>
                    {/* Add */}
                    <div className="mt-4">
                      <button
                        onClick={handleEdit}
                        style={{ backgroundColor: "#3747D4" }}
                        className="px-4 py-2 text-white rounded hover:bg-black focus:outline-none"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </>
          ) : (
            ""
          )}
        </>
      </Layout>
    </FormikProvider>
  );
};

export default Test;
