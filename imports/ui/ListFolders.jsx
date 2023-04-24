// List folders from Project site
import React from 'react';
import { Button } from 'react-bootstrap';
import { O365_API_getItemChildren, O365_callGraphApi } from '/imports/office365/common';

Meteor.subscribe('userData');

var url = O365_API_getItemChildren(
  '52ea637f-e10b-4fbd-b819-f4910e5e8cf2',
  '01ZUKCFDQCAZ546SFEV5FZHLNBJBKYIUZR',
  { $top: 5}
)
async function loop() {
  do {
    const data = await O365_callGraphApi(url);
    url = data['@odata.nextLink'];
  } while (url != null);
}

// A button to call getOffice365AccessToken
export const GetToken = () => {
    const handleClick = () => {
      loop();
    }
    return (
        <Button onClick={handleClick}>Get Access Token</Button>
    )
}
