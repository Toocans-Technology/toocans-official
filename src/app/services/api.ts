import axios from "axios";
import { Response as BalanceResponse, Request } from "../types/balance";
// Import the new Google Auth types
import { UserVerifyResponse } from "../../types/userVerify";
import {
  GenerateGoogleAuthRequest,
  GenerateGoogleAuthResponse,
  VerifyGoogleAuthParams,
  VerifyGoogleAuthResponse,
} from "../types/googleAuth";

// Balance record interfaces for transaction history
export enum BusinessType {
  Convert = "CONVERT",
  Deposit = "DEPOSIT",
  Internal = "INTERNAL",
  Invalid = "INVALID",
  Transfer = "TRANSFER",
  Withdraw = "WITHDRAW",
}

export interface BalanceRecordRequest {
  beginTime?: number;
  businessType?: BusinessType;
  endTime?: number;
  pageNo: number;
  pageSize: number;
  tokenId?: string;
  [property: string]: any;
}

export interface BalanceChangeRecord {
  accountId?: number;
  amount?: number;
  balanceId?: number;
  beforeAmount?: number;
  businessId?: number;
  businessType?: number;
  createDate?: number;
  id?: number;
  tokenId?: string;
  tokenName?: string;
  [property: string]: any;
}

export interface BalanceRecordResponse {
  code?: number;
  data?: BalanceChangeRecord[];
  msg?: string;
  [property: string]: any;
}

// Token configuration interfaces
export interface Token {
  tokenId?: string;
  icon?: string;
  tokenName?: string;
  tokenFullName?: string;
  marketPrice?: string;
  // Add other token properties as needed
  [key: string]: any;
}

export interface TokenResponse {
  code: number;
  data: Token[];
  msg: string;
  [key: string]: any;
}

export interface TokenRequest {
  tokenId?: string;
  [key: string]: any;
}

const BASE_URL = "https://dev-api.bdy.tech";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    // Only run this in browser environment
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      console.log("apiClient token:", token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const tokenConfigApi = {
  getAllTokens: async (): Promise<TokenResponse> => {
    try {
      const response = await apiClient.get("/baseConfig/allToken");
      return response.data;
    } catch (error) {
      console.error("Error fetching tokens:", error);
      throw error;
    }
  },
  getTokenById: async (tokenId: string): Promise<TokenResponse> => {
    try {
      const response = await apiClient.get("/baseConfig/allToken", {
        params: { tokenId },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching token ${tokenId}:`, error);
      throw error;
    }
  },
};

export const tokenApi = {
  getAllAssets: async (): Promise<BalanceResponse> => {
    try {
      const response = await apiClient.get("/balance/getAllAsset");
      return response.data;
    } catch (error) {
      console.error("Error fetching tokens:", error);
      throw error;
    }
  },
  getAllAsset: async (params?: Request): Promise<BalanceResponse> => {
    try {
      const response = await apiClient.get("/balance/getAllAsset", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching asset:", error);
      throw error;
    }
  },
  getTransactionHistory: async (params: BalanceRecordRequest): Promise<BalanceRecordResponse> => {
    try {
      const response = await apiClient.get<BalanceRecordResponse>("/balance/recordPage", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      throw error;
    }
  },
};

// User verification API methods
export const userApi = {
  getUserVerificationInfo: async (): Promise<UserVerifyResponse> => {
    try {
      const response = await apiClient.get<UserVerifyResponse>(
        "/userVerify/info"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching user verification info:", error);
      throw error;
    }
  },

  updateNickname: async (
    nickname: string
  ): Promise<{
    code: number;
    data: boolean;
    msg: string;
    [property: string]: any;
  }> => {
    try {
      const response = await apiClient.post(
        `/user/updateNickname?nickname=${nickname}`
      );
      return response.data;
    } catch (error) {
      console.error("Error updating nickname:", error);
      throw error;
    }
  },

  unbindGoogleAuth: async (
    code: string
  ): Promise<{
    code: number;
    data?: { [key: string]: any };
    msg?: string;
    [property: string]: any;
  }> => {
    try {
      const response = await apiClient.post(
        '/user/unbindGoogleAuth',
        { code }
      );
      return response.data;
    } catch (error: any) {
      console.error('Error unbinding Google Authenticator:', error);
      if (error.response?.data) {
        // Return the error response from the server
        return error.response.data;
      }
      // For network errors or other unexpected errors
      throw error;
    }
  },

  updateAvatar: async (
    file: File
  ): Promise<{
    code: number;
    data: string;
    msg: string;
    [key: string]: any;
  }> => {
    const formData = new FormData();
    formData.append("file", file);
    const access_token = localStorage.getItem("access_token");
    console.log("Authorization: access_token:", access_token);

    try {
      const response = await apiClient.post("/user/updateAvatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${access_token}`,
        },
        onUploadProgress: (progressEvent) => {
          // Progress can be handled via the returned promise if needed
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error updating avatar:", error);
      throw error;
    }
  },
};

// Google Auth API methods

export const googleAuthApi = {
  generateGoogleAuth: async (
    params?: GenerateGoogleAuthRequest
  ): Promise<GenerateGoogleAuthResponse> => {
    try {
      const response = await apiClient.get("/user/generateGoogleAuth", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error generating Google Auth:", error);
      throw error;
    }
  },
  verifyGoogleAuth: async (
    params: VerifyGoogleAuthParams
  ): Promise<VerifyGoogleAuthResponse> => {
    try {
      const response = await apiClient.post("/user/verifyGoogleAuth", null, {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Error verifying Google Auth:", error);
      throw error;
    }
  },
};
