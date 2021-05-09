import axios, {AxiosInstance, AxiosRequestConfig} from "axios";

export type DeviceRoomType =
    | "LIVING_ROOM"
    | "NURSERY"
    | "BEDROOM"
    | "KITCHEN"
    | "OFFICE"
    | "OTHERS"
    | "BASEMENT"
    | "DINING_ROOM"
    | "HALLWAY"
    | "BATHROOM"
    | "PATIO"
    | "GARAGE"
    | "ATTIC"
    | "MEETING_ROOM"
    | "RESTROOM"
    | "BOARD_ROOM"
    | "EXECUTIVE_SUITE"
    | "LOUNGE"
    | "LOBBY"
    | "LABORATORY";

export type DeviceSpaceType = "HOME" | "OFFICE" | "OTHERS";

export type DevicePreference =
    | "GENERAL"
    | "PRODUCTIVITY"
    | "SLEEP"
    | "ALLERGY"
    | "BABY";

export interface Device {
    name: string;
    macAddress: string;
    latitude: number;
    preference: DevicePreference;
    timezone: string;
    roomType: DeviceRoomType;
    deviceType: string;
    longitude: number;
    spaceType: DeviceSpaceType;
    deviceUUID: string;
    deviceId: number;
    locationName: string;
}

export type UsageScope = "FITEEN_MIN" | "FIVE_MIN" | "LATEST" | "RAW";

export interface Usage {
    scope: UsageScope;
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

export type SensorIndexComp =
    | "temp"
    | "humid"
    | "co2"
    | "voc"
    | "pm25"
    | "dust";

export type SensorReadingComp = SensorIndexComp | "lux" | "spl_a";

export interface SensorReading {
    comp: SensorReadingComp;
    value: number;
}

export interface SensorIndex {
    comp: SensorIndexComp;
    value: number;
}

export interface AirData {
    timestamp: string;
    score: number;
    sensors: SensorReading[];
    indices: SensorIndex[];
}

export type DeviceDisplayMode =
    | "clock"
    | "co2"
    | "default"
    | "humid"
    | "nightlight"
    | "off"
    | "pm25"
    | "score"
    | "status"
    | "temp"
    | "temp_humid_celsius"
    | "temp_humid_fahrenheit"
    | "voc";

export type DeviceKnockingMode = "on" | "off" | "sleep";

export type DeviceClockMode = "12hr" | "24hr";

export type DeviceBrightness = 0 | 20 | 40 | 60 | 80 | 100;

export type DeviceTemperatureUnit = "c" | "f";

export type DeviceLEDMode = "auto" | "dim" | "manual" | "on" | "sleep";

export interface Options {
    deviceType?: string;
    deviceId?: number;
    axiosConfig?: AxiosRequestConfig;
    bearerToken?: string;
}

export interface SetDeviceDisplayModeOptions extends Options {
    mode: DeviceDisplayMode;
    clockMode?: DeviceClockMode;
    brightness?: DeviceBrightness;
    temperatureUnit?: DeviceTemperatureUnit;
}

export interface SetDeviceKnockingModeOptions extends Options {
    mode: DeviceKnockingMode;
}

export interface SetDeviceLEDModeOptions extends Options {
    mode: DeviceLEDMode;
    /* This one can be any integer between 0 and 100, so we're not using
       DeviceBrightness. */
    brightness?: number;
}

export interface SetDeviceLocationOptions extends Options {
    latitude: number;
    longitude: number;
}

export interface SetDeviceNameOptions extends Options {
    name: string;
}

export interface SetDevicePreferenceOptions extends Options {
    preference: DevicePreference;
}

export interface SetDeviceRoomTypeOptions extends Options {
    roomType: DeviceRoomType;
}

export interface SetDeviceSpaceTypeOptions extends Options {
    spaceType: DeviceSpaceType;
}

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
