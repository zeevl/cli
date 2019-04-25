/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import execa from 'execa';

export default function findEmulators(): string[] {
  const stdout = execa('avdmanager list avd');

  return (
    stdout
      .toString()
      // Remove lines such as Parsing /Users/xxx/xxx/package.xml
      .replace(/Parsing\s+.+/gm, '')
      // Emulators are separated by ---------
      .split('---------')
      .map(item =>
        item
          .split('\n')
          .map(line => line.trim())
          .find(line => line.startsWith('Name:')),
      )
      .filter(Boolean)
      .map(name => name.replace(/Name:/, '').trim())
  );
}
