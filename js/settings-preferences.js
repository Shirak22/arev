const DEFAULT_PREFERENCES = {
    locationMethod: "ip",
    manualCity: "",
    manualCountry: "",
    backgroundMode: "dynamic",
    customBackgroundUrl: ""
};

const SETTINGS_KEY = "userPreferences";

export const getPreferences = async () => {
    const stored = await chrome.storage.local.get([SETTINGS_KEY]);
    return {
        ...DEFAULT_PREFERENCES,
        ...(stored?.[SETTINGS_KEY] || {})
    };
};

export const setPreferences = async (updates) => {
    const current = await getPreferences();
    const next = {
        ...current,
        ...updates
    };
    await chrome.storage.local.set({ [SETTINGS_KEY]: next });
    return next;
};

export { DEFAULT_PREFERENCES };
