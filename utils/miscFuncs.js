/* -- Misc functions -- */

import { CONTENTPREFS } from "./enums";

/**
 * The function `timeSince` calculates the time elapsed since a given timestamp and returns a
 * human-readable string indicating the time in minutes, hours, days, weeks, months, or years ago.
 * @param timestamp - The `timeSince` function calculates the time elapsed since a given timestamp and
 * returns a human-readable string indicating how long ago that timestamp was.
 * @returns The `timeSince` function calculates the time difference between the current time and a
 * given timestamp in minutes, hours, days, weeks, months, or years, and returns a string indicating
 * how long ago that timestamp was. The function returns a formatted string with the time elapsed in
 * the most appropriate unit (e.g., minutes ago, hours ago, days ago, etc.).
 */
export const timeSince = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (isNaN(diffInSeconds)) return '';

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;

    const months = Math.floor(weeks / 4.345); // Approximate weeks in a month
    if (months < 12) return `${months} month${months !== 1 ? 's' : ''} ago`;

    const years = Math.floor(months / 12);
    return `${years} year${years !== 1 ? 's' : ''} ago`;
}



/**
 * The function `contentRatingArray` retrieves content preferences from localStorage and returns an
 * array of selected content ratings based on user preferences.
 * @returns The `contentRatingArray` function returns an array of content rating preferences based on
 * the user's stored preferences in the `localStorage`. If no preferences are set, it returns `['safe',
 * 'suggestive']`. If all preferences are disabled, it returns `['safe', 'suggestive', 'erotica',
 * 'pornographic']`. Otherwise, it builds the array based on the selected preferences
 */
export const contentRatingArray = () => {
    let rating = JSON.parse(localStorage.getItem(CONTENTPREFS));
    
    if (rating === null) { // if they haven't set anything default
        return ['safe', 'suggestive']
    }

    // if they disable all prefs we show everything
    if (Object.values(rating).every(val => val === false)) {
        return ['safe', 'suggestive', 'erotica', 'pornographic']
    }

    // otherwise we build the list based on what they selected
    let prefs = []; // Man I really want to use list comp here ;-;
    for (let [k, v] of Object.entries(rating)) {
        if (v === true) {
            prefs.push(k)
        }
    }
    
    return prefs;
}