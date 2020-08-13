/* eslint-disable no-undef */

import isEmpty from 'lodash/isEmpty';

export default class Base {

    /**
     * Wait for an element to be visible in the JSX Dom.
     * 
     * @param {String} selector valid "css" selector to find the element on the page.
     * @return {boolean} is the selector visible
     */
    waitForIsShown = async (selector) => {
        const element = await $(selector);
        if (element.isDisplayed()) {
            return element;
        } else {
            throw new Error(`Error locating element on the screen with selector ${selector}`);
        }
    };

    /**
     * Wait for an element to be visible in the JSX Dom.
     * 
     * @param {String} selector valid "css" selector to find a collection of elements on the page
     * @return {boolean} is there at least one element on the page
     */
    waitForIsShown = async (selector) => {
        const elements = await $$(selector);
        if (isEmpty(elements)) {
            return Promise.all(elements);
        } else {
            throw new Error(`Error locating elements on the screen with selector ${selector}`);
        }
    };
}
