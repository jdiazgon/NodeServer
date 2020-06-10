<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest
  
  <p align="center">A progressive <a href="http://nodejs.org" target="blank">Node.js</a> framework for building efficient and scalable server-side applications, heavily inspired by <a href="https://angular.io" target="blank">Angular</a>.</p>

## Description

[Nest](https://github.com/nestjs/nest) server to be used for CobiGen, in order to parse and merge TypeScript files.

Master branch needs to be executed using an .exe file, passing as argument the port to be used.

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Create executable

```bash
yarn install
```
There is a packaging issue due to the external library `pkg`, you will have to manually fix a module. Go to `node_modules\@devonfw\ts-merger\dist\`, copy `ts-merger.umd.js` and paste it to `node_modules\@devonfw\ts-merger\build`. Remove file `index.js` and rename `ts-merger.umd.js`to `index.js`. Finally:

```bash
$ yarn run build
$ yarn pkg --targets latest-win-x64 --output nestserver-1.0.7.exe dist/main.js
```
:warning: Since nestserver is released seperatedly for different os, please refer to branch `dev_linux` and `dev_macos` to merge changes and release the corresponding version as well

## Publish

Please follow [this tutorial](https://yarnpkg.com/en/docs/publishing-a-package#toc-publishing-your-package)

## License

  Nest is [APACHE 2.0 licensed](LICENSE).
