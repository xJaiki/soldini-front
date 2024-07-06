import React from 'react';

const Home = () => {
    return (
        <><button onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}>Logout</button>
            <div>
                <h2>Home Page</h2>
                <p>Welcome to the Soldini application!</p>
            </div>
        </>
    );
};

export default Home;
