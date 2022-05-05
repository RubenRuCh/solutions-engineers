IMAGE_NAME=stuart-solutions-engineer-second-test
COURIERS_BACKEND_CONTAINER_NAME=couriers_backend
ENV_FILE_DEV=.env.dev
ENV_FILE_PROD=.env.prod
ENV_FILE_TEST=.env.test

setTestEnv:
	sudo cp $(ENV_FILE_TEST) .env

setDevEnv:
	sudo cp $(ENV_FILE_DEV) .env

setProdEnv:
	sudo cp $(ENV_FILE_PROD) .env

# Build Docker image
.PHONY: build
build:
	@docker build -t $(IMAGE_NAME):dev .

# Install dependencies
install: setDevEnv
	@docker-compose run --rm $(COURIERS_BACKEND_CONTAINER_NAME) npm install $(ARGS)
	@docker-compose run --rm $(COURIERS_BACKEND_CONTAINER_NAME) chown -R node:node .

# Run tests
test:
	@docker-compose run --rm $(COURIERS_BACKEND_CONTAINER_NAME) npm run test

test-unit: setTestEnv
	@docker-compose run --rm $(COURIERS_BACKEND_CONTAINER_NAME) npm run test:unit

test-unit-watch: setTestEnv
	@docker-compose run --rm $(COURIERS_BACKEND_CONTAINER_NAME) npm run test:unit:watch

test-e2e: setTestEnv
	@docker-compose run --rm $(COURIERS_BACKEND_CONTAINER_NAME) npm run test:e2e

test-e2e-watch: setTestEnv
	@docker-compose run --rm $(COURIERS_BACKEND_CONTAINER_NAME) npm run test:e2e:watch


# Start local Couriers - Backend
start-local-couriers-backend: setTestEnv
	@docker-compose run --rm --service-ports $(COURIERS_BACKEND_CONTAINER_NAME) npm run dev:couriers:backend


# Start dev Couriers - Backend
start-dev-couriers-backend: setDevEnv
	@docker-compose run --rm --service-ports $(COURIERS_BACKEND_CONTAINER_NAME) npm run dev:couriers:backend


# Start production Couriers - Backend
start-prod-couriers-backend: setProdEnv
	@docker-compose run --rm --service-ports $(COURIERS_BACKEND_CONTAINER_NAME) npm run start:couriers:backend


# Clean containers
clean:
	@docker-compose down --rmi local --volumes --remove-orphans

# Lint
lint-check:
	@docker-compose run --rm --service-ports $(COURIERS_BACKEND_CONTAINER_NAME) npm run lint

lint-fix:
	@docker-compose run --rm --service-ports $(COURIERS_BACKEND_CONTAINER_NAME) npm run lint:fix
	@docker-compose run --rm --service-ports $(COURIERS_BACKEND_CONTAINER_NAME) chown -R node:node .