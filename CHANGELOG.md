

# [1.4.0](https://github.com/Jiseeeh/pcso-lotto-api/compare/1.3.1...1.4.0) (2025-02-10)


### Bug Fixes

* remove generic response on prod ([57cd991](https://github.com/Jiseeeh/pcso-lotto-api/commit/57cd9911bee112adce3423c9cdaaf49b6e10adba))


### Features

* add swagger docs ([8305a5a](https://github.com/Jiseeeh/pcso-lotto-api/commit/8305a5a8cc48728537d0522ac644130aadd324bb))
* add watch for dev ([bade113](https://github.com/Jiseeeh/pcso-lotto-api/commit/bade11307e313844fee27384f3a7f22f5ecc2111))
* run app depending on env ([e09f648](https://github.com/Jiseeeh/pcso-lotto-api/commit/e09f648432efa950a62c33e00a5f58e5109702b6))
* temporarily disable caching on getting results by date ([b83c6ba](https://github.com/Jiseeeh/pcso-lotto-api/commit/b83c6bade3c71a1fe87c2a4347d82f93b790405a))

## [1.3.1](https://github.com/Jiseeeh/pcso-lotto-api/compare/1.3.0...1.3.1) (2024-12-29)


### Bug Fixes

* add port ([f14bb45](https://github.com/Jiseeeh/pcso-lotto-api/commit/f14bb451f50f73c056198e961ba37f04957766ae))
* throw error instead of manually sending it ([49466d2](https://github.com/Jiseeeh/pcso-lotto-api/commit/49466d2053dd4bd46a8a92ccd57b8be6e515fe44))

# [1.3.0](https://github.com/Jiseeeh/pcso-lotto-api/compare/1.2.1...1.3.0) (2024-12-29)


### Features

* remove file logs ([b6a4440](https://github.com/Jiseeeh/pcso-lotto-api/commit/b6a444003eb5e786d7dda898867a48116dbcc513))
* replace console logs with pino ([b87f2a6](https://github.com/Jiseeeh/pcso-lotto-api/commit/b87f2a68f9d8ac20872c0fa3fc5a462538b7ea38))

## [1.2.1](https://github.com/Jiseeeh/pcso-lotto-api/compare/1.2.0...1.2.1) (2024-12-29)


### Bug Fixes

* data being cached with wrong conditions ([c8cfa72](https://github.com/Jiseeeh/pcso-lotto-api/commit/c8cfa728dc5d57bcce5229e6a1261745eec1d058))
* redis image not being recognized ([b658550](https://github.com/Jiseeeh/pcso-lotto-api/commit/b6585504619f2de8fe9c1d9c63bba4be745b93bf))
* redundant checking of caching ([099bf14](https://github.com/Jiseeeh/pcso-lotto-api/commit/099bf147abe1568ba3bb480ead670d1af5c4f58c))
* status code being out of range ([e68e755](https://github.com/Jiseeeh/pcso-lotto-api/commit/e68e755d589aa06aa1a45ec2c211f5df73111ef5))
* system time being used instead of ph time ([add9750](https://github.com/Jiseeeh/pcso-lotto-api/commit/add97507c1a93d0850ef306ca4dd1d8cde5b39e1))

# [1.2.0](https://github.com/Jiseeeh/pcso-lotto-api/compare/1.1.0...1.2.0) (2024-12-19)


### Bug Fixes

* cache data gets stale and still gets returned ([b392793](https://github.com/Jiseeeh/pcso-lotto-api/commit/b392793e3d157d20ebc8e57e0f1ce67d4096cd90))


### Features

* add date formatter helper ([d7616e5](https://github.com/Jiseeeh/pcso-lotto-api/commit/d7616e5f667ba4e538d63385f76b6b497d957c77))
* add date formatter to barrel file ([7842f1a](https://github.com/Jiseeeh/pcso-lotto-api/commit/7842f1a8c90b874dc45eb937c554282dab058814))

# [1.1.0](https://github.com/Jiseeeh/pcso-lotto-api/compare/1.0.0...1.1.0) (2024-11-30)


### Features

* add ci flag to release it ([b5e8a5f](https://github.com/Jiseeeh/pcso-lotto-api/commit/b5e8a5f6c55416d89d83026f325f148a6de8c47b))
* add node redis ([22be8ce](https://github.com/Jiseeeh/pcso-lotto-api/commit/22be8ced7c6138f5672c3021e7c9f64138730e99))
* add redis client ([cb48cf0](https://github.com/Jiseeeh/pcso-lotto-api/commit/cb48cf095fa44253b4df5db7f58ee2eac4ffb784))
* cache results ([a4c7c6c](https://github.com/Jiseeeh/pcso-lotto-api/commit/a4c7c6c0a87273262012439d03c5c83f5903287a))
* initialize redis client ([5e953b0](https://github.com/Jiseeeh/pcso-lotto-api/commit/5e953b04a50c67af8e0a70d62ee92627f2e70442))

# 1.0.0 (2024-11-16)


### Bug Fixes

* error always logging internal server ([3dcb08f](https://github.com/Jiseeeh/pcso-lotto-api/commit/3dcb08ff374e950fa25f6e7fac6be783c9e17af2))
* redundant gameId showing on results ([4c755bb](https://github.com/Jiseeeh/pcso-lotto-api/commit/4c755bb09a09e5cb08a6742b2393c178bdafd946))
* remove redundant string literal ([22aaebf](https://github.com/Jiseeeh/pcso-lotto-api/commit/22aaebfcb1fc4ef0737f07b37fa2b6e471e21f1c))


### Features

* add async wrapper ([ed442de](https://github.com/Jiseeeh/pcso-lotto-api/commit/ed442de750b1e61cf4115a8ef546dc0ea6ac2069))
* add barrel file for helper files ([76b8e2e](https://github.com/Jiseeeh/pcso-lotto-api/commit/76b8e2e9895736530dc32fde80a626ec394803a5))
* add cheerio ([ffce511](https://github.com/Jiseeeh/pcso-lotto-api/commit/ffce511d98cb47a9c83dad97237828229467a43f))
* add constants file ([3a14988](https://github.com/Jiseeeh/pcso-lotto-api/commit/3a149886769da4ac0c47be4eb41d6e37d66d2225))
* add dotenv ([7415b30](https://github.com/Jiseeeh/pcso-lotto-api/commit/7415b30ba987a05fef27cf2a5e07331f6dc8903c))
* add error handler ([4f4646a](https://github.com/Jiseeeh/pcso-lotto-api/commit/4f4646ac774d0d6374cb8d34582fb948f524de18))
* add format game id helper ([bbe4805](https://github.com/Jiseeeh/pcso-lotto-api/commit/bbe4805c327a574459a631851861d502f9449492))
* add game interface ([6f092f5](https://github.com/Jiseeeh/pcso-lotto-api/commit/6f092f53d2aadc9dbec68bc84893daca1dce8ce4))
* add get by date and by id route ([cdc75da](https://github.com/Jiseeeh/pcso-lotto-api/commit/cdc75dac72e12ae38d6e7eb0ad97d55f2248a7ea))
* add get days helper fn ([c240836](https://github.com/Jiseeeh/pcso-lotto-api/commit/c240836a05f83318eedbac8d6257ad3bbd5ff822))
* add get results by date ([5dd9230](https://github.com/Jiseeeh/pcso-lotto-api/commit/5dd92308ebbb07aa6db3221abd1f4793e47847cb))
* add get results today controller ([249aadb](https://github.com/Jiseeeh/pcso-lotto-api/commit/249aadbf59bf996504d5c6b5022324a8c788a24b))
* add get results today controller ([ebae2e8](https://github.com/Jiseeeh/pcso-lotto-api/commit/ebae2e8b294525eaca1b3278e2a58b6d6374ba22))
* add group by helper ([6cf4b05](https://github.com/Jiseeeh/pcso-lotto-api/commit/6cf4b05839fd5b27e7c968dd863de2c1ac0438e1))
* add interfaces ([853fcf8](https://github.com/Jiseeeh/pcso-lotto-api/commit/853fcf89e6f9d6c3d0b84e26a060e51c460f055d))
* add months ([25a9596](https://github.com/Jiseeeh/pcso-lotto-api/commit/25a9596b795e531a2110cbaafa968957d18d7fef))
* add old instance of lapu lapu city ([ea70991](https://github.com/Jiseeeh/pcso-lotto-api/commit/ea709913f5716c8b053c68831b7fd06c989e6e7f))
* add old instances of game ids ([a749d32](https://github.com/Jiseeeh/pcso-lotto-api/commit/a749d328084ecf7d36ef4eff94f23c8d7e47f939))
* add readme.md ([a585113](https://github.com/Jiseeeh/pcso-lotto-api/commit/a585113649cb4cdba8154d0f35b13455f808fea0))
* add release-it ([ec41e0b](https://github.com/Jiseeeh/pcso-lotto-api/commit/ec41e0b6a9f3ee9c2f44062c1af71cfa941d6d9b))
* add results enums ([6731546](https://github.com/Jiseeeh/pcso-lotto-api/commit/673154617bc7a2548cf372788ad5b9d54b13df79))
* add routes barrel file ([f9683c6](https://github.com/Jiseeeh/pcso-lotto-api/commit/f9683c67d4e390e90e749dc1a518518681109edb))
* add scripts ([fc203e1](https://github.com/Jiseeeh/pcso-lotto-api/commit/fc203e17458194cbf03ccaae198fabbb1bb92361))
* add temp routes ([f6d36c8](https://github.com/Jiseeeh/pcso-lotto-api/commit/f6d36c8f54195399eeb7587578e9c2d10db0eeb2))
* add url encoded ([7601b04](https://github.com/Jiseeeh/pcso-lotto-api/commit/7601b04784bb996e3ed11bdda04d9c33eee2916b))
* also replace slashes ([d3beea5](https://github.com/Jiseeeh/pcso-lotto-api/commit/d3beea544bdd03fbafdc3a5e68561e37bc6ee443))
* exclude .idea ([c6e2cb2](https://github.com/Jiseeeh/pcso-lotto-api/commit/c6e2cb2f8349eeecf2a1bdf97a6b4cdc667bc4d5))
* improve per gameId response ([1933c9e](https://github.com/Jiseeeh/pcso-lotto-api/commit/1933c9e3dd770daf8edda9fe77dcd53501ac6d95))
* make level debug ([1f6fdd2](https://github.com/Jiseeeh/pcso-lotto-api/commit/1f6fdd236a451887736f5dae77abead633313732))
* re implement parse results ([528c21b](https://github.com/Jiseeeh/pcso-lotto-api/commit/528c21b0922bb4f620d6b2a509c7a8603d34d12d))
* replace generic message ([6909cfe](https://github.com/Jiseeeh/pcso-lotto-api/commit/6909cfe124a5ce0decedf3f497961247b49437e2))
* separate prod return object ([7ee3f57](https://github.com/Jiseeeh/pcso-lotto-api/commit/7ee3f57850546dcfb8ca8692d01b350040d4676e))
* sign commits ([20b634c](https://github.com/Jiseeeh/pcso-lotto-api/commit/20b634c50f408fa33f937a16078e39ec6c325e75))
* use create error constructor ([c60ccd0](https://github.com/Jiseeeh/pcso-lotto-api/commit/c60ccd04dd15eb0fc8ea3a22213bca2734d4124c))
* use default release script ([dc75227](https://github.com/Jiseeeh/pcso-lotto-api/commit/dc75227630902ef4a2dbece9c256b9e2dc47281b))
