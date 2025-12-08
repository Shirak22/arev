/**
 * @fileoverview Chrome Storage Local cache management utilities
 * @author Shirak Soghomonian
 * @license MIT
 * Copyright (c) 2025 Shirak Soghomonian
 * GitHub: https://github.com/Shirak22/arev
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

let CACHE_EXPIRATION_TIME_POSITION = 1000 * 60 * 60 * 24 ; // 24 hours
let CACHE_EXPIRATION_TIME_WEATHER = 1000 * 60 * 60 ; // 1 hour

export const storeToCache = async (key, value) => {
    try {
        await chrome.storage.local.set({
            [key]: value, 
            [`timestamp_${key}`]: Date.now()
        });
        return true;
    } catch (error) {
        console.error("Error storing to cache:", error);
        return false;
    }
}



export const getFromCache = async (key) => {
        const CACHE_EXPIRATION_TIME = key === "position" ? CACHE_EXPIRATION_TIME_POSITION : CACHE_EXPIRATION_TIME_WEATHER; // 24 hours for position, 1 hour for weather
        try {
            const value = await chrome.storage.local.get([key , `timestamp_${key}`]);
            const timestamp = value[`timestamp_${key}`]
            if(value && timestamp && Date.now() - timestamp < CACHE_EXPIRATION_TIME) {
                return value;
            }else {
                return null;
            }
        } catch (error) {
            return null;
        }

}

export const cachePurge = async () => {
    await chrome.storage.local.clear();
}