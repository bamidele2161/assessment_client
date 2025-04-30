import { toast } from "sonner";

const API_URL = import.meta.env.NEXT_PUBLIC_API_URL;
console.log(API_URL);
export const graphqlClient = async <T>(
  query: string,
  variables?: Record<string, any>,
  token?: string | null
): Promise<T> => {
  try {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({ query, variables }),
    });
    console.log(response);
    const result = await response.json();

    if (result.errors) {
      const errorMessage =
        result.errors[0].message || "GraphQL operation failed";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    return result.data;
  } catch (error: any) {
    toast.error(error.message || "An error occurred");
    throw error;
  }
};
