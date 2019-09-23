# github-profile-summary
Use this component to show a summary of your github with cool design😎
![DiegoVictor](https://i.ibb.co/fx39pYz/github-profile-summary.png)

The project is still in development, so if you find something wrong email me 
[diegovictorgonzaga@gmail.com](diegovictorgonzaga@gmail.com).

__Should I make it a npm package? (To facilitate to embed it into pages) 🤔🤔__

# Running
Clone the repo, then, run the fake server:
```
$ yarn json-server github.json --port=3333 --routes routes.json
```
> If you want change the server port just remember to update in the `src/index.js` too.

Then start the ReactJS server:

```
$ yarn start
```

# Use Github API
To use real data just change the axios `baseURL` in the `src/index.js` to `https://api.github.com`, but remember that Github 
limits no authenticated requests to 60 per hour, so make a cache is a good idea (this is the reason to the fake server exists).

Remember to change the user name too, in the last line of `src/index.js` change from `DiegoVictor` to your user name _
