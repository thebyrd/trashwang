# Matador 2
This is my thought experiment on the syntax and conventions I would put in a second version of matador.

## Backend
### No More MVC
Matadar 1 was an MVC framework (with helpers and services), but we didn't really use it the way it was intended to be used and instead created our own paradigm of Nodes, Handlers, &amp; Schemas. Instead of spreading application logic between models and controllers, we just created an idea of "Nodes". Any unit of work can be defined as a function and loaded into a [shepherd](https://github.com/Obvious/shepherd) graph which will resolve dependencies and execute nodes asynchronously.

While we currently have "controllers" in our production version of matador 1, all of the application logic should actually be in nodes. To handle requests, I used "handlers", which are methods mapped to routes in the routes.json file that build graph nodes and then call `respond` with the result of the builder. 

### Magic Respond Method
I created `.respond` to remove logic from controllers. As its first argument it takes a path to a template and a second optional argument for the graph node whos result it should pass to the template (otherwise it will just pass the result of all the nodes). If the query param `apiv` is specified then respond will just send the data it would have passed to the template as json.

### Auto Loading Graph Nodes
I changed the syntax for graph nodes (see `/nodes`) so that I could auto load them into the graph when the application starts. The name of the graph node is the name of the method and the parameters it takes have the same names as in the declaration. Currently in production we manually call `graph.add`, but what's actually in the subgraphs we're building is often unclear. It seemed easier to me to just make node methods that called other node methods in plain javascript.

### Schemas are Declarative
A schema is different from a "model" in that you're just specifying information about the attributes in a model. All logic stays in the nodes.

## Frontend
The Front End uses [Turtle](https://github.com/Obvious/turtle), but provides some niceties.

### Sharing Routes
In `routes.json` I used the current matador syntax, except I added a keyword `screen` where the http methods usually are. The value of that key is a screen that is registered on the front end to the given route. so `'/': { 'screen': 'HomeScreen' }` registers the Home Screen to `/` on the front end.

### Shared Templates
TODO

### Variants
TODO

## Development
You can run the app by doing `node server` and for the front end `plovr serve plovr.json`.