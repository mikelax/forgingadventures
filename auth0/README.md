# Auth0 Overview

[Auth0](https://auth0.com/) is used for the authentication and authorization service for forging adventures (FA). This README will cover some of the configuration involved and source code that is uploaded into the Auth0 dashboard. 

# Environments

There are two tenants, or environments created for FA. `forgingadventures-staging` will be used for the development and testing. `forgingadventures` is the main production environment. They are currently totally isolated, so this means that any config changes made in one, will need to be manually made in the other. 

## Staging Environment

This environment will currently be used as both a test environment and for local development. There will need to be a change made to one of the configuration attributes used in the Rules below. 

## APIs and Clients

Within the world of Auth0 (and OAuth2), there exists the concepts of APIs and Clients. Both of these must be configured for the application. 

Client - This is the object that represents the client, application, or interface the User is interacting with and using. IE. it can be an SPA, Native App, etc. 

API - This is the API, or set of Resources that the User must be authorized to use. After receiving an `access_token` after login, it will be sent in the Authorization header to all API requests to validate the request. 

Also important is the difference between ID Tokens, and Access Tokens. These are the main two we will be using in our application, though there exist other types within Auth0 world. You can read in more detail about them [here on Auth0](https://auth0.com/docs/tokens).

ID Token (id_token)- Contains the user profile attributes. ie. name, email address
Access Token (access_token) - a token that can be used to authorize to an API.

# Rules

Currently the source for all Rules are checked in here under the Rules folder. 
Github issue #10 covers the work to integrate automated deployments of Rules based on commits to Github. See [this Auth0 tutorial](https://auth0.com/docs/extensions/github-deploy), one thing to note is that this will require moving the Rules source to a new repo, or moving the folder rules to be a top-level folder.

API_BASE_URL - for local development you can use [localtunnel](https://localtunnel.github.io/www/) to expose your localhost API to Auth0. 

SHARED_SECRET - symetric shared key to use for calling FA API. It should match the auth0.sharedSecret config attribute.

AUTH_EXT_BASE_URL - The API URL for the Auth0 [authorization extension API](https://auth0.com/docs/api/authorization-extension?http#find-your-extension-url) (US-Wes).

AUTH_EXT_TOKEN_URL - The API URL to get an API Access Token. ie. tenant name /oauth/token

AUTH_EXT_CLIENT_ID - The "Auth Ext" Client ID

AUTH_EXT_CLIENT_SECRET - The "Auth Ext" Client Secret

## auth0-authorization-extension

This Rule is automatically created by enabling and configuring the Auth0 Authorization extension. The basic function is to determine what "extra" attributes will be added to the User context. Currently it is set up to include the `roles` and `permissions` defined for the given User.

## Configure User After Sign up

This Rule will add the newly signed up User to the correct "User" Role so they have the necessary Permissions once they are redirected back to the application. 

This Rule only performs logic after a Sign up, after a regular login it is a no-op. It makes use of the [authorization extension api](https://auth0.com/docs/api/authorization-extension?http#find-your-extension-url).

## Validate Access Token Scopes

This Rule will look at all the requested scopes from the Request, then it will take out any standard [OIDC scopes](http://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims). This is why all scopes defined within Auth0 *should* contain a colon. Based on [this Auth0](https://auth0.com/docs/architecture-scenarios/application/spa-api/part-2#create-a-rule-to-validate-token-scopes) tutorial.

It then gets all the permissions (scopes) assigned to the User based on the Role. It combines these two arrays together and sets the resultant array as the `scope` attribute in the *access_token*. 

## Add Custom Authorization Claims

This Rule adds the list of Auth0 Authorization Roles the User is a memeber of and adds the array to the *id_token*. This array is also available in the initial callback after a call to auth0.parseHash in the `idTokenPayload` attribute (as are all attributes in the id_token). 

## Update Profile with Custom Profile Image

This looks checks to see if the User has uploaded a custom profile image. The standard `picture` attribute can only be changed in a Rule, the data must be stored in the `user_metadata` object. This rules looks for a value here indicating a custom profile image, and if found set its value for the user.picture attribute. 

## Update user profile in Database

This rule will make a POST API call to the FA application. It will sync the Auth0 user profile data to a local `users` database table. This will allow the FA db to use a user_id attribute for all foreign key references for objects to link back to a User. 
