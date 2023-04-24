import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import { ValidatedMethod } from 'meteor/mdg:validated-method';

// if(Meteor.isServer){
//   require('/imports/logger/server/publish');
// }

// Collection for logging
export const Logs = new Mongo.Collection('logs');

// logging levels
const logLevels = {
  trace:    1,
  debug:    2,
  info:     3,
  warning:  4,
  error:    5,
  fatal:    6,
};

// Method for logging from the client
// not to be called directly, but through the client side log function
// args should include at least:
// args = {
//   clientTimeStamp: Date.now(),
//   clientDateTime: (new Date).toUTCString(),
//   level: 'info',
//   message: 'message'
// }
export const logMethod = new ValidatedMethod({
  name: 'logMethod',
  // TODO check authorizations
  validate: null,
  run(args) {
    if (this.isSimulation){
    } else {
      // add server side information
      args.serverTimeStamp = Date.now();
      args.serverDateTime = (new Date).toUTCString();
      if (this.connection) {
        // add client information
        args.remoteCall = true;
        args.remoteIP = this.connection.clientAddress;
        const uId = Meteor.userId();
        if (uId) {
          // add user information
          args.userId = uId;
          args.userLogin = Meteor.users.findOne({_id: uId}).username;
        }
      }
      Logs.insert(args);
    }
  },
});

// Method to clear all logs
export const clearLogs = new ValidatedMethod({
  name: 'clearLogs',
  validate: null,
  run(filter) {
    // TODO check if user is a super admin
    if (Meteor.userId()) {
      Logs.remove(filter);
    }
  },
});
