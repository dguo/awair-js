# Awair JS

[![npm](https://img.shields.io/npm/v/awair.svg)](https://www.npmjs.com/package/awair)
[![license](https://img.shields.io/npm/l/awair.svg)](https://github.com/dguo/awair-js/blob/main/LICENSE.txt)
[![bundle size](https://img.shields.io/bundlephobia/minzip/awair)](https://bundlephobia.com/result?p=awair)
[![continuous integration status](https://github.com/dguo/awair-js/actions/workflows/continuous-integration.yml/badge.svg)](https://github.com/dguo/awair-js/actions/workflows/continuous-integration.yml)
[![test coverage](https://codecov.io/gh/dguo/awair-js/branch/main/graph/badge.svg)](https://codecov.io/gh/dguo/awair-js)
[![known vulnerabilities](https://snyk.io/test/github/dguo/awair-js/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dguo/awair-js?targetFile=package.json)

JavaScript client for [Awair](https://www.getawair.com/)'s
[API](https://docs.developer.getawair.com/).

This is a work in progress. Significant changes and documentation are incoming.

## Installation

```sh
npm install --save awair
```

or

```sh
yarn add awair
```

## Usage

```javascript
import {Awair} from "awair";

const bearerToken = "<your bearer token>";
const awair = new Awair({bearerToken});
```

## License

MIT
