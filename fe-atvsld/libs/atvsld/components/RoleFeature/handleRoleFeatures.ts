import { getRoles } from "../../services/api/roleApi";

export const fetchRoles = async () => {
  try {
    const response = await getRoles();

    if (!response.data) {
      throw new Error("No roles found");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
