import React from 'react';
import { Hello } from '/imports/ui/Hello.jsx';
import { LoginForm } from '/imports/ui/LoginForm.jsx';
import { UserInfo } from '/imports/ui/UserInfo.jsx';
import { GetToken } from '/imports/ui/ListFolders.jsx';
import { LogButton, LogsTable } from '/imports/logger/client-ui.jsx';

export const App = () => (
  <div>
    <h1>Welcome to Meteor!</h1>
    <LoginForm/>
    <UserInfo/>
    <GetToken/>
    <Hello/>
    <LogButton/>
    <LogsTable/>
  </div>
);
