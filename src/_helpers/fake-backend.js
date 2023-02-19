export { fakeBackend };

function fakeBackend() {
    let users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];
    let realFetch = window.fetch;
    window.fetch = function (url, opts) {
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(handleRoute, 500);

            function handleRoute() {
                switch (true) {
                    case url.endsWith('/users/authenticate') && opts.method === 'POST':
                        return authenticate();
                   
                    default:
                        // pass through any requests not handled above
                        return realFetch(url, opts)
                            .then(response => resolve(response))
                            .catch(error => reject(error));
                }
            }

            // route functions

            function authenticate() {
                const { username, password } = body();
                const user = users.find(x => x.username === username && x.password === password);

                if (!user) return error('Username or password is incorrect');

                return ok('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJTZXNzaW9uSWQiOiJvcmczMDljNmI0YV9zaW1vbkBjZW1hbnRpY2EuY29tX19fMTExMjE5ODJfOTRiMTQwMmUtMWQ5NS00MDg3LTlhMjUtM2JkMzc1ZjY2NmJkIiwiVXNlcklkIjoiNGQwZTFlZGQtOTViMS1lYzExLTk4NDAtMDAwZDNhYmY1YmQ4IiwiVXNlckVtYWlsIjoic2ltb25AY2VtYW50aWNhLmNvbSIsIlVzZXJGdWxsTmFtZSI6IlNpbW9uIEJlbmhhbW91IiwiVXNlclR5cGUiOiIxMDAwMDAwMDAiLCJleHAiOjE2ODQ1OTE5MDksImlzcyI6ImNlbWFudGljYS5jb20iLCJhdWQiOiJjZW1hbnRpY2EuY29tIn0.WHT6SI1TDeaGyJMNoSvxsXo72rH8K7w_YKg3tRMpEk8');
            }


            // helper functions

            function ok(body) {
                resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(body)) })
            }

            function unauthorized() {
                resolve({ status: 401, text: () => Promise.resolve(JSON.stringify({ message: 'Unauthorized' })) })
            }

            function error(message) {
                resolve({ status: 400, text: () => Promise.resolve(JSON.stringify({ message })) })
            }

            function isAuthenticated() {
                return opts.headers['Authorization']=== 'Bearer fake-jwt-token';
                
            }

            function body() {
                return opts.body && JSON.parse(opts.body);    
            }
        });
    }
}
