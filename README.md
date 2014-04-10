# Instagram API [![Build Status](https://travis-ci.org/cirocosta/instagram-api-js.png?branch=master)](https://travis-ci.org/cirocosta/instagram-api-js)

> Tiny Javascript Instagram API. Let's you create plugable structures which interact with Instagram

![InstaGentleman](http://i.imgur.com/T0J4h3R.png)

## Quick Use

1.  Instantiate an API object

```javascript
var api = new InstagramApi(clientID, redirectURI);
```

2.  Get the auth URL and perform the auth flow

```javascript
var authUrl = api.getAuthUrl();
```

3.  Grab user's stuff!

```javascript
api.user.media('self', acsessToken, function (data) {
    console.log(data.data.images);
});
```

**ps.:** Although this runs on nodejs as well, it is not appropriate for that (unnecessary to use all of the jQuery lib).

### User

For getting user's stuff it is pretty straightforward. You just have to enter `api.user.[METHOD]` and pass it the right params. The magic will happen and your response will come within the param for the callback.

Currently, the allowed methods are:

|  method |               description               |        params        |
| ------- | --------------------------------------- | -------------------- |
| info    | gets the basic user info                | userId, ac token, cb |
| feed    | get the feed of the authenticated       | userId, ac token, cb |
| media   | media of a user (both video and images) | userId, ac token, cb |
| liked*  | what the authenticated user liked in    |                      |
|         | terms of media                          |                      |
| search* | searches for a user by name             |                      |

\* *-> not already finished*.

These methods are all running with JSONP enabled as default. In further releases this will be optional and then not only a success callback will be possible, but all the others that we generally use.


## Testing

Testing is easy. **Just run** `npm test` and, hopefully, everything will go ok.

The testing process is quite interesting as we use [jQuery](http://jquery.com/) in the API application (we intend to use this on the browser without having to worry with compatibility and etc) with a bunch of `$.ajax`. Check at `/tests` what is going on an then you may not need to read the docs (supposing that we did some great tests with an awesome coverage ʘ‿ʘ).

#### resources
*i'm using instagram's free icon provided by Erlen Masson* [here](https://www.iconfinder.com/icons/111202/instagram_icon#size=128) *and the hat provided by [Visual Pharm](http://icons8.com/)*.
