## Solutions Engineer's first test
Welcome! Please spend some time answering the questions you can find below

We do not expect reading code here.
## Questions
* Imagine that you have two classes named "Animal" and "Dog" and you want the class "Dog" to have all the properties and methods from the class "Animal", how would you do it? How is this called? What's the benefit?

> I would do it by making class `Dog` extends `Animal` class (**`extends`** being a reserved world in most of Object Oriented Programming languages). In this way, the class `Dog` will have all the properties and methods from the class `Animal`, and an instance of `Dog` will be considered as an instance of `Animal` (but not the reverse).

> This is called **inheritance**, and it's a very powerful feature of OOP. It's a way to reuse code by sharing behavior and structure between different classes (from parents to children).


* A call to the setTimeout() global method can block the event loop in NodeJS. Is this true or false? Why?

> False. The function `setTimeout()` is part of the timers category that is found within the type of operations of the event loop. The execution of the functions of this category are delayed, by storing them in a queue. Eventually they will be executed in the order they were added to the queue, but only when the system kernel is ready to execute them. 

> This is the reason why the event loop is not blocked when using `setTimeout()`.


* How can you share information between components on a React application? 

> There are many ways of sharing information between components on a React application. The use of one or another will depend of the needs of the use case. 

> ### Static information
> A React application is still a JavaScript application, and the components are still JavaScript objects. If there's some static data in one of the component's file declaration (for example, a object with some URLs that will not change, or an interface definition in case of using TypeScript), it can be shared with other components by using imports / exports.

> ### State
> When we talk about information that will (or can) change throughout the execution of a React application, we talk about `state` (data that represents the current state of the application).

> We have multiple tools or ways to share the state between components. 

> 1) One of them is the `props` object, which is the object that is passed to the component as a parameter. This can propagate, with the child component being able to pass props to other components and so on (this is calling **prop drilling**).

> 2) Other possibility is using the **Context API**, that provides a way to share information between components without having to pass props. This is done storing the state in a context that is provided to the entire tree of components that are wrapped by the provider.

> 3) Other possibility (and one of the most popular ones) is using state management libraries like **Redux**, which is a library that provides a effective way to share information between components without having to pass props and making the state independent no matter where it's used from. This is done storing the state in a Redux store and providing access to read and write operations, usually with the use of **hooks**.

> 4) Talking about **hooks**, they can be a great tool to share information. Maybe not for sharing state that persist between rerenders, but for sharing behavior between components and avoid the duplication of the management of local state.


* How would you protect a REST API against potential SQL Injections?

> One of the strategies I would take to ensure long-term protection would be with a strong definition of the design of the domain from which said REST API is nourished. By pushing business logic into **Value Objects** that avoid it's instantiation when receiving any invalid value, I will secure both the domain and the API (as a side effect). 

> For example, if I have an `UserEmail` VO, the business logic forces us to only consider valid those strings that meet certain rules (like containing an @ symbol, and not containing any special characters). This would be secure the domain (once we're dealing with an instance of `UserEmail`, we won't have to worry about whether it's valid or not: if it's been instantiated, **it's valid**), and as a side effect, the API (by avoiding the instantiation of the VO when receiving an invalid value that contains SQL Injection).

> However, that doesn't mean that I would not also use protections in the infrastructure layer that deal with SQL. For example, I would try to escape the values that are passed to the query before executing it. There are some packages that helps with this, like `node-mysql`.

* What does the level of coupling measure in software development?

> The level of coupling measures at what degree different modules are connected to each other (understanding modules as sections of the software that have differents responsabilities).

> Ideally, the level of coupling should be as low as possible, allowing a module to grow and evolve in different ways without affecting other modules.


* What is CI? Have you used one before?

> It's a shorcut for **Continuous Integration**, a process that allows developers to merge code and run tests in a continuous way, without having to wait for huge unifications of different branches / functionalities.

> Yes, I have used it, before along with **Continuous Delivery** (CD).

* How would you deploy a Node application?

> I would build the application in a Docker container, which is a lightweight virtual machine that can be used to run Node applications in virtually any service that provide hosting services. 

> For personal projects, I would use something like **Heroku** or **Vercel**. For larger projects, I would use **Digital Ocean** or  **AWS**.

* Why do we do code reviews?

> Personally, I think that the exact usage depends on the maturity of the team and the practices that are used.

> For example, when doing pair programming, I think code reviews are a great way for sharing knowledge with other team members that didn't participate in the pair session (for example, if I helped some coworker with a task doing pair programmign and the solution ends implementing a new pattern, the code review will allow other team members to know about it and even discuss if necessary).

> Without pair progamming, to me code reviews are a great place to validate the related **flows**, **ideas** and **designs** of a implementation with the rest of the team.

> Also, they are a great oportunity to share knowledge and experience between developers with different levels of experience, and to see different approaches to the same problem.


* In which files would you store API tokens, passwords, or similars?

> In `.env` files, making sure they are added in `.gitignore` to avoid accidentally committing them.


* What are the benefits of using Typescript?

> 1) Allow detecting and reporting errors at compile time (making almost imposible to find **TypeError** exceptions in production).

> 2) Avoid making low-value tests (for example, no need to write a unit test that check what happens when trying to make an arithmetic operation with a string; if the parameter is typed as a number, there will be a compilation error when trying to call the function with a string).

> 3) Provides great features like **interfaces** (that are necessary for patterns like **Hexagonal Architecture** or some of the **SOLID** principles)

> 4) Help to write auto-documented code (no need to write large comments, since the code explain itself if the types are used in an efficient way).

> Personally, it allows me to sleep better at night.

* Describe with your own words a web socket?

> Web Sockets it's a technology that allows to create a bidirectional channel between devices, making it possible for any of the participants to send and receive information.


* Describe with your own words a GraphQL API.

> It's a technology that allows the server to expose some data, and the client to query that data receiving only the information it asked. In this way, the client don't have to deal with data that doesn't need nor coordinate different calls to group the necessary information.


* How do you keep yourself up-to-date in regards the technologies you do use?

> I consume a lot (and varied) content about technology in my day to day: blogs, YouTube channels, forums, articles, official documentation, courses, books, etc.

> You can take a look at my [website](https://rruger.dev/learning), in which I gather some of the main resources I use to keep learning.