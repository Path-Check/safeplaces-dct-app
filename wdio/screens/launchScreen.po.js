/* eslint-disable no-undef */

import Base from './base.po';

class LaunchScreen extends Base {
    isOnScreen = async () => {
       await this.waitForIsShown('~Welcome to PathCheck');
    }
}

export default new LaunchScreen();
