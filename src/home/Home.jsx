import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { userActions } from '_store';

export { Home };

function Home() {
    const dispatch = useDispatch();
    const { user: authUser } = useSelector(x => x.auth);

    useEffect(() => {
        // dispatch(userActions.getAll());

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h1>Hi {authUser?.firstName}!</h1>
            <p>You're logged in with React 18 + Redux & JWT!!</p>
            <h3>Users from secure api end point:</h3>
         
        </div>
    );
}
