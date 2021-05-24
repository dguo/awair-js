import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import rax from "retry-axios";

import {
    AirData,
    Device,
    DeviceDisplayMode,
    DeviceKnockingMode,
    DeviceLEDMode,
    DevicePowerStatus,
    GetAirDataOptions,
    GetLatestAirDataOptions,
    Options,
    SetDeviceDisplayModeOptions,
    SetDeviceKnockingModeOptions,
    SetDeviceLEDModeOptions,
    SetDeviceLocationOptions,
    SetDeviceNameOptions,
    SetDevicePreferenceOptions,
    SetDeviceRoomTypeOptions,
    SetDeviceSpaceTypeOptions,
    DeviceAPIUsage,
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
    DevicePowerStatus,
    DevicePreference,
    DeviceRoomType,
    DeviceSpaceType,
    DeviceTemperatureUnit,
    DeviceAPIUsage,
    DeviceAPIUsageScope,
    GetAirDataOptions,
    GetLatestAirDataOptions,
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
    User,
    UserAPIUsage,
    UserAPIUsageScope,
} from "./types";

import {
    MOCK_AIR_DATA,
    MOCK_DEVICE,
    MOCK_DEVICE_API_USAGES,
    MOCK_LED_MODE,
    MOCK_POWER_STATUS,
    MOCK_USER,
} from "./mocks";

export {
    MOCK_AIR_DATA,
    MOCK_DEVICE,
    MOCK_DEVICE_API_USAGES,
    MOCK_LED_MODE,
    MOCK_POWER_STATUS,
    MOCK_USER,
} from "./mocks";

export class Awair {
    #axiosInstance: AxiosInstance;
    #bearerToken: string | null;
    deviceType: string | null;
    deviceId: number | null;
    mockMode: boolean;

