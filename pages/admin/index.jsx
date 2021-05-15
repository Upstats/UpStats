import {
  Input,
  Alert,
  AlertIcon,
  Text,
  Stack,
  useToast,
  Radio,
  RadioGroup,
  Switch,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import http from "../../services/httpService";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { useFormik, Field, FormikProvider } from "formik";
import React from "react";
import { create } from "apisauce";
import Layout from "../../components/Layout";

export default function Dashboard() {
  const api = create({
    baseURL: "/api",
  });

  const toast = useToast();

  const router = useRouter();
  const [systems, setSystems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mailing, setMailing] = useState(false);

  const [currentEditSystem, setCurrentEditSystem] = useState({
    name: "",
    url: "",
  });
  const [subsCount, setSubsCount] = useState(0);
  const loadSystems = async () => {
    try {
      const { data } = await http.get("/systems");
      setSystems(data);
    } catch (e) {
      toast({
        title: "Error",
        description: "Error Loading Systems",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  const loadConfig = async () => {
    try {
      const { data } = await http.get("/config");
      setMailing(data.mailing);
    } catch (e) {
      console.log("Error Loading Config");
    }
  };
  const loadCount = async () => {
    try {
      const { data } = await http.get("/subs");

      setSubsCount(data.length);
    } catch (e) {
      toast({
        title: "Error",
        description: "Error Loading Subs Count",
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
    loadSystems();
  }, []);

  useEffect(() => {
    loadCount();
  }, []);
  useEffect(() => {
    loadConfig();
  }, []);
  const handleDelete = async (system) => {
    const originalSystems = systems;
    const newSystems = originalSystems.filter((s) => s._id !== system._id);

    setSystems(newSystems);
    try {
      await http.delete(`/systems/${system._id}`);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast({
          title: "Error",
          description: "System May be Already Deleted",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      setSystems(originalSystems);
    }
  };
  const handleAdd = async (system) => {
    try {
      const { data } = await api.post("/systems", system, {
        headers: localStorage.getItem("token"),
      });
      setSystems([...systems, data]);
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

  const formik = useFormik({
    initialValues: {
      name: "",
      url: "",
      type: "web",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      url: Yup.string().required("Required"),
      type: Yup.string(),
    }),
    onSubmit: (values) => {
      handleAdd(values);
      //alert(JSON.stringify(values, null, 2));
    },
  });
  const handleEdit = async () => {
    const originalSystems = systems;
    let newSystems = [...systems];
    const idx = newSystems.findIndex(
      (sys) => sys._id === currentEditSystem._id
    );
    newSystems[idx] = { ...currentEditSystem };

    setSystems(newSystems);
    try {
      await http.put(`/systems/${currentEditSystem._id}`, {
        name: currentEditSystem.name,
        url: currentEditSystem.url,
        type: currentEditSystem.type,
      });
      setCurrentEditSystem({ name: "", url: "" });
    } catch (ex) {
      toast({
        title: "Error",
        description: "Error Updating The System",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setSystems(originalSystems);
      setCurrentEditSystem({ name: "", url: "" });
    }
  };
  const handleChangeConfig = async () => {
    try {
      await http.put(`/config`, {
        mailing: mailing,
      });
    } catch (ex) {
      toast({
        title: "Error",
        description: "Error Updating The Config",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  return (
    <FormikProvider value={formik}>
      <>
        <Layout>
          {isLoggedIn ? (
            <>
              <div className=" mt-12  mx-auto">
                <div>
                  <div className="m-auto p-4 md:w-1/4 sm:w-1/2 w-full">
                    <div className="p-12 py-6 rounded-lg">
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        className="w-12 h-12 inline-block users-status"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                        <circle cx={9} cy={7} r={4} />
                        <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
                      </svg>
                      <h2 className="title-font font-medium text-3xl">
                        {subsCount}
                      </h2>
                      <p className="leading-relaxed ">Users Subscribed</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* CRUD Status List */}
              <div className="w-full max-w-sm overflow-hidden rounded-lg items-center mx-auto">
                <h3 className="text-2xl font-black text-black">
                  Add New System
                </h3>
                <form onSubmit={formik.handleSubmit} className="p-3">
                  <Stack>
                    <Text>System Title</Text>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                      placeholder="Enter here"
                      isInvalid={
                        formik.touched.name && formik.errors.name ? true : false
                      }
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <Alert status="error">
                        <AlertIcon />
                        {formik.errors.name}
                      </Alert>
                    ) : null}
                  </Stack>
                  <Stack mt={2}>
                    <Text>System URL</Text>
                    <Input
                      placeholder="Enter here"
                      id="url"
                      name="url"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.url}
                      isInvalid={
                        formik.touched.url && formik.errors.url ? true : false
                      }
                    />
                    {formik.touched.url && formik.errors.url ? (
                      <Alert status="error">
                        <AlertIcon />
                        {formik.errors.url}
                      </Alert>
                    ) : null}
                  </Stack>
                  {/* Select System Type */}
                  <RadioGroup>
                    <Stack mt={5}>
                      <Field as={Radio} type="radio" name="type" value="web">
                        Web
                      </Field>
                      <Field
                        as={Radio}
                        type="radio"
                        name="type"
                        value="telegram"
                      >
                        Telegram Bot
                      </Field>
                    </Stack>
                  </RadioGroup>
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
                {/* Status Page List */}
                {/* Show Sites here */}
                {systems.map((system) => (
                  <div key={system._id} className="status-items-manage">
                    <div className="items">
                      <span className="site-title">{system?.name}</span>
                      <div className="i">
                        <EditIcon
                          mr="2"
                          onClick={() => {
                            setCurrentEditSystem(system);
                          }}
                        />
                        <DeleteIcon
                          color="red"
                          m="2"
                          onClick={() => {
                            handleDelete(system);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {/* End */}
                {currentEditSystem.name ? (
                  <div className="mt-4">
                    <Stack>
                      <h3 className="text-2xl font-black text-black">
                        Edit System
                      </h3>
                      <Stack>
                        <Text>System Title</Text>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={currentEditSystem.name}
                          onChange={(e) => {
                            setCurrentEditSystem({
                              ...currentEditSystem,
                              name: e.target.value,
                            });
                          }}
                          placeholder="Enter here"
                        />
                      </Stack>
                      <Stack mt={2}>
                        <Text>System URL</Text>
                        <Input
                          placeholder="Enter here"
                          id="url"
                          name="url"
                          type="text"
                          value={currentEditSystem.url}
                          onChange={(e) =>
                            setCurrentEditSystem({
                              ...currentEditSystem,
                              url: e.target.value,
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
                <Stack mt={12}>
                  <h3 className="text-xl font-black text-bold">Configs</h3>
                  <p className="text-md font-black text-bold">Mailing</p>
                  <Switch
                    size="lg"
                    isChecked={mailing}
                    onChange={(e) => setMailing(e.target.checked)}
                  />
                  <div className="mt-4">
                    <button
                      onClick={handleChangeConfig}
                      style={{ backgroundColor: "#3747D4" }}
                      className="px-4 py-2 text-white rounded hover:bg-black focus:outline-none"
                    >
                      Done
                    </button>
                  </div>
                </Stack>
              </div>
            </>
          ) : (
            ""
          )}

          {/* Total No. of Users Subscribed */}
        </Layout>
      </>
    </FormikProvider>
  );
}
