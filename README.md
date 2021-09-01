# Azure AD B2C Password Reset demo of bug / undefined behavior

## FIX INFORMATION

The below config, added in TrustFrameworkExtensions file, fixed the issue.

Technical Profile

```xml
<TechnicalProfile Id="SessionManagement">
    <DisplayName>Session Management Call</DisplayName>
    <Protocol Name="Proprietary" Handler="Web.TPEngine.Providers.ClaimsTransformationProtocolProvider, Web.TPEngine, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null" />
    <OutputClaims>
        <OutputClaim ClaimTypeReferenceId="objectId" />
    </OutputClaims>
    <UseTechnicalProfileForSessionManagement ReferenceId="SM-AAD" />
</TechnicalProfile>
```

Update to PasswordReset SubJourney

```xml
<SubJourney Id="PasswordReset" Type="Call">
<OrchestrationSteps>
    <!-- Validate user's email address. -->
    <OrchestrationStep Order="1" Type="ClaimsExchange">
        <ClaimsExchanges>
            <ClaimsExchange Id="PasswordResetUsingEmailAddressExchange" TechnicalProfileReferenceId="LocalAccountDiscoveryUsingEmailAddress" />
        </ClaimsExchanges>
    </OrchestrationStep>

    <!-- Connect to SSO Session provider -->
    <OrchestrationStep Order="2" Type="ClaimsExchange">
        <ClaimsExchanges>
            <ClaimsExchange Id="PasswordResetSessionManagement" TechnicalProfileReferenceId="SessionManagement" />
        </ClaimsExchanges>
    </OrchestrationStep>

    <!-- Collect and persist a new password. -->
    <OrchestrationStep Order="3 " Type="ClaimsExchange">
        <ClaimsExchanges>
            <ClaimsExchange Id="NewCredentials" TechnicalProfileReferenceId="LocalAccountWritePasswordUsingObjectId" />
        </ClaimsExchanges>
    </OrchestrationStep>
</OrchestrationSteps>
</SubJourney>
```

See https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-reference-sso

The PasswordReset SubJourney was not interacting with the SM-AAD Technical Profile.

Thanks to the responder on this issue https://github.com/azure-ad-b2c/samples/issues/274

## SUSPECTED BUG INFORMATION

Please also see

https://github.com/azure-ad-b2c/samples/issues/274

https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/4006

1. Using the included client with MSAL 2, and the included Custom Policy XML (LocalAccounts StarterPack + Password Reset tutorial from Microsoft)
2. Reset Password from Sign Up / Sign In screen, using the "forgot your password?" link
3. when redirected to the client app, immediately click on Edit Profile
4. EXPECTED: see the "Edit Profile" screen
5. BUG: see a sign in screen, must sign in with new password before seeing Edit Profile
6. CLARIFY: This seems to suggest that a user exiting the Password Reset is not fully logged in or authenticated.


## INSTRUCTIONS TO USE THIS REPO

1. Replace 'yourtenant' with Azure AD B2C Tenant name in all Custom Policy / XML files

2. Replace ProxyIdentityExperienceFrameworkAppId and IdentityExperienceFrameworkAppId with appropriate values in TrustFrameworkExtensions.xml file

(as described here: https://docs.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-user-flows?pivots=b2c-custom-policy#add-application-ids-to-the-custom-policy)

3. Upload the Custom Policy XML files to your Azure AD B2C Tenant

4. Update values in MSAL_2_client_app/settings.js

5. Serve the index.html file on a local host, using a utility like https://www.npmjs.com/package/http-server

(This can be accomplished by...)

npm install -g http-server

cd MSAL_2_client_app

http-server -p 3000 

(port must match authConfig.js RedirectUri, and an App Registration on the AADB2C Tenant)

5. Visit the served page locally in a browser, for example localhost:3000


## INFORMATION ABOUT FILES IN THIS REPO

### AAD_B2C_custom_policy_xml

This folder contains Custom Policy XML files from this repo 

https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack

LocalAccounts versions were used.


TrustFrameworkExtensions.xml and SignUpOrSignin.xml were updated following this tutorial for Password Reset

https://docs.microsoft.com/en-us/azure/active-directory-b2c/add-password-reset-policy?pivots=b2c-custom-policy

CustomSignUpOrSignIn User Journey was added, and set as the DefaultUserJourney of SignUpOrSignin Relying Party.


### MSAL_2_client_app

This folder contains a minimal client app to interact with the Custom Policy files, when uploaded to an Azure AD B2C Tenant.

(Similar to this repo: https://github.com/Azure-Samples/ms-identity-javascript-v2/tree/master/app)