    constructor(options?: Options) {
        this.#axiosInstance = axios.create({
            baseURL: "https://developer-apis.awair.is/v1/",
            ...this.getAxiosConfig(options),
        });
        this.#axiosInstance.defaults.raxConfig = {
            instance: this.#axiosInstance,
        };
        rax.attach(this.#axiosInstance);

        this.#bearerToken = options?.bearerToken ?? null;
        this.deviceType = options?.deviceType ?? null;
        this.deviceId = options?.deviceId ?? null;
        this.mockMode = options?.mockMode ?? false;
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

    private getDevice(options?: Options): {id: number; type: string} {
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

    private useMocks(options?: Options): boolean {
        if (typeof options?.mockMode === "boolean") {
            return options.mockMode;
        }

        return this.mockMode;
    }

    async getDevices(options?: Options): Promise<Device[]> {
        const axiosConfig = this.getAxiosConfig(options);

        if (this.useMocks(options)) {
            return [MOCK_DEVICE];
        }

        const response = await this.#axiosInstance.get(
            "users/self/devices",
            axiosConfig
        );
        return response.data.devices;
    }

    async getUser(options?: Options): Promise<User> {
        const axiosConfig = this.getAxiosConfig(options);

        if (this.useMocks(options)) {
            return MOCK_USER;
        }

        const response = await this.#axiosInstance.get(
            "users/self",
            axiosConfig
        );
        return response.data;
    }

    async getDeviceAPIUsage(options?: Options): Promise<DeviceAPIUsage[]> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);

        if (this.useMocks(options)) {
            return MOCK_DEVICE_API_USAGES;
        }

        const response = await this.#axiosInstance.get(
            `users/self/devices/${device.type}/${device.id}/api-usages`,
            axiosConfig
        );
        return response.data.usages;
    }

    async getLatestAirData(
        options?: GetLatestAirDataOptions
    ): Promise<AirData | null> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);

        if (this.useMocks(options)) {
            return MOCK_AIR_DATA[0];
        }

        const response = await this.#axiosInstance.get(
            `users/self/devices/${device.type}/${device.id}/air-data/latest`,
            {
                ...axiosConfig,
                params: {
                    ...axiosConfig?.params,
                    fahrenheit: options?.fahrenheit,
                },
            }
        );
        return response.data.data?.[0] ?? null;
    }

    async getRawAirData(options?: GetAirDataOptions): Promise<AirData[]> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);

        if (this.useMocks(options)) {
            return MOCK_AIR_DATA;
        }

        const response = await this.#axiosInstance.get(
            `users/self/devices/${device.type}/${device.id}/air-data/raw`,
            {
                ...axiosConfig,
                params: {
                    ...axiosConfig?.params,
                    fahrenheit: options?.fahrenheit,
                    from: options?.from,
                    to: options?.to,
                    limit: options?.limit,
                    desc: options?.desc,
                },
            }
        );
        return response.data.data;
    }

    async get5MinuteAverageAirData(
        options?: GetAirDataOptions
    ): Promise<AirData[]> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);

        if (this.useMocks(options)) {
            return MOCK_AIR_DATA;
        }

        const response = await this.#axiosInstance.get(
            `users/self/devices/${device.type}/${device.id}/air-data/5-min-avg`,
            {
                ...axiosConfig,
                params: {
                    ...axiosConfig?.params,
                    fahrenheit: options?.fahrenheit,
                    from: options?.from,
                    to: options?.to,
                    limit: options?.limit,
                    desc: options?.desc,
                },
            }
        );
        return response.data.data;
    }

    async get15MinuteAverageAirData(
        options?: GetAirDataOptions
    ): Promise<AirData[]> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);

        if (this.useMocks(options)) {
            return MOCK_AIR_DATA;
        }

        const response = await this.#axiosInstance.get(
            `users/self/devices/${device.type}/${device.id}/air-data/15-min-avg`,
            {
                ...axiosConfig,
                params: {
                    ...axiosConfig?.params,
                    fahrenheit: options?.fahrenheit,
                    from: options?.from,
                    to: options?.to,
                    limit: options?.limit,
                    desc: options?.desc,
                },
            }
        );
        return response.data.data;
    }

    async getDeviceDisplayMode(options?: Options): Promise<DeviceDisplayMode> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);

        if (this.useMocks(options)) {
            return "clock";
        }

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

        if (this.useMocks(options)) {
            return;
        }

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

        if (this.useMocks(options)) {
            return "SLEEP";
        }

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

        if (this.useMocks(options)) {
            return;
        }

        await this.#axiosInstance.put(
            `devices/${device.type}/${device.id}/knocking`,
            {
                mode: options.mode.toLowerCase(),
            },
            axiosConfig
        );
    }

    async getDeviceLEDMode(
        options?: Options
    ): Promise<{mode: DeviceLEDMode; brightness?: number}> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);

        if (this.useMocks(options)) {
            return MOCK_LED_MODE;
        }

        const response = await this.#axiosInstance.get(
            `devices/${device.type}/${device.id}/led`,
            axiosConfig
        );
        return response.data;
    }

    async setDeviceLEDMode(options: SetDeviceLEDModeOptions): Promise<void> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);

        if (this.useMocks(options)) {
            return;
        }

        await this.#axiosInstance.put(
            `devices/${device.type}/${device.id}/led`,
            {
                mode: options.mode.toLowerCase(),
            },
            axiosConfig
        );
    }

    async setDeviceLocation(options: SetDeviceLocationOptions): Promise<void> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);

        if (this.useMocks(options)) {
            return;
        }

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

        if (this.useMocks(options)) {
            return;
        }

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

        if (this.useMocks(options)) {
            return;
        }

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

        if (this.useMocks(options)) {
            return;
        }

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

        if (
            options.mockMode ||
            (typeof options.mockMode !== "boolean" && this.mockMode)
        ) {
            return;
        }

        await this.#axiosInstance.put(
            `devices/${device.type}/${device.id}/space`,
            {
                space_type: options.spaceType,
            },
            axiosConfig
        );
    }

    async getDevicePowerStatus(options?: Options): Promise<DevicePowerStatus> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);

        if (this.useMocks(options)) {
            return MOCK_POWER_STATUS;
        }

        const response = await this.#axiosInstance.get(
            `devices/${device.type}/${device.id}/power-status`,
            axiosConfig
        );
        return response.data;
    }

    async getDeviceTimeZone(options?: Options): Promise<string> {
        const axiosConfig = this.getAxiosConfig(options);
        const device = this.getDevice(options);

        if (this.useMocks(options)) {
            return "America/New_York";
        }

        const response = await this.#axiosInstance.get(
            `devices/${device.type}/${device.id}/timezone`,
            axiosConfig
        );
        return response.data.timezone;
    }
}
