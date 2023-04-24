import {Meteor} from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col, Container} from 'react-bootstrap';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showReset, setShowReset] = useState(false);

  const handleLogin = (event) => {
    event.preventDefault();
    Meteor.loginWithPassword(email, password, (error) => {
      if (error) {
        setError(error.reason || 'Unknown error');
      }
    });
  };

  const handleResetRequest = (event) => {
    event.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    Accounts.forgotPassword({ email }, (error) => {
      if (error) {
        setError(error.reason || 'Unknown error');
      } else {
        setShowReset(true);
      }
    });
  };
  
  function loginWithOffice365() {
    Meteor.loginWithOffice365({}, (err) => {
      if (err) {
        console.error('Error logging in with Office 365:', err);
      } else {
        console.log('Successfully logged in with Office 365');
      }
    });
  }

  return (
    <Container style={{ maxWidth: '400px' }}>
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {showReset ? (
        <Alert variant="success">
          Check your email for a password reset link.
        </Alert>
      ) : (
        <Form onSubmit={handleLogin}>
          <Row>
            <Col sm="4">
              <Form.Label>Email address</Form.Label>
            </Col>
            <Col sm="8">
              <Form.Group controlId="formEmail">
                <Form.Control
                  placeholder="Enter email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm="4">
              <Form.Label>Password</Form.Label>
            </Col>
            <Col sm="8">
              <Form.Group controlId="formPassword">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
          <Col>
              <Button variant="primary" type="submit">
                Login
              </Button>
            </Col>
            <Col>
              <Button variant="primary"
              onClick={loginWithOffice365}>
                MS365
              </Button>
            </Col>
            <Col sm={{ span: 8 }} className="text-right">
              <Button
                variant="link"
                onClick={handleResetRequest}
                className="float-right"
              >
                Forgot password?
              </Button>
            </Col>
          </Row>
        </Form>      
        )}
    </Container>
  );
};
