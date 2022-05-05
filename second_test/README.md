## Solutions Engineer's second test
Congratulations on passing the first test!

Now, it is time to show your programming qualities.

## The role

As a Solution Engineer, one of the skills that you’ll exploit the most is the capacity of coming up with a solution (pun intended) that is reliable, scalable, secure and basically, a solution that follows typical software development principles.
Being able to deliver a project with very little guidance is also a skill we are looking for.
## Duration of the test

You should be spending from 2 to 4 hours to finish this test.

## Description
Being able to track the capacity that a courier has in their vehicle left at any time is crucial. Our Dispatcher (the brain that optimizes the delivery routes) needs this input so that it can understand if a courier has room left or not in their vehicle.

## Main Goal

Write an API that will be queried by two services: the Stuart API and the Dispatcher.

The Stuart API will need to keep in sync the list of Couriers in the platform as well as their max capacity (in liters).
```bash
curl -X POST http://localhost:3000/couriers --data '
{
  "id": 1234,
  "max_capacity": 45
}'
```
The Dispatcher will need to query this API to find out which couriers do have available space.
```bash
curl -X GET http://localhost:3000/couriers/lookup --data '
{
  "capacity_required": 45
}'
```
Write the API that will allow adding, removing and updating couriers' capacities, and that will let lookup a list of couriers whose capacity is greater or equal to the one required.

## Bonus Goals

In case you are feeling going deeper, here are some proposed bonus goals. Pick any that you want or add your own.

* Courier capacities vary as they pick and deliver packages. Allow the API to update a courier's available capacity at any moment as they are assigned new packages. => **Done! Check below (in how to run the app) which endpoint can be used for that.**

* We plan to run this service in the AWS environment. Prepare this API to be deployed. => **Although I haven't added the exact configuration for AWS (task files with hardware specs), it would be relative easy to deploy in AWS using containers because I developed the application using Docker and Makefile .**

* Come up with a smart and scalable output schema that is future-proof. Explain why you think it is so. => **I think I don't quite understand what this question is referring to. If it means some way of document the API, I would use some tool like Open API**


* How about race conditions? How would you avoid race conditions if a lookup is being executed and a capacity update comes? => **Even though MongoDB ensures atomic write operations, if I had to implement some type of specific logic to ensure that there are no race conditions, I would try to find a solution that delegates such logic to the application layer (use cases), using methods referring to transactions in the repository interface. In this way, no matter what persistence tool we use, our business logic will make sure that the infraestructure layer have to implement the logic for transactions to avoid race conditions**

## Notes
* How do we run this API? Please provide the right amount of documentation in any format you prefer.

### Build Docker image
```
make build
```

### OPTIONAL. Install dependencies (to have dependencies in local and get types in the IDE)
```
npm install
```

### Install dependencies (to execute tests & run the app)
```
make install
```


### Run Backend
```
make start-local-couriers-backend
```

By default it will be available in http://localhost:3000 (it can be changed editing the `.env` files)


#### Create Courier
```bash
curl -X POST http://localhost:3000/couriers -H "Content-Type: application/json" --data '
{
  "id": "3314b91d-d91f-4e54-a6b3-ef80196b1087",
  "max_capacity": 45
}'
```

#### Update Courier max capacity
```bash
curl -X PUT http://localhost:3000/couriers/3314b91d-d91f-4e54-a6b3-ef80196b1087 -H "Content-Type: application/json" --data '
{
  "max_capacity": 60
}'
```

#### Update Courier current capacity (doing a pickup)
```bash
curl -X PATCH http://localhost:3000/couriers/3314b91d-d91f-4e54-a6b3-ef80196b1087 -H "Content-Type: application/json" --data '
{
  "operationType": "pickup",
  "packageVolume": 10
}'
```

#### Update Courier current capacity (doing a delivery)
```bash
curl -X PATCH http://localhost:3000/couriers/3314b91d-d91f-4e54-a6b3-ef80196b1087 -H "Content-Type: application/json" --data '
{
  "operationType": "delivery",
  "packageVolume": 10
}'
```

#### Delete Courier
```bash
curl -X DELETE http://localhost:3000/couriers/3314b91d-d91f-4e54-a6b3-ef80196b1087 -H "Content-Type: application/json"
```

#### Get Couriers by capacity
```bash
curl -X GET http://localhost:3000/couriers/lookup -H "Content-Type: application/json" --data '
{
  "capacity_required": 45
}'
```


### Tests

Run all tests
```
make test
```

Run unit tests
```
make test-unit
```

Run E2E tests
```
make test-e2e
```


* Show off! We love Typescript. We love TDD. We love unit tests. We love design patterns. We love engineering!

#### Showing off! 🚀

- [x] TypeScript
- [x] TDD
- [x] Unit tests
- [x] Integration tests
- [x] E2E tests
- [x] Hexagonal Architecture
- [x] DDD
- [x] Docker
- [x] Makefile

* If you were to have more time, what would you do? Briefly explain what could be improved.

- [x] Create a database implementation for the repositories (instead of InMemory). For example, I would have use PostgreSQL or MongoDB
- [ ] Configure Cucumber or another Gherkin tool to run acceptance tests with business language
- [ ] Use some library for dependency-injection (to avoid manual and duplicated instantiation of dependencies)
- [ ] Finish implementing Criteria pattern (limit, etc)
- [ ] Improve map of Criteria in infraestructure layer


* If you have further questions, don't hesitate asking.