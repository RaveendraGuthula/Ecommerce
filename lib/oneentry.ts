import { defineOneEntry } from "oneentry"; // this function helps to create api client instance

import retrieveRefreshToken from "@/actions/auth/retrieveRefreshToken"; // this action retrieves the refresh token from the local storage
import storeRefreshToken from "@/actions/auth/storeRefreshToken"; // this action stores the refresh token in the local storage

export type ApiClientType = ReturnType<typeof defineOneEntry> | null; // define the type of the api client

let apiClient: ApiClientType = null; // initialize the api client as null;

async function setupApiclient(): Promise<ReturnType<typeof defineOneEntry>> {
  const apiUrl = process.env.ONEENTRY_PROJECT_URL;

  if (!apiUrl) {
    throw new Error(
      "ONEENTRY_PROJECT_URL is not defined in the environment variables"
    );
  }
  try {
    const refreshToken = await retrieveRefreshToken();
    // Create a new instance of the API client with the required configuration
    apiClient = defineOneEntry(apiUrl, {
      token: process.env.ONEENTRY_TOKEN, // Token for authentication  , this is generated in the OneEntry dashboard
      langCode: "en_US", // Language code for the API
      auth: {
        refreshToken: refreshToken || undefined,
        customAuth: false, //Disable custom authentication
        saveFunction: async (newToken: string) => {
          //Save the new refresh token when it is updated
          await storeRefreshToken(newToken);
        },
      },
    });
  } catch (error) {
    console.error("Error setting up API client:", error);
    throw error; // Re-throw the error to be handled by the caller
  }

  //if the API client is still not initialized, throw an error
  if (!apiClient) {
    throw new Error("Failed to initialize the API client");
  }

  //Return the initialized API client
  return apiClient;
}



export async function fetchApiclient():Promise<ReturnType<typeof defineOneEntry>> {
  //Check if the API client is already initialized

  if (!apiClient) {
    await setupApiclient(); // If not, set it up

  }

  // At this point,"apiClient" should not be null. If it is, throw an error.
  if (!apiClient) {
    throw new Error("Failed to initialize the API client");
  }

  //Return the initialized API client

  return apiClient;
}