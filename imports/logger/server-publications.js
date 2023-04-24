import { Meteor } from 'meteor/meteor';
import { Logs } from './both-methods.js';

// Publish logs
// TODO: publish only for admin users
Meteor.publish('logs', function (options) {
  if (this.userId) {
    return Logs.find({}, options);
    // return Logs.find({}, options);
  } else {
    this.ready();
  }
});

