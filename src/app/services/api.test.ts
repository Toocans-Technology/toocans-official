// src/app/services/api.test.ts
import type axiosType from 'axios'; // Import type for casting

// Define the type for the API module structure if possible, or use 'any'
// For simplicity, using 'any' here. Ideally, export types from 'api.ts'.
let googleAuthApi: any;
let mockedAxios: jest.Mocked<typeof axiosType>;

const mockedApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },
};

// Mock console.error once for all tests in this file
const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

beforeAll(() => {
  jest.doMock('axios', () => {
    const actualAxios = jest.requireActual('axios'); // Get actual axios for other properties if needed
    return {
      __esModule: true, // Important for ES modules
      default: {
        ...actualAxios, // Spread actual axios if you need other functionalities like isAxiosError
        create: jest.fn().mockReturnValue(mockedApiClient),
        // Add other static methods if they are directly used by api.ts, e.g., axios.get
        get: jest.fn(),
        post: jest.fn(),
      },
      // Also mock create at the root if api.ts might call axios.create directly
      // (not as axios.default.create)
      create: jest.fn().mockReturnValue(mockedApiClient),
    };
  });

  // Now that axios is mocked, require the modules.
  // The 'axios' require below will get our mocked version.
  mockedAxios = require('axios') as jest.Mocked<typeof axiosType>;
  // googleAuthApi will be initialized with the apiClient created by the mocked axios.create
  googleAuthApi = require('./api').googleAuthApi;
});

beforeEach(() => {
  // Clear call history for these mocks before each test
  mockedApiClient.get.mockClear();
  mockedApiClient.post.mockClear();

  // Clear the mock for axios.create itself.
  // It could be on mockedAxios.create or mockedAxios.default.create depending on the module type.
  if (mockedAxios.create && typeof mockedAxios.create.mockClear === 'function') {
    // DO NOT CLEAR CALLS: mockedAxios.create.mockClear();
    // Ensure it continues to return the mocked client if a test accidentally changed its behavior
    mockedAxios.create.mockReturnValue(mockedApiClient);
  }
  // Also handle the case where 'create' is on the default export (common for ES modules)
  const mockCreate = (mockedAxios as any).default?.create;
  if (mockCreate && typeof mockCreate.mockClear === 'function') {
    // DO NOT CLEAR CALLS: mockCreate.mockClear();
    // Ensure it continues to return the mocked client
    mockCreate.mockReturnValue(mockedApiClient);
  }
});

afterAll(() => {
  consoleErrorSpy.mockRestore(); // Restore console.error
  jest.resetModules(); // Resets the module registry - important for other test files
});

describe('googleAuthApi', () => {
  describe('generateGoogleAuth', () => {
    it('should call apiClient.get with the correct URL and params', async () => {
      const mockApiResponse = {
        data: {
          code: 200,
          data: { qrCodeUrl: 'testQrCodeUrl', secretKey: 'testSecretKey' },
          msg: 'Success',
        },
      };
      mockedApiClient.get.mockResolvedValue(mockApiResponse);

      const params = { tokenId: 'testTokenId' };
      await googleAuthApi.generateGoogleAuth(params);

      // Check that the create function (however it's accessed on the mock) was called.
      // Since apiClient is created at module load, this should be 1 for the whole suite.
      // We clear it in beforeEach, so it's 1 per test if api.ts was re-required (which it's not here).
      // Let's verify it was called at least once during setup.
      const createMock = (mockedAxios as any).default?.create || mockedAxios.create;
      expect(createMock).toHaveBeenCalledTimes(1);
      expect(mockedApiClient.get).toHaveBeenCalledWith('/user/generateGoogleAuth', { params });
    });

    it('should return the data from the response on success', async () => {
      const mockData = { qrCodeUrl: 'testQrCodeUrl', secretKey: 'testSecretKey' };
      const mockApiResponse = {
        data: { code: 200, data: mockData, msg: 'Success' },
      };
      mockedApiClient.get.mockResolvedValue(mockApiResponse);

      const result = await googleAuthApi.generateGoogleAuth();
      expect(result).toEqual(mockApiResponse.data);
    });

    it('should throw an error and log it if the API call fails', async () => {
      const errorMessage = 'Network Error';
      mockedApiClient.get.mockRejectedValue(new Error(errorMessage));

      await expect(googleAuthApi.generateGoogleAuth()).rejects.toThrow(errorMessage);
      expect(console.error).toHaveBeenCalledWith('Error generating Google Auth:', expect.any(Error));
    });
  });

  describe('verifyGoogleAuth', () => {
    it('should call apiClient.post with the correct URL and params', async () => {
      const mockApiResponse = {
        data: { code: 200, data: null, msg: 'Success' },
      };
      mockedApiClient.post.mockResolvedValue(mockApiResponse);

      const params = { code: '123456', secretKey: 'testSecretKey' };
      await googleAuthApi.verifyGoogleAuth(params);

      const createMock = (mockedAxios as any).default?.create || mockedAxios.create;
      expect(createMock).toHaveBeenCalledTimes(1);
      expect(mockedApiClient.post).toHaveBeenCalledWith('/user/verifyGoogleAuth', null, { params });
    });

    it('should return the data from the response on success', async () => {
      const mockResponseData = { code: 200, data: null, msg: 'Success' };
      const mockApiResponse = { data: mockResponseData };
      mockedApiClient.post.mockResolvedValue(mockApiResponse);

      const params = { code: '123456', secretKey: 'testSecretKey' };
      const result = await googleAuthApi.verifyGoogleAuth(params);

      expect(result).toEqual(mockResponseData);
    });

    it('should return error code and message if verification fails with a specific code', async () => {
      const mockResponseData = { code: 10009, msg: 'Invalid code' };
      const mockApiResponse = { data: mockResponseData };
      mockedApiClient.post.mockResolvedValue(mockApiResponse);

      const params = { code: 'wrongCode', secretKey: 'testSecretKey' };
      const result = await googleAuthApi.verifyGoogleAuth(params);

      expect(result).toEqual(mockResponseData);
    });

    it('should throw an error and log it if the API call fails', async () => {
      const errorMessage = 'Network Error';
      mockedApiClient.post.mockRejectedValue(new Error(errorMessage));

      const params = { code: '123456', secretKey: 'testSecretKey' };
      await expect(googleAuthApi.verifyGoogleAuth(params)).rejects.toThrow(errorMessage);
      expect(console.error).toHaveBeenCalledWith('Error verifying Google Auth:', expect.any(Error));
    });
  });
});
