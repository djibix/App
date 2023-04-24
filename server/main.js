import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { Items } from '/imports/base/both/items';
import { log } from '/imports/logger/server-functions';

// import publications
import '/imports/logger/server-publications';
// Publish user info, including services and tokens
Meteor.publish('userData', function () {
  if (this.userId) {
    return Meteor.users.find({ _id: this.userId });
  } else {
    this.ready();
  }
});

// Update service configuration with office365 connection information
if (process.env.MS_CLIENTID && process.env.MS_SECRET && process.env.MS_TENANT) {
  ServiceConfiguration.configurations.upsert({ service: 'office365' }, {
    $set: {
      clientId: process.env.MS_CLIENTID,
      secret: process.env.MS_SECRET,
      tenant: process.env.MS_TENANT,
    }
  })
} else {
  throw new Meteor.Error(500, 'Missing environment variables for Office 365 login');
}


// Deny all client-side updates on the Items collection
Items.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Meteor.startup(() => {
  log('info', 'Meteor server started');
  // If no users exist in the database, create a default user.
  if (Meteor.users.find().count() === 0) {
    const userId = Accounts.createUser({
      username: 'admin',
      password: 'admin',
    });
    Meteor.users.update(userId, { $set: { isAdmin: true } });
  }

});
