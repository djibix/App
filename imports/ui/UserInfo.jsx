import React from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useTracker } from "meteor/react-meteor-data";

export const UserInfo = () => {
  const user = useTracker(() => {
    var user = Meteor.user();
    console.log("User: ", user);
    return Meteor.user()
  });

  const handleLogout = () => {
    Meteor.logout();
    // setIsLoggedIn(false);
  };

  return (
    <Row>
      {user ? (
        <Col>
          <h3>Hello, {user.username}!</h3>
          <Button onClick={handleLogout}>Log out</Button>
        </Col>
      ) : (
        <Col>
          <h3>Please log in to continue.</h3>
        </Col>
      )}
    </Row>
  );
};
