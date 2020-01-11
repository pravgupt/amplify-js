jest.mock('@aws-amplify/core/lib/Signer', () => {
	return {
		default: {
			sign: (request: any, access_info: any, service_info?: any) => {
				return request;
			},
		},
	};
});
jest.mock('axios', () => {
	return {
		default: signed_params => {
			return new Promise((res, rej) => {
				const withCredentialsSuffix =
					signed_params && signed_params.withCredentials
						? '-withCredentials'
						: '';
				if (
					signed_params &&
					signed_params.headers &&
					signed_params.headers.reject
				) {
					rej({
						data: 'error' + withCredentialsSuffix,
					});
				} else if (signed_params && signed_params.responseType === 'blob') {
					res({
						data: 'blob' + withCredentialsSuffix,
					});
				} else {
					res({
						data: 'data' + withCredentialsSuffix,
					});
				}
			});
		},
		//providing cancelToken here results in 'Cannot read property 'source' of undefined' error
		// CancelToken: {
		// 	default: () => {},
		// 	source: jest.fn(),
		// },
	};
});

import { RestClient } from '../src/RestClient';
import axios, { CancelTokenStatic } from 'axios';

describe('RestClient test', () => {
	beforeAll(() => {
		//this was the only way I was able to find that allowed tests to pass, see below test for issues with this though.
		// axios.CancelToken = <CancelTokenStatic>{
		// 	source: () => ({ token: null, cancel: null }),
		// };
	});

	describe('ajax', () => {
		test('fetch with signed request', async () => {
			const apiOptions = {
				headers: {},
				endpoints: {},
				credentials: {
					accessKeyId: 'accessKeyId',
					secretAccessKey: 'secretAccessKey',
					sessionToken: 'sessionToken',
				},
			};

			const restClient = new RestClient(apiOptions);

			// const mockSource = jest
			// 	.fn()
			// 	.mockReturnValue({ token: null, cancel: null });
			// axios.CancelToken = <CancelTokenStatic>(<unknown>{
			// 	source: mockSource,
			// });

			// even though this allows the tests to pass, the calls length is always 0, even though it is being executed and returns the correct value during test execution
			// console.log('call length:', mockSource.mock.calls.length);

			expect(await restClient.ajax('url', 'method', {})).toEqual('data');
		});

		test('fetch with signed failing request', async () => {
			const apiOptions = {
				headers: {},
				endpoints: {},
				credentials: {
					accessKeyId: 'accessKeyId',
					secretAccessKey: 'secretAccessKey',
					sessionToken: 'sessionToken',
				},
			};

			const restClient = new RestClient(apiOptions);

			expect.assertions(1);

			try {
				await restClient.ajax('url', 'method', { headers: { reject: 'true' } });
			} catch (error) {
				expect(error).toEqual({ data: 'error' });
			}
		});

		test('fetch with signed request', async () => {
			const apiOptions = {
				headers: {},
				endpoints: {},
				credentials: {
					accessKeyId: 'accessKeyId',
					secretAccessKey: 'secretAccessKey',
					sessionToken: 'sessionToken',
				},
			};

			const restClient = new RestClient(apiOptions);

			expect(await restClient.ajax('url', 'method', {})).toEqual('data');
		});

		test('ajax with no credentials', async () => {
			const apiOptions = {
				headers: {},
				endpoints: {},
			};

			const restClient = new RestClient(apiOptions);

			try {
				await restClient.ajax('url', 'method', {});
			} catch (e) {
				expect(e).toBe('credentials not set for API rest client ');
			}
		});

		test('ajax with extraParams', async () => {
			const apiOptions = {
				headers: {},
				endpoints: {},
				credentials: {
					accessKeyId: 'accessKeyId',
					secretAccessKey: 'secretAccessKey',
					sessionToken: 'sessionToken',
				},
			};

			const restClient = new RestClient(apiOptions);

			expect(await restClient.ajax('url', 'method', { body: 'body' })).toEqual(
				'data'
			);
		});

		test('ajax with custom responseType', async () => {
			const apiOptions = {
				headers: {},
				endpoints: {},
				credentials: {
					accessKeyId: 'accessKeyId',
					secretAccessKey: 'secretAccessKey',
					sessionToken: 'sessionToken',
				},
			};

			const restClient = new RestClient(apiOptions);

			expect(
				await restClient.ajax('url', 'method', {
					body: 'body',
					responseType: 'blob',
				})
			).toEqual('blob');
		});

		test('ajax with Authorization header', async () => {
			const apiOptions = {
				headers: {},
				endpoints: {},
				credentials: {
					accessKeyId: 'accessKeyId',
					secretAccessKey: 'secretAccessKey',
					sessionToken: 'sessionToken',
				},
			};

			const restClient = new RestClient(apiOptions);

			expect(
				await restClient.ajax('url', 'method', {
					headers: { Authorization: 'authorization' },
				})
			).toEqual('data');
		});

		test('ajax with withCredentials set to true', async () => {
			const apiOptions = {
				headers: {},
				endpoints: {},
				credentials: {
					accessKeyId: 'accessKeyId',
					secretAccessKey: 'secretAccessKey',
					sessionToken: 'sessionToken',
				},
			};

			const restClient = new RestClient(apiOptions);

			expect(
				await restClient.ajax('url', 'method', { withCredentials: true })
			).toEqual('data-withCredentials');
		});
	});

	describe('get test', () => {
		test('happy case', async () => {
			const spyon = jest.spyOn(RestClient.prototype, 'ajax');

			const apiOptions = {
				headers: {},
				endpoints: {},
				credentials: {
					accessKeyId: 'accessKeyId',
					secretAccessKey: 'secretAccessKey',
					sessionToken: 'sessionToken',
				},
			};

			const restClient = new RestClient(apiOptions);

			expect.assertions(5);
			await restClient.get('url', {});

			expect(spyon.mock.calls[0][0]).toBe('url');
			expect(spyon.mock.calls[0][1]).toBe('GET');

			await restClient.get('url', { withCredentials: true });

			expect(spyon.mock.calls[1][0]).toBe('url');
			expect(spyon.mock.calls[1][1]).toBe('GET');
			expect(spyon.mock.calls[1][2]).toEqual({ withCredentials: true });
			//todo: add expectation that CancelToken.source was called
			spyon.mockClear();
		});
	});

	describe('put test', () => {
		test('happy case', async () => {
			const spyon = jest.spyOn(RestClient.prototype, 'ajax');

			const apiOptions = {
				headers: {},
				endpoints: {},
				credentials: {
					accessKeyId: 'accessKeyId',
					secretAccessKey: 'secretAccessKey',
					sessionToken: 'sessionToken',
				},
			};

			const restClient = new RestClient(apiOptions);

			expect.assertions(3);
			await restClient.put('url', 'data');

			expect(spyon.mock.calls[0][0]).toBe('url');
			expect(spyon.mock.calls[0][1]).toBe('PUT');
			expect(spyon.mock.calls[0][2]).toBe('data');
			//todo: add expectation that CancelToken.source was called
			spyon.mockClear();
		});
	});

	describe('patch test', () => {
		test('happy case', async () => {
			const spyon = jest.spyOn(RestClient.prototype, 'ajax');

			const apiOptions = {
				headers: {},
				endpoints: {},
				credentials: {
					accessKeyId: 'accessKeyId',
					secretAccessKey: 'secretAccessKey',
					sessionToken: 'sessionToken',
				},
			};

			const restClient = new RestClient(apiOptions);

			expect.assertions(3);
			await restClient.patch('url', 'data');

			expect(spyon.mock.calls[0][0]).toBe('url');
			expect(spyon.mock.calls[0][1]).toBe('PATCH');
			expect(spyon.mock.calls[0][2]).toBe('data');
			//todo: add expectation that CancelToken.source was called
			spyon.mockClear();
		});
	});

	describe('post test', () => {
		test('happy case', async () => {
			const spyon = jest.spyOn(RestClient.prototype, 'ajax');

			const apiOptions = {
				headers: {},
				endpoints: {},
				credentials: {
					accessKeyId: 'accessKeyId',
					secretAccessKey: 'secretAccessKey',
					sessionToken: 'sessionToken',
				},
			};

			const restClient = new RestClient(apiOptions);

			expect.assertions(3);
			await restClient.post('url', 'data');

			expect(spyon.mock.calls[0][0]).toBe('url');
			expect(spyon.mock.calls[0][1]).toBe('POST');
			expect(spyon.mock.calls[0][2]).toBe('data');
			//todo: add expectation that CancelToken.source was called
			spyon.mockClear();
		});
	});

	describe('del test', () => {
		test('happy case', async () => {
			const spyon = jest.spyOn(RestClient.prototype, 'ajax');

			const apiOptions = {
				headers: {},
				endpoints: {},
				credentials: {
					accessKeyId: 'accessKeyId',
					secretAccessKey: 'secretAccessKey',
					sessionToken: 'sessionToken',
				},
			};

			const restClient = new RestClient(apiOptions);

			expect.assertions(2);
			await restClient.del('url', {});

			expect(spyon.mock.calls[0][0]).toBe('url');
			expect(spyon.mock.calls[0][1]).toBe('DELETE');
			//todo: add expectation that CancelToken.source was called
			spyon.mockClear();
		});
	});

	describe('head test', () => {
		test('happy case', async () => {
			const spyon = jest.spyOn(RestClient.prototype, 'ajax');

			const apiOptions = {
				headers: {},
				endpoints: {},
				credentials: {
					accessKeyId: 'accessKeyId',
					secretAccessKey: 'secretAccessKey',
					sessionToken: 'sessionToken',
				},
			};

			const restClient = new RestClient(apiOptions);

			expect.assertions(2);
			await restClient.head('url', {});

			expect(spyon.mock.calls[0][0]).toBe('url');
			expect(spyon.mock.calls[0][1]).toBe('HEAD');
			//todo: add expectation that CancelToken.source was called
			spyon.mockClear();
		});
	});

	describe('endpoint test', () => {
		test('happy case', () => {
			const apiOptions = {
				headers: {},
				endpoints: [
					{
						name: 'myApi',
						endpoint: 'endpoint of myApi',
					},
					{
						name: 'otherApi',
						endpoint: 'endpoint of otherApi',
					},
				],
				credentials: {
					accessKeyId: 'accessKeyId',
					secretAccessKey: 'secretAccessKey',
					sessionToken: 'sessionToken',
				},
				region: 'myregion',
			};

			const restClient = new RestClient(apiOptions);

			expect(restClient.endpoint('myApi')).toBe('endpoint of myApi');
		});

		test('custom endpoint', () => {
			const apiOptions = {
				headers: {},
				endpoints: [
					{
						name: 'myApi',
						endpoint: 'endpoint of myApi',
					},
					{
						name: 'otherApi',
						endpoint: 'endpoint of otherApi',
						region: 'myregion',
						service: 'myservice',
					},
				],
				credentials: {
					accessKeyId: 'accessKeyId',
					secretAccessKey: 'secretAccessKey',
					sessionToken: 'sessionToken',
				},
			};

			const restClient = new RestClient(apiOptions);

			expect(restClient.endpoint('otherApi')).toBe('endpoint of otherApi');
		});
	});

	describe('Cancel Token', () => {
		test('happy case', () => {
			//todo
		});
		test('request non existent', () => {
			//todo
		});
		test('isCancel call', () => {
			//todo
		});
		test('Cancel happy case', () => {
			//todo
		});
	});
});
