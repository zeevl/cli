/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import path from 'path';
import execa from 'execa';

export default async function launchEmulator(name: string) {
  const ANDROID_HOME = process.env.ANDROID_HOME;

  if (!ANDROID_HOME) {
    throw new Error('ANDROID_HOME variable not present in environment');
  }

  await execa(`emulator -avd ${name}`, {
    // Sometimes we get this error
    // android/android-emu/android/qt/qt_setup.cpp:28:Qt library not found at ../emulator/lib64/qt/lib
    // This error disappears if we launch the emulator from $ANDROID_HOME/tools
    cwd: path.join(ANDROID_HOME, 'tools'),
  });

  let i = 0;

  while (true) {
    if (i > 30) {
      // Abort after 30 retries (half a minute)
      throw new Error('Timed out when waiting for the emulator to boot');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const stdout = await execa('adb shell getprop sys.boot_completed');

    if (stdout === '1') {
      // Result of the command will be "1" after the device has booted
      return;
    }

    i++;
  }
}
