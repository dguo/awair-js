import axios, {AxiosInstance, AxiosRequestConfig} from "axios";

import {
    AirData,
    Device,
    DeviceDisplayMode,
    DeviceKnockingMode,
    DeviceLEDMode,
    Options,
    SetDeviceDisplayModeOptions,
    SetDeviceKnockingModeOptions,
    SetDeviceLEDModeOptions,
    SetDeviceLocationOptions,
    SetDeviceNameOptions,
    SetDevicePreferenceOptions,
    SetDeviceRoomTypeOptions,
    SetDeviceSpaceTypeOptions,
    Usage,
    User,
} from "./types";

export {
    AirData,
    Device,
    DeviceBrightness,
    DeviceClockMode,
    DeviceDisplayMode,
    DeviceKnockingMode,
    DeviceLEDMode,
    DevicePreference,
    DeviceRoomType,
    DeviceSpaceType,
    DeviceTemperatureUnit,
    Options,
    Permission,
    SensorIndexComp,
    SensorReadingComp,
    SensorReading,
    SensorIndex,
    SetDeviceDisplayModeOptions,
    SetDeviceKnockingModeOptions,
    SetDeviceLEDModeOptions,
    SetDeviceLocationOptions,
    SetDeviceNameOptions,
    SetDevicePreferenceOptions,
    SetDeviceRoomTypeOptions,
    SetDeviceSpaceTypeOptions,
    Usage,
    UsageScope,
    User,
} from "./types";

export class Awair {
    #axiosInstance: AxiosInstance;
    #bearerToken: string | null;
    deviceType: string | null;
    deviceId: number | null;

    constructor(options?: Options) {
        this.#axiosInstance = axios.create({
            baseURL: "https://developer-apis.awair.is/v1/",
            ...this.getAxiosConfig(options),
        });

        this.deviceType = options?.deviceType ?? null;
        this.deviceId = options?.deviceId ?? null;
        this.#bearerToken = options?.bearerToken ?? null;
    }

    private getAxiosConfig(options?: Options): AxiosRequestConfig | undefined {
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

    private getDevice(options?: Options) {
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

    async getDevices(options?: Options): Promise<Device[]> {
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

    async getDeviceAPIUsage(options?: Options): Promise<Usage[]> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `users/self/devices/${device.type}/${device.id}/api-usages`,
            axiosConfig
        );
        return response.data.usages;
    }

    async getLatestAirData(options?: Options): Promise<AirData | null> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `users/self/devices/${device.type}/${device.id}/air-data/latest`,
            axiosConfig
        );
        return response.data.data?.[0] ?? null;
    }

    async getRawAirData(options?: Options): Promise<AirData[]> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `users/self/devices/${device.type}/${device.id}/air-data/raw`,
            axiosConfig
        );
        return response.data;
    }

    async get5MinuteAverageAirData(options?: Options): Promise<AirData[]> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `users/self/devices/${device.type}/${device.id}/air-data/5-min-avg`,
            axiosConfig
        );
        return response.data;
    }

    async get15MinuteAverageAirData(options?: Options): Promise<AirData[]> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `users/self/devices/${device.type}/${device.id}/air-data/15-min-avg`,
            axiosConfig
        );
        return response.data;
    }

    async getDeviceDisplayMode(options?: Options): Promise<DeviceDisplayMode> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `devices/${device.type}/${device.id}/display`,
            axiosConfig
        );
        return response.data.mode;
    }

    async setDeviceDisplayMode(
        options: SetDeviceDisplayModeOptions
    ): Promise<void> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        await this.#axiosInstance.put(
            `devices/${device.type}/${device.id}/display`,
            {
                mode: options.mode,
                clock_mode: options.clockMode,
                brightness: options.brightness,
                temp_unit: options.temperatureUnit,
            },
            axiosConfig
        );
    }

    async getDeviceKnockingMode(
        options?: Options
    ): Promise<DeviceKnockingMode> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `devices/${device.type}/${device.id}/knocking`,
            axiosConfig
        );
        return response.data.mode;
    }

    async setDeviceKnockingMode(
        options: SetDeviceKnockingModeOptions
    ): Promise<void> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        await this.#axiosInstance.put(
            `devices/${device.type}/${device.id}/knocking`,
            {
                mode: options.mode,
            },
            axiosConfig
        );
    }

    async getDeviceLEDMode(
        options?: Options
    ): Promise<{mode: DeviceLEDMode; brightness?: number}> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `devices/${device.type}/${device.id}/led`,
            axiosConfig
        );
        return response.data;
    }

    async setDeviceLEDMode(options: SetDeviceLEDModeOptions): Promise<void> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        await this.#axiosInstance.put(
            `devices/${device.type}/${device.id}/led`,
            {
                mode: options.mode,
            },
            axiosConfig
        );
    }

    async setDeviceLocation(options: SetDeviceLocationOptions): Promise<void> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        await this.#axiosInstance.put(
            `devices/${device.type}/${device.id}/location`,
            {
                latitude: options.latitude,
                longitude: options.longitude,
            },
            axiosConfig
        );
    }

    async setDeviceName(options: SetDeviceNameOptions): Promise<void> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        await this.#axiosInstance.put(
            `devices/${device.type}/${device.id}/name`,
            {
                name: options.name,
            },
            axiosConfig
        );
    }

    async setDevicePreference(
        options: SetDevicePreferenceOptions
    ): Promise<void> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        await this.#axiosInstance.put(
            `devices/${device.type}/${device.id}/preference`,
            {
                pref: options.preference,
            },
            axiosConfig
        );
    }

    async setDeviceRoomType(options: SetDeviceRoomTypeOptions): Promise<void> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        await this.#axiosInstance.put(
            `devices/${device.type}/${device.id}/room`,
            {
                room_type: options.roomType,
            },
            axiosConfig
        );
    }

    async setDeviceSpaceType(
        options: SetDeviceSpaceTypeOptions
    ): Promise<void> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        await this.#axiosInstance.put(
            `devices/${device.type}/${device.id}/space`,
            {
                space_type: options.spaceType,
            },
            axiosConfig
        );
    }

    async getDevicePowerStatus(
        options?: Options
    ): Promise<{percentage: number; plugged: boolean; timestamp: string}> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `devices/${device.type}/${device.id}/power-status`,
            axiosConfig
        );
        return response.data;
    }

    async getDeviceTimeZone(options?: Options): Promise<string> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);
        const response = await this.#axiosInstance.get(
            `devices/${device.type}/${device.id}/timezone`,
            axiosConfig
        );
        return response.data.timezone;
    }
}
