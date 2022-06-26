const path = require('path');
const {
    PactV3,
    MatchersV3,
    SpecificationVersion,
} = require('@pact-foundation/pact');
const LOG_LEVEL = process.env.LOG_LEVEL || 'WARN';

const axios = require('axios')

describe('848 repro', () => {
    const provider = new PactV3({
        consumer: 'test',
        provider: 'provider',
        dir: path.resolve(process.cwd(), 'pacts'),
        spec: SpecificationVersion.SPECIFICATION_VERSION_V3,
        logLevel: LOG_LEVEL,
    });

    describe('multiple provider states with same name', () => {
        describe('"file exists" with parameter set 1', () => {
            beforeEach(() =>
                provider
                    .given('file exists', { username: "user", password: "pass", fileName: "resource" })
                    .uponReceiving('a request for a file with user/password')
                    .withRequest({
                        method: 'GET',
                        path: "/file"
                    })
                    .willRespondWith({
                        status: 200,
                    })
            );

            it('returns the animal', () => {
                return provider.executeTest(async (mockserver) => {
                    await axios(`${mockserver.url}/file`)
                });
            });
        });

        describe('"file exists" with parameter set 2', () => {
            beforeEach(() =>
                provider
                    .given('file exists', { foo: "bar" })
                    .uponReceiving('a request for a file with foo/bar')
                    .withRequest({
                        method: 'GET',
                        path: "/file"
                    })
                    .willRespondWith({
                        status: 200,
                    })
            );

            it('returns the animal', () => {
                return provider.executeTest(async (mockserver) => {
                    await axios(`${mockserver.url}/file`)
                });
            });
        });
    });

});
