import {useCallback} from "react";

export const useHttp = () => {
    const request = async (url, method = 'GET', body = null, headers = {'Content-Type': 'application/json'}) => {
        try {
            const response = await fetch(url, {method,mode: 'cors', body, headers});

            if (!response.ok) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`);
            }

            return await response.json();

        } catch(e) {
            throw e;
        }
    }

    return {request}
}

export const ParamUrl = (params = {}) => {
    return Object.entries(params)
        .filter(([_, value]) =>
            value !== undefined &&
            value !== null &&
            value !== "all" &&
            value !== ""
        )
        .map(([key, value]) => {
            if (Array.isArray(value)) {
                // массив → без кодирования запятых
                return `${encodeURIComponent(key)}=${value.join(",")}`;
            }

            return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
        })
        .join("&");
};