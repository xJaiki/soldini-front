import React, { useState } from 'react';
import { Button, Input, Tabs, Tab, Card, CardBody } from '@nextui-org/react';
import Welcome from '../../welcome.svg';

const Login = () => {
  const apiUrl = process.env.REACT_APP_DEV_API;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch(`${apiUrl}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const data = await response.json();
    if (data.access) {
      localStorage.setItem('token', data.access);
      window.location.href = '/home';
    } else {
      alert('Invalid credentials');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch(`${apiUrl}/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        password2,
        email,
        first_name: firstName,
        last_name: lastName,
      }),
    });
    const data = await response.json();
    if (data.token) {
      window.location.href = '/login';
    } else {
      console.log('Registration failed');
    }
  };

  return (
    <div className="grid grid-cols-5 h-screen">
      <div className="col-span-3 flex flex-col items-center justify-between relative z-10">
        <h1 style={{color:'#79a471'}} className="py-10 text-5xl font-bold">💸 Soldini</h1>
        <img src={Welcome} alt="welcome" className="object-bottom z-0" />
      </div>
      <div style={{backgroundColor:'#79a471'}} className="col-span-2 flex items-start justify-center p-10">
        <Card className="w-full max-w-md relative top-20">
          <Tabs aria-label="Options" className="w-full p-4 justify-center">
            <Tab key="login" title="Login">
              <CardBody className="overflow-y-auto">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 ">Username:</label>
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 ">Password:</label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      fullWidth
                    />
                  </div>
                  <Button type="submit" color="primary" auto>
                    Login
                  </Button>
                </form>
              </CardBody>
            </Tab>
            <Tab key="register" title="Register">
              <CardBody className="overflow-y-auto">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 ">Username:</label>
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 ">Password:</label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 ">Confirm Password:</label>
                    <Input
                      type="password"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 ">Email:</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 ">First Name:</label>
                    <Input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      fullWidth
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 ">Last Name:</label>
                    <Input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      fullWidth
                    />
                  </div>
                  <Button type="submit" color="primary" auto>
                    Register
                  </Button>
                </form>
              </CardBody>
            </Tab>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
