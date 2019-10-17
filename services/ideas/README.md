# 💡 Ideas Service

## Environment Variables

> Example for local development with docker-compose

```
NODE_ENV=dev
IDEAS_DATABASE_URL=mongodb://ideas-event-store:27017
```

## API

### Endpoints

> All those endpoints are only accessible through the `gateway` service

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | /ideas                  |
| PUT    | /ideas/:id              |
| PUT    | /ideas/save-draft/:id   |
| PUT    | /ideas/commit-draft/:id |
| PUT    | /ideas/publish/:id      |
| PUT    | /ideas/unpublish/:id    |
| DELETE | /ideas/:id              |
| GET    | /ideas                  |
| GET    | /ideas/:id              |

### Examples

#### Create idea

```
curl --data "" http://localhost:3000/ideas
```

#### Get all ideas

```
curl http://localhost:3000/ideas
```

#### Get idea by id

```
curl http://localhost:3000/ideas/id
```

#### Save draft

```
curl --header "Content-Type: application/json" --request PUT --data '{"title":"This is an draft"}' http://localhost:3000/ideas/save-draft/id
```

#### Commit draft

```
curl --header "Content-Type: application/json" --request PUT http://localhost:3000/ideas/commit-draft/id
```

#### Update idea

```
curl --header "Content-Type: application/json" --request PUT --data '{"title":"This is an updated title"}' http://localhost:3000/ideas/id
curl --header "Content-Type: application/json" --request PUT --data '{"description":"This is an updated description"}' http://localhost:3000/ideas/id
```

#### Publish idea

```
curl --header "Content-Type: application/json" --request PUT http://localhost:3000/ideas/publish/id
```

#### Unpublish idea

```
curl --header "Content-Type: application/json" --request PUT http://localhost:3000/ideas/unpublish/id
```

#### Delete idea

```
curl --header "Content-Type: application/json" --request DELETE http://localhost:3000/ideas/id
```
