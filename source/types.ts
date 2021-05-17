import {AxiosRequestConfig} from "axios";
import {RetryConfig} from "retry-axios";

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

export type DeviceAPIUsageScope =
    | "FITEEN_MIN"
    | "FIVE_MIN"
    | "LATEST"
    | "RAW"
    | "GET_DISPLAY_MODE"
    | "GET_KNOCKING_MODE"
    | "GET_LED_MODE"
    | "GET_POWER_STATUS"
    | "GET_TIMEZONE"
    | "PUT_DISPLAY_MODE"
    | "PUT_LED_MODE";

export interface DeviceAPIUsage {
    scope: DeviceAPIUsageScope;
    usage: number;
}

export type UserAPIUsageScope = "USER_DEVICE_LIST" | "USER_INFO";

export interface UserAPIUsage {
    scope: UserAPIUsageScope;
    usage: number;
}

export interface Permission {
    scope: string;
    quota: number;
}

export interface User {
    usages: UserAPIUsage[];
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

export type DeviceKnockingMode = "ON" | "OFF" | "SLEEP";

export type DeviceClockMode = "12hr" | "24hr";

export type DeviceBrightness = 0 | 20 | 40 | 60 | 80 | 100;

export type DeviceTemperatureUnit = "c" | "f";

export type DeviceLEDMode = "AUTO" | "DIM" | "MANUAL" | "ON" | "SLEEP";

export interface DevicePowerStatus {
    percentage: number;
    plugged: boolean;
    timestamp: string;
}

export interface Options {
    deviceType?: string;
    deviceId?: number;
    axiosConfig?: AxiosRequestConfig & {raxConfig?: RetryConfig};
    bearerToken?: string;
    mockMode?: boolean;
}

export interface GetLatestAirDataOptions extends Options {
    fahrenheit?: boolean;
}

export interface GetAirDataOptions extends GetLatestAirDataOptions {
    from?: string;
    to?: string;
    limit?: number;
    desc?: boolean;
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
