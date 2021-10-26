import { Model } from "./types";

export const compareTime = <T extends Model>(a: T, b: T): number => {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
};

export const sortByTime = <T extends Model>(array: T[]): T[] => {
  return array.slice().sort(compareTime);
};

export const toMap = <T extends Model>(array: T[]): Map<string, T> => {
  return new Map<string, T>(array.map(item => [item.id, item]));
};

export const fromMap = <T extends Model>(map: Map<string, T>): T[] => {
  return Array.from(map.entries()).map(entry => entry[1]);
};

export const toQueryParams = (params: Record<string, any>): string => {
  const paramsAsString = Object.entries(params)
    .filter(([_, value]) => !!value)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `?${paramsAsString}`;
};
