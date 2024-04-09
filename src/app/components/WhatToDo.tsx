import {
  Box,
  Button,
  Flex,
  Heading,
  LinkBox,
  Select,
  Text,
  Wrap,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, Link as ReachLink } from "react-router-dom";
import { FirestoreContext } from "../firebase/Firestore";
import { iRetrievedPost } from "../utils/types";
import CardsDisplay from "./@Cards/CardsDisplay";

export default function WhatToDo() {
  const { retrievedPosts } = useContext(FirestoreContext);
  const navigate = useNavigate();
  const [inOut, setInOut] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [free, setFree] = useState<boolean>();
  const [underTwo, setUnderTwo] = useState<boolean>();
  const [postsArr, setPostsArr] = useState<iRetrievedPost[]>([]);
  const [recommendation, setRecommendation] = useState<iRetrievedPost>();

  const [bezirkeWithPosts, setBezirkeWithPosts] = useState<string[]>([]);
  const steps = useRef(1);
  useEffect(() => {
    if (!!retrievedPosts && !!retrievedPosts.length) {
      setBezirkeWithPosts((prev) => {
        let filtered: string[] = ["Select an option", "Anywhere in Hamburg"];
        retrievedPosts.forEach((bez, i) => {
          !!bez.data.bezirk &&
            !filtered.includes(bez.data.bezirk) &&
            filtered.push(bez.data.bezirk);
          if (i === retrievedPosts.length - 1) {
            filtered.push("Outside of Hamburg");
          }
        });
        setPostsArr([...retrievedPosts]);
        return filtered;
      });
    }
  }, [retrievedPosts]);

  useEffect(() => {
    if (!!inOut) {
      setPostsArr((posts) =>
        posts.filter((post) => post.categories.includes(inOut))
      );
      setInOut(undefined);
    }
    if (!!location) {
      setPostsArr((posts) =>
        posts.filter((post) =>
          location === "Anywhere in Hamburg"
            ? post.bezirk !== "Outside of Hamburg"
            : post.bezirk === location
        )
      );
      setLocation(undefined);
    }
    if (free !== undefined) {
      if (!!free) {
        setPostsArr((posts) =>
          posts.filter((post) => post.categories.includes("Kostenlos"))
        );
      }
      setFree(undefined);
    }
    if (underTwo !== undefined) {
      setRecommendation((post) => {
        const filtered = postsArr.filter((post) =>
          !!underTwo ? post.categories.includes("Under 2") : true
        );
        setPostsArr(filtered);
        return filtered[Math.floor(Math.random() * (filtered.length - 1))];
      });
    }
  }, [inOut, location, free, underTwo]);

  return (
    <Flex
      as="section"
      id="what-to-do-section"
      maxWidth={["90%", "500px", "800px"]}
      w={["90%", "90%", "80%", "80%"]}
      direction="column"
      align={"center"}
      borderRadius="2rem"
      boxShadow={"md"}
      my={6}
      backgroundColor={"hsl(11,76%,83%)"}
      color="#232323"
      padding={["1.5rem 0.5rem"]}
      position="relative"
    >
      <Heading color={"hsl(210, 20%, 55%)"} textAlign={"center"}>
        What to do?
      </Heading>
      {steps.current === 1 && (
        <Flex my={4} justify={"space-around"} width={"100%"}>
          <Button
            _active={{ boxShadow: "inner" }}
            _hover={{ borderColor: "hsl(210, 20%, 55%)" }}
            boxShadow={"lg"}
            w="120px"
            name="Indoor"
            onClick={(e) => {
              setInOut((e.target as HTMLButtonElement).name);
              steps.current = steps.current + 1;
            }}
          >
            Indoor
          </Button>
          <Button
            _active={{ boxShadow: "inner" }}
            _hover={{ borderColor: "hsl(210, 20%, 55%)" }}
            boxShadow={"lg"}
            w="120px"
            onClick={(e) => {
              setInOut((e.target as HTMLButtonElement).name);
              steps.current = steps.current + 1;
            }}
            name="Outdoor"
          >
            Outdoor
          </Button>
        </Flex>
      )}
      {steps.current === 2 && (
        <Flex my={4} justify={"space-around"} width={"80%"}>
          <Select
            bg="#fefefe"
            borderColor="hsl(11,76%,63%, 0.8)"
            _active={{
              borderColor: "hsl(11,76%,63%, 0.8)",
            }}
            _hover={{
              borderColor: "hsl(11,76%,63%, 0.8)",
            }}
            defaultValue="Select an option"
            _focusVisible={{ borderColor: "hsl(210, 20%, 55%)" }}
            onChange={(e) => {
              if (e.target.value !== "Select an option") {
                setLocation(e.target.value);
                steps.current = steps.current + 1;
              }
            }}
            // defaultValue={bezirkeWithPosts[0]}
            // placeholder="Woohoo! A new background color!"
          >
            {bezirkeWithPosts.map((bezirk) => (
              <option
                key={bezirk}
                style={{ backgroundColor: "hsl(11,76%,93%)", color: "#222" }}
                value={bezirk}
              >
                {bezirk}
              </option>
            ))}
          </Select>
        </Flex>
      )}
      {steps.current === 3 && (
        <Flex my={4} justify={"space-around"} width={"100%"}>
          <Button
            _active={{ boxShadow: "inner" }}
            _hover={{ borderColor: "hsl(210, 20%, 55%)" }}
            boxShadow={"lg"}
            w="120px"
            onClick={(e) => {
              setFree(true);
              steps.current = steps.current + 1;
            }}
            name="Free"
          >
            Free
          </Button>
          <Button
            _active={{ boxShadow: "inner" }}
            _hover={{ borderColor: "hsl(210, 20%, 55%)" }}
            boxShadow={"lg"}
            w="120px"
            onClick={(e) => {
              setFree(false);
              steps.current = steps.current + 1;
            }}
            name="egal"
          >
            {"I don’t mind"}
          </Button>
        </Flex>
      )}
      {steps.current === 4 && (
        <Flex direction={"column"} my={4} align={"center"} width={"100%"}>
          <Text>Is your child under 2 years old?</Text>
          <Flex my={4} justify={"space-around"} width={"100%"}>
            <Button
              _active={{ boxShadow: "inner" }}
              _hover={{ borderColor: "hsl(210, 20%, 55%)" }}
              boxShadow={"lg"}
              w="120px"
              onClick={(e) => {
                setUnderTwo(true);
                steps.current = steps.current + 1;
              }}
              name="Under 2"
            >
              Yes
            </Button>
            <Button
              _active={{ boxShadow: "inner" }}
              _hover={{ borderColor: "hsl(210, 20%, 55%)" }}
              boxShadow={"lg"}
              w="120px"
              onClick={(e) => {
                setUnderTwo(false);
                steps.current = steps.current + 1;
              }}
              name="Older"
            >
              No
            </Button>
          </Flex>
        </Flex>
      )}
      {steps.current === 5 && postsArr.length > 1 ? (
        <Flex
          direction="column"
          align="center"
          width={"100%"}
          my={2}
          borderRadius="4px"
          position="relative"
          p={2}
        >
          <Wrap direction={"row"} py={1} justify="center" spacing={[4, 4, 8]}>
            {postsArr.map((post, i) => (
              <LinkBox
                key={post.title + i}
                as={ReachLink}
                to={`posts/${post.id}`}
                cursor={"pointer"}
                width={["160px", "240px", "280px", "320px"]}
                height={["200px", "300px", "400px"]}
                mb={4}
                backgroundRepeat={"no-repeat"}
                backgroundImage={post.image![0]}
                backgroundPosition="center"
                backgroundSize={"auto 100%"}
                p="5"
                boxShadow={"md"}
                rounded="md"
                display={"flex"}
                alignItems="flex-end"
                _hover={{ boxShadow: "dark-lg", transform: "scale(1.01)" }}
              >
                <Heading
                  as={"h4"}
                  p={"0.5rem 1rem"}
                  borderRadius={4}
                  color="#fefefe"
                  backgroundColor="hsl(210, 20%, 55%, 80%)"
                  backdropBlur={"1px"}
                  fontSize={["1rem", "1.2rem", "1.5rem"]}
                >
                  {post.title}
                </Heading>
              </LinkBox>
            ))}
          </Wrap>
          <Button
            colorScheme={"blackAlpha"}
            mt={8}
            onClick={() => {
              steps.current = 1;
              setRecommendation(undefined);
              setPostsArr(retrievedPosts?.length ? [...retrievedPosts] : []);
              setUnderTwo(undefined);
            }}
          >
            Try again
          </Button>
        </Flex>
      ) : !!recommendation ? (
        <Flex
          direction="column"
          align="center"
          width={"100%"}
          my={2}
          borderRadius="4px"
          position="relative"
          p={2}
        >
          <LinkBox
            key={recommendation.data.title}
            as={ReachLink}
            to={`posts/${recommendation.id}`}
            cursor={"pointer"}
            width={["160px", "240px", "280px", "320px"]}
            height={["200px", "300px", "400px"]}
            mb={4}
            backgroundRepeat={"no-repeat"}
            backgroundImage={recommendation.data.image![0]}
            backgroundPosition="center"
            backgroundSize={"auto 100%"}
            p="5"
            boxShadow={"md"}
            rounded="md"
            display={"flex"}
            alignItems="flex-end"
            _hover={{ boxShadow: "dark-lg", transform: "scale(1.01)" }}
          >
            <Heading
              as={"h4"}
              p={"0.5rem 1rem"}
              borderRadius={4}
              color="#fefefe"
              backgroundColor="hsl(210, 20%, 55%, 80%)"
              backdropBlur={"1px"}
              fontSize={["1rem", "1.2rem", "1.5rem"]}
            >
              {recommendation.data.title}
            </Heading>
          </LinkBox>
          <Button
            colorScheme={"blackAlpha"}
            mt={8}
            onClick={() => {
              steps.current = 1;
              setRecommendation(undefined);
              setPostsArr(retrievedPosts?.length ? [...retrievedPosts] : []);
              setUnderTwo(undefined);
            }}
          >
            Try again
          </Button>{" "}
        </Flex>
      ) : (
        steps.current === 5 && (
          <Box>
            {" "}
            <Text>
              Unfortunately we didn{"'"}t find any posts with those choices.
            </Text>
            <Button
              onClick={() => {
                steps.current = 1;
                setRecommendation(undefined);
                setPostsArr(retrievedPosts?.length ? [...retrievedPosts] : []);
                setUnderTwo(undefined);
              }}
            >
              Try again
            </Button>
          </Box>
        )
      )}
    </Flex>
  );
}
