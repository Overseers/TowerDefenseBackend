/*
 * Any business logic/data manipulation
 * takes places in here, and there's
 * only 1 method per route. Also, only
 * 1 class per version of APIs.
 */
import { getGoogleLogo } from '../services/google';

export default class V1 {
	constructor() {
		this.getPing = this.getPing.bind(this);
		this.postPing = this.postPing.bind(this);
		this.fetchGoogleLogo = this.fetchGoogleLogo.bind(this);

		return this;
	}

	getPing() {
		return new Promise((resolve) => {
			return resolve({ status: 200, payload: 'pong' });
		});
	}

	postPing() {
		return new Promise((resolve) => {
			return resolve({ status: 200, payload: 'pong' });
		});
	}

	fetchGoogleLogo() {
		return new Promise((resolve, reject) => {
			getGoogleLogo().then((info) => {
				if (info.statusCode === 200) {
					return resolve({ status: 400, payload: 'success' });
				} else {
					return reject({ status: 400, payload: 'failed' });
				}
			}).catch(() => {
				return reject({ status: 500, payload: 'failed' });
			});
		});
	}
}
