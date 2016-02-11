import path from 'path';
import fs from 'fs';
import assert from 'assert';
import { transformFileSync } from 'babel-core';

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

describe('remove react static propTypes', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  fs.readdirSync(fixturesDir).map((caseName) => {
    it(`should ${caseName.split('-').join(' ')}`, () => {
      const fixtureDir = path.join(fixturesDir, caseName);
      const actual = transformFileSync(path.join(fixtureDir, 'actual.js'), {
        plugins: [
          ["../src/index.js", {
            "propTypes": true
          }]
        ]
      }).code;
      const expected = fs.readFileSync(path.join(fixtureDir, 'expected.js')).toString();

      assert.equal(trim(actual), trim(expected));
    });
  });
});
