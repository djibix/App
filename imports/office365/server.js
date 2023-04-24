// TODO: merge this with the code for office 365 OAuth (in lindoelio:accounts-office365)
import { Meteor } from 'meteor/meteor';
import { fetch } from 'meteor/fetch';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import SimpleSchema from 'simpl-schema';
import { O365_API_getToken } from './common';

// Method to get the access token for the logged in user
export const O365_getUserAccessToken = new ValidatedMethod({
  name: 'O365_getUserAccessToken',
  validate: new SimpleSchema({}).validator(),
  run() {
    if (Meteor.isServer) {
      if (!this.userId) {
        throw new Meteor.Error('not-authorized', 'User not logged in');
      }
  
      const user = Meteor.user();
      if (user.services && user.services.office365) {
        return user.services.office365.accessToken;
      } else {
        throw new Meteor.Error('no-access-token', 'No Office 365 access token found');
      }
    }  
  },
});

// object to store the sever connection information
office365Connection = {};
export async function O365_getAppAccessToken() {
  // check if we have a valid access token
  if (office365Connection.expiresAt && new Date().getTime() < office365Connection.expiresAt) {
    return office365Connection.accessToken;
  }
  // else get a new access token
  try {
    const tokenEndpoint = O365_API_getToken(process.env.MS_TENANT);
    const grantType = 'client_credentials';
    const scope = 'https://graph.microsoft.com/.default';
    const requestBody = `client_id=${process.env.MS_CLIENTID}&client_secret=${process.env.MS_SECRET}&grant_type=${grantType}&scope=${scope}`;
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: headers,
      body: requestBody,
    }).then(response => {
      if (response.status !== 200) {
        throw new Error('Error getting app-only access token: ', `${response.status} - ${response.statusText}`);
      } else {
        return response.json();
      }
    });
    // Update connection information
    office365Connection = {
      accessToken: response.access_token,
      tokenType: response.token_type,
      expiresIn: response.expires_in,
      expiresAt: new Date().getTime() + response.expires_in * 1000,
    };
    return office365Connection.access_token
  } catch (error) {
    console.error('Error getting app-only access token:', error);
    throw error;
  }
}
