import axios, {AxiosInstance, AxiosRequestConfig} from "axios";

export interface Device {
    name: string;
    macAddress: string;
    latitude: number;
    preference: string;
    timezone: string;
    roomType: string;
    deviceType: string;
    longitude: number;
    spaceType: string;
    deviceUUID: string;
    deviceId: number;
    locationName: string;
}

export interface Usage {
    scope: string;
    usage: number;
}

export interface Permission {
    scope: string;
    usage: number;
}

export interface User {
    usages: Usage[];
    tier: string;
    email: string;
    dobYear?: number;
    permissions: Permission[];
    sex: string;
    lastName: string;
    firstName: string;
    id: string;
}

export interface SensorReading {
    comp: string;
    value: number;
}

export interface SensorIndex {
    comp: string;
    value: number;
}

export interface AirData {
    timestamp: string;
    score: number;
    sensors: SensorReading[];
    indices: SensorIndex[];
}

export interface BaseOptions {
    deviceType?: string;
    deviceId?: number;
    axiosConfig?: AxiosRequestConfig;
    bearerToken?: string;
}

export class Awair {
    #axiosInstance: AxiosInstance;
    #bearerToken: string | null;
    deviceType: string | null;
    deviceId: number | null;

    constructor(options?: BaseOptions) {
        this.#axiosInstance = axios.create({
            baseURL: "https://developer-apis.awair.is/v1/",
            ...this.getAxiosConfig(options),
        });

        this.deviceType = options?.deviceType ?? null;
        this.deviceId = options?.deviceId ?? null;
        this.#bearerToken = options?.bearerToken ?? null;
    }

    async getDevices(options?: BaseOptions): Promise<Device[]> {
        const axiosConfig = this.getAxiosConfig(options);
        const response = await this.#axiosInstance.get(
            "users/self/devices",
            axiosConfig
        );
        return response.data.devices;
    }

    async getUser(): Promise<User> {
        const response = await this.#axiosInstance.get("users/self");
        return response.data;
    }

    private getAxiosConfig(
        options?: BaseOptions
    ): AxiosRequestConfig | undefined {
        if (!options) {
            return;
        }

        const bearerToken = options?.bearerToken ?? this.#bearerToken;
        if (!bearerToken) {
            return options?.axiosConfig;
        }

        const axiosConfig = {...options.axiosConfig};
        if (options.bearerToken) {
            if (axiosConfig.headers) {
                if (typeof axiosConfig.headers === "object") {
                    axiosConfig.headers.Authorization = `Bearer ${options.bearerToken}`;
                } else {
                    throw new Error("Headers must be an object");
                }
            } else {
                axiosConfig.headers = {
                    Authorization: `Bearer ${options.bearerToken}`,
                };
            }
        }

        return axiosConfig;
    }

    private getDevice(options?: BaseOptions) {
        const deviceType = options?.deviceType ?? this.deviceType;
        if (!deviceType) {
            throw new Error("Missing device type");
        }
        const deviceId = options?.deviceId ?? this.deviceId;
        if (!deviceId) {
            throw new Error("Missing device id");
        }

        return {
            id: deviceId,
            type: deviceType,
        };
    }

    async getDeviceAPIUsage(options?: BaseOptions): Promise<Usage[]> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `users/self/devices/${device.type}/${device.id}/api-usages`,
            axiosConfig
        );
        return response.data.usages;
    }

    async getLatestAirData(options?: BaseOptions): Promise<AirData | null> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `users/self/devices/${device.type}/${device.id}/air-data/latest`,
            axiosConfig
        );
        return response.data.data?.[0] ?? null;
    }

    async getRawAirData(options?: BaseOptions): Promise<AirData[]> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `users/self/devices/${device.type}/${device.id}/air-data/raw`,
            axiosConfig
        );
        return response.data;
    }

    async get5MinuteAverageAirData(options?: BaseOptions): Promise<AirData[]> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `users/self/devices/${device.type}/${device.id}/air-data/5-min-avg`,
            axiosConfig
        );
        return response.data;
    }

    async get15MinuteAverageAirData(options?: BaseOptions): Promise<AirData[]> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `users/self/devices/${device.type}/${device.id}/air-data/15-min-avg`,
            axiosConfig
        );
        return response.data;
    }

    async getDeviceDisplayMode(options?: BaseOptions): Promise<string> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `devices/${device.type}/${device.id}/display`,
            axiosConfig
        );
        return response.data.mode;
    }

    async getDeviceKnockingMode(options?: BaseOptions): Promise<string> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `devices/${device.type}/${device.id}/knocking`,
            axiosConfig
        );
        return response.data.mode;
    }

    async getDeviceLEDMode(
        options?: BaseOptions
    ): Promise<{mode: string; brightness?: number}> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `devices/${device.type}/${device.id}/led`,
            axiosConfig
        );
        return response.data;
    }

    async getDevicePowerStatus(
        options?: BaseOptions
    ): Promise<{percentage: number; plugged: boolean; timestamp: string}> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `devices/${device.type}/${device.id}/power-status`,
            axiosConfig
        );
        return response.data;
    }

    async getDeviceTimeZone(options?: BaseOptions): Promise<string> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `devices/${device.type}/${device.id}/timezone`,
            axiosConfig
        );
        return response.data.timezone;
    }
}
