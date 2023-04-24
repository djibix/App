import{O365_getAppAccessToken, O365_getUserAccessToken} from './server';

export const tokenEndpoint = `https://login.microsoftonline.com/${process.env.MS_TENANT}/oauth2/v2.0/token`;
export const grantType = 'client_credentials';
export const scope = 'https://graph.microsoft.com/.default';

// transform the query object into a query string of the form ?key1=value1&key2=value2
function getQueryUrl(query) {
    var queryUrl = '';
    for (const key in query) {
        queryUrl += (queryUrl == '' ? '?' : '&');
        queryUrl += `${key}=${query[key]}`;
    }
    return queryUrl;
}

export const O365_API_getToken = function(tenant) {
    return `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`;
}
export const O365_API_getItemChildren = function(siteId, itemId, query) {
    return `https://graph.microsoft.com/v1.0/sites/root/sites/${siteId}/drive/items/${itemId}/children${getQueryUrl(query)}`;
}
export const O365_API_updateDriveItem = function(siteId, itemId, query) {
    return `https://graph.microsoft.com/v1.0/sites/root/sites/${siteId}/drive/items/${itemId}${getQueryUrl(query)}`;
}
export const O365_API_getDriveItem = function(siteId, itemId, query) {
    return `https://graph.microsoft.com/v1.0/sites/root/sites/${siteId}/drive/items/${itemId}${getQueryUrl(query)}`;
}
export const O365_API_getDriveItemContent = function(siteId, itemId, query) {
    return `https://graph.microsoft.com/v1.0/sites/root/sites/${siteId}/drive/items/${itemId}/content${getQueryUrl(query)}`;
}

async function fetchAPI(url, token) {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }).then(response => {
        if (response.status !== 200) {
            throw new Error('Error calling Microsoft Graph API: ', `${response.status} - ${response.statusText}`);
        } else {
            return response.json();
        }
    });
    return response;
}


export async function O365_callGraphApi(url) {
    try {
        var token;
        var response
        if (Meteor.isServer) {
            token = await O365_getAppAccessToken();
            response = await fetchAPI(url, token);
        } else {
            token = await O365_getUserAccessToken.call((error, token) => {
                if (error) {
                    console.error('Error getting access token:', error);
                } else {
                    console.log('Access token 1:', accessToken);
                    response = fetchAPI(url, token);

                    return accessToken;
                }

            });
        }
        console.log('Access token 2:', token);
      console.log('response: ', response);
      return response;
    } catch (error) {
      console.error('Error calling Microsoft Graph API:', error);
      throw error;
    }
  }
  