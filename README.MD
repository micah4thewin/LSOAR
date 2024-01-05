## LSOAR local


### What's next:

- You have to start the server first by navigating to the database directory where the server.js is and running.

```js
node server.js
```

- The next thing you're gonna do is start your webpack dev server up:

```js
npx webpack serve
```

- The next problem we are having now is that the articles aren't found but it know the name so the lunr.js is working fine. I think it might be an issue with the server.js not getting all the articles in the directories. If there was a way to have the server js log how many articles are in each directory. 
