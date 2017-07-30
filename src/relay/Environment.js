import {
  Environment,
  Network,
  RecordSource,
  Store
} from 'relay-runtime';
import config from '../config';

function createFetchQuery(token, teamSlug) {
  return function fetchQuery(
    operation,
    variables,
    cacheConfig,
    uploadables,
  ) {
    return fetch(config.checkApiUrl + '/api/graphql', {
      method: 'POST',
      headers: {
        'X-Check-Token': token,
        'content-type': 'application/json',
        credentials: 'include'
      },
      body: JSON.stringify({
        query: operation.text,
        variables,
        team: teamSlug
      }),
    }).then(response => {
      return response.json();
    });
  };
}

export function createEnvironment(token, teamSlug) {
  const network = Network.create(createFetchQuery(token, teamSlug));
  const source = new RecordSource();
  const store = new Store(source);
  const environment = new Environment({ network, store });
  return environment;
}
