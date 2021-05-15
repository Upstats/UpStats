import Head from "next/head";
import {
  Box,
  Center,
  VStack,
  Text,
  Flex,
  Spacer,
  Input,
  FormControl,
  FormLabel,
  useToast,
} from "@chakra-ui/react";
import http from "../services/httpService";

import { CheckCircleIcon, WarningIcon, EmailIcon } from "@chakra-ui/icons";
import { useState } from "react";
import db from "../utils/db";
import System from "../models/system";
import Config from "../models/config";

export default function Home({ status, systems, config }) {
  console.log(status);
  console.log(systems);
  const [email, setEmail] = useState("");
  const toast = useToast();
  const handleSubmit = async (email) => {
    try {
      await http.post("/subs", { email: email });
      toast({
        title: "Success",
        description: "Successfully Subscribed ",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
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
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <title>UP Stats</title>
        <link rel="stylesheet" href="/main.css" />
      </Head>
      <main className="root">
        <header className="top-0">
          <nav>
            <div className="content-center p-4">
              {/* Nav Bar Logo */}
              <img className="nav-brand" src="assets/img/logo.jpg" />
            </div>
          </nav>
        </header>
        <section>
          <Center mt="5">
            <Box bg="blue" w="90%" p={4} color="white" borderRadius="md">
              {status.operational
                ? "All Systems Operational"
                : `${status.outageCount} Systems Outage`}
            </Box>
          </Center>
          <br />
          <VStack>
            {systems.map((system) => (
              <Flex
                id={system._id}
                borderRadius="md"
                boxShadow="lg"
                w="90%"
                p={3}
                bg="white"
              >
                <Text pl={3}>{system.name}</Text>
                <Spacer />
                {system.status === "up" && (
                  <CheckCircleIcon mr={5} mt="1" color="green" />
                )}

                {system.status === "down" && (
                  <WarningIcon mr={5} mt="1" color="red" />
                )}
              </Flex>
            ))}
          </VStack>
        </section>
        {config.mailing ? (
          <VStack p={10} m={10} borderWidth={1} borderRadius="lg">
            <h1 className="font-sans text-xl">Want to see Back in action?</h1>
            <p className="font-sans">
              Subscribe via Email and <br />
              Get notified about the System Status
            </p>
            <Center>
              <FormControl id="email" width="90%">
                <FormLabel>Email address</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Box
                  width="8em"
                  mt="3"
                  height="3em"
                  border="1px"
                  color="white"
                  bg="blue"
                  borderRadius="lg"
                  p="3"
                  onClick={() => handleSubmit(email)}
                >
                  <EmailIcon mr={3} />
                  Subscribe
                </Box>
              </FormControl>
            </Center>
          </VStack>
        ) : (
          ""
        )}
        <footer className="px-4 py-16 mx-auto max-w-7xl">
          <nav className="grid grid-cols-2 gap-12 mb-12 md:grid-cols-3 lg:grid-cols-5">
            <div>
              <p className="mb-4 text-sm font-medium text-primary">
                Handy Links
              </p>
              <a
                className="flex mb-3 text-sm font-medium text-gray-700 transition md:mb-2 hover:text-primary"
                href="https://github.com/ToolsHD/UPStats"
              >
                Opensource
              </a>
              <a
                className="flex mb-3 text-sm font-medium text-gray-700 transition md:mb-2 hover:text-primary"
                href="#"
              >
                Features
              </a>
              <a
                className="flex mb-3 text-sm font-medium text-gray-700 transition md:mb-2 hover:text-primary"
                href="#"
              >
                Pricing
              </a>
            </div>
          </nav>
          <div className="flex flex-col items-center justify-between md:flex-row">
            <a href="/" className="mb-4 md:mb-0">
              <img id="footer-img" src="assets/img/footer.jpg" />
              <span className="sr-only">UpStats</span>
            </a>
            <p className="text-sm text-center text-gray-600 md:text-left">
              © 2021 <a href="#">UP Stats</a>
            </p>
          </div>
        </footer>
        <div>
          <button onClick="topFunction()" id="scroll-to-top">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </button>
        </div>
      </main>
    </>
  );
}
export async function getStaticProps(context) {
  const getSystems = async () => {
    const result = await System.find().sort("name");
    return result.map((doc) => {
      const system = doc.toObject();

      system._id = system._id.toString();
      return system;
    });
  };

  const getStatus = async () => {
    let isOperational = false;
    let outageCount = 0;
    const systems = await System.find().lean();
    for (let system of systems) {
      isOperational = system.status === "up" ? true : false;
      if (!isOperational) outageCount += 1;
    }
    return {
      operational: isOperational,
      ...(!isOperational && { outageCount }),
    };
  };
  await db();
  const systems = await getSystems();
  const status = await getStatus();
  const config = await Config.findOne().lean();
  config._id = config._id.toString();

  if (!status && !systems) {
    return {
      notFound: true,
    };
  }

  return {
    props: { status: status, systems: systems, config: config },
    revalidate: 1,
  };
}
