<h1 align="center">Chat App</h1>
<p align="center">Creating a chat app applying <b>clean code</b> and <b>clean architecture!</b></p>
<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.io-010101?&style=for-the-badge&logo=Socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white" />
</p>

## Clean Architecture
![Clean architecture](assets/CleanArchitecture.jpg)

**Clean architecture** is a software design philosophy that separates the elements of a design into ring levels. An important goal of clean architecture is to provide developers with a way to organize code in such a way that it encapsulates the business logic but keeps it separate from the delivery mechanism. [More here](https://www.techtarget.com/whatis/definition/clean-architecture)

## Layers
You can read more about layers [here](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).

### Entity
Entities encapsulate Enterprise wide business rules. An entity can be an object with methods, or it can be a set of data structures and functions. It doesn’t matter so long as the entities could be used by many different applications in the enterprise.
- [Message](backend/src/entities/message.ts);
- [User](backend/src/entities/user.ts).

### Use Cases
The software in this layer contains application specific business rules. It encapsulates and implements all of the use cases of the system. These use cases orchestrate the flow of data to and from the entities, and direct those entities to use their enterprise wide business rules to achieve the goals of the use case.
- [Create user use case](backend/src/use-cases/users/create-user.ts);
- [Create message use case](backend/src/use-cases/messages/create-message.ts);
- [Login user use case](backend/src/use-cases/users/login-user.ts);
- etc.

### Interface Adapters
The software in this layer is a set of adapters that convert data from the format most convenient for the use cases and entities, to the format most convenient for some external agency such as the Database or the Web. It is this layer, for example, that will wholly contain the MVC architecture of a GUI. The Presenters, Views, and Controllers all belong in here. The models are likely just data structures that are passed from the controllers to the use cases, and then back from the use cases to the presenters and views.
- [MongoDB Adapter](backend/src/repositories/mongodb);
- etc.

### Frameworks and Drivers.
The outermost layer is generally composed of frameworks and tools such as the Database, the Web Framework, etc. Generally you don’t write much code in this layer other than glue code that communicates to the next circle inwards.
- [Express](https://expressjs.com/pt-br/);
- [Socket.io](https://socket.io/);
- etc.

## Show your support
Give this project a ⭐ if you like to support me to make more projects like this!