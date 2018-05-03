# Daedalus
A deployable API server using express.js, crystalys, and demon-edge!

The Daedalus tool suite will help you hit the ground running with your new Dota 2 related project!

Set up is painless, and the whole tool suite is easy to use! (At least I like to think)

The other parts of this tool suite, [crystalys](https://github.com/Flascher/crystalys) and [demon-edge](https://github.com/Flascher/demon-edge) are there to make your life easier as well!

In order to get Daedalus set up, there are a few quick steps you need to follow:

## Step 0: Pre-requisites

All you need in order to use this tool suite is:

* node
* npm
* git

## Step 1: Obtain a Steam API key

You can grab your own API key from Steam [here](https://steamcommunity.com/dev/apikey).

Just sign in to steam, and click on the button to have it generated for you!


## Step 2: Install and configure daedalus-server

Run `git clone https://github.com/Flascher/daedalus.git` and you've now got yourself a copy!  
To configure daedalus-server open up the daedalus folder, then edit config.json.

You should see these defaults:

```json
{
  "apiKey": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "domain": "0.0.0.0",
  "port":   "80",
  "corsEnabled": false
}
```

The apiKey should be replaced with your API key you got in Step 1.  
The domain and port are meant to tell daedalus where its running (these are just passed into Express.js app.listen function)  
The corsEnabled key is `false` by default, but if you intend to connect to your server from a separate domain, you'll need to make this `true`.  

## Step 3: Start the server

You can accomplish this one of two ways:

* `cd` into the daedalus root folder and run `npm start`
* Run `node path/to/daedalus/src/index.js`

Congrats! You're now running a daedalus-server that will act as a proxy to Valve's Web API!

## Ok, but why?

One of the agreements you accepted with Valve when you signed up for an API key is that you would not distribute that API key to anyone else. This means that if you make calls to their API server from the client side, you are exposing your API key to users and thus breaking their agreement.

Plus I think making some function calls like:

```javascript
DemonEdge.api.Match.GetMatchHistory.heroID(1).matchesRequested(30).sendRequest();
```

is much easier than hard coding a string to `https://api.steampowered.com/IDOTA2Match_570/GetMatchHistory/v1?key=xxxx&hero_id=1&matches_requested=30`, but maybe that's just me.

## Bugs

As of right now, there are no currently known bugs within the Daedalus tool suite, but **please**, if you find any bugs in any part of the tool suite, create an issue on the corresponding tool's github repo, or send me an email at flascherdev@gmail.com.

Thanks so much, and I hope you enjoy the Daedalus tool suite!
