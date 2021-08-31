// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new msal.PublicClientApplication(msalConfig);

let username = "";

/**
 * A promise handler needs to be registered for handling the
 * response returned from redirect flow. For more information, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/acquire-token.md
 */
myMSALObj.handleRedirectPromise()
    .then(handleResponse)
    .catch((error) => {
        console.error(error);
    });


function selectAccount() {

    /**
     * See here for more information on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */

    const currentAccounts = myMSALObj.getAllAccounts();

    if (currentAccounts.length < 1) {
        return;
    } else if (currentAccounts.length > 1) {
       
        /**
         * Due to the way MSAL caches account objects, the auth response from initiating a user-flow
         * is cached as a new account, which results in more than one account in the cache. Here we make
         * sure we are selecting the account with homeAccountId that contains the sign-up/sign-in user-flow, 
         * as this is the default flow the user initially signed-in with.
         */
         const accounts = currentAccounts.filter(account =>
            account.homeAccountId.toUpperCase().includes(SIGNUP_SIGNIN_POLICY)
            &&
            account.idTokenClaims.iss.toUpperCase().includes(SIGNUP_SIGNIN_POLICY)
            &&
            account.idTokenClaims.aud === msalConfig.auth.clientId 
            );

        if (accounts.length > 1) {
            // localAccountId identifies the entity for which the token asserts information.
            if (accounts.every(account => account.localAccountId === accounts[0].localAccountId)) {
                // All accounts belong to the same user
                showLoggedInState(accounts[0].name);
            } else {
                // Multiple users detected. Logout all to be safe.
                signOut();
            };
        } else if (accounts.length === 1) {
            showLoggedInState(accounts[0].name);
        }

    } else if (currentAccounts.length === 1) {
        showLoggedInState(currentAccounts[0].name);
    }
}

function handleResponse(response) {
    if (response !== null) {
        username = response.account.name;
        showLoggedInState(username);
    } else {
        selectAccount();
    }
}

function signIn() {
    myMSALObj.loginRedirect();
}

function signOut() {
    myMSALObj.logoutRedirect();
}

function editProfile() {
    myMSALObj.loginRedirect(EDIT_PROFILE_REQUEST);
}

