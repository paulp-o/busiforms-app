import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export const getFormsQueryKey = (userId: string) => ["forms", userId];

export const fetchForms = async (userId: string) => {
  console.log("fetching forms:", userId);

  // simulate 1 second delay
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await axios.get(`http://localhost:3001/api/forms/by-user/${userId}`);
  if (response.status !== 200) throw new Error("Failed to fetch forms");
  // console.log("fetched forms:", userId);
  return response.data;
};

export const getUserDetailsQueryKey = (userId: string) => ["userDetails", userId];

export const fetchUserDetails = async (userId: string) => {
  console.log("fetching user details:", userId);
  // simulate 1 second delay
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  const response = await axios.get(`http://localhost:3001/api/users/${userId}`);
  if (response.status !== 200) throw new Error("Failed to fetch user details");
  console.log("fetched user details:", userId);
  return response.data;
};

export const updateUserDetails = async (userId: string, userDetails: { name?: string; phone?: string; nickname?: string }) => {
  // simulate 1 second delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  console.log("updating:", userDetails);
  const response = await axios.patch(`http://localhost:3001/api/users/${userId}`, {
    phone: userDetails.phone,
    name: userDetails.name,
    nickname: userDetails.nickname,
  });
  if (response.status !== 200) throw new Error("Failed to update user phone");
  console.log("updated user phone:", userId);

  console.log("updated user details:", userId);
  return { name: userDetails.name, phone: userDetails.phone };
};
