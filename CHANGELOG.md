# Changelog

This project attempts to adhere to [Semantic Versioning](http://semver.org).

## [Unreleased]

## [0.4.0] - (2021-05-28)

### Fixed

- Make the returned values for `getRawAirData`, `get5MinuteAverageAirData`, and
  `get15MinuteAverageAirData` actually match the declared types instead of
  being objects with a `data` property

## [0.3.0] - (2021-05-22)

### Added

- Support parameters when getting AirData
- Support mock mode
- Export more types
- Allow passing in options for `getUser`
- Automatically retry failed requests, using
  [retry-axios](https://github.com/JustinBeckwith/retry-axios)

### Fixed

- Fix the possible values for the knocking mode and the LED mode (they come back
  in all capital case)
- Fix the types for the possible values for user usage scopes

## [0.2.0] - (2021-05-09)

### Added

- Add functions to change device options
- Allow setting a device for the instance instead of per request
- Allow passing Axios options for all requests
- Allow passing a bearer token for all requests
- Export more types

### Changed

- Make the bearer token optional when creating the instance
- Use the same configuration object for creating an instance and for all
  requests

## [0.1.0] - (2021-05-04)

### Added

- Initial implementation of GET requests

[unreleased]: https://github.com/dguo/awair-js/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/dguo/awair-js/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/dguo/awair-js/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/dguo/awair-js/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/dguo/awair-js/releases/tag/v0.1.0
