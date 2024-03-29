# LSOAR
Levason's Searchable Ordered Article Resource (LSOAR) is a searchable database of articles formatted using markdown.The articles cover over 100 topics in 100 categories with search functionality powered by [Lunr.js](https://lunrjs.com/) and most of the articles have been generated by the OpenAI Api (GPT3.5 Turbo).

### The articles are structured in JSON:

```json
{
  "metadata": {
    "title": "Example Article Title",
    "length": 800,
    "generated_by": "gpt-3.5-turbo",
    "timestamp": "2023-09-05T06:19:17.979Z"
  },
  "article": "This is an example of an article content."
}
```

### The user enters a query:

![Search for keywords/phrase](src/assets/images/Images/prev1.png "Search for keywords/phrase")

### View the results:

![View the results](src/assets/images/Images/prev2.png "The resulting array of articles indexed by lunrjs is displayed:")


### View the article:

![View the article](src/assets/images/Images/prev3.png "View the article")


### Usage:

- You have to start the server first by navigating to the root of `src/pages/index/app/database` where the  `server.js` in the terminal and calling:

```js
node server.js
```

- After the database server has been started you need to initiate the webpack dev server by navigating to the root of LSOAR and calling:

```js
npx webpack serve
```
