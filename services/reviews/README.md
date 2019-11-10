# ⭐ Reviews Service

## Environment Variables

> Example for local development with docker-compose

```
NODE_ENV=dev
REVIEWS_DATABASE_URL=mongodb://reviews-event-store:27017
```

## API

### Endpoints

> All those endpoints are only accessible through the `gateway` service

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | /reviews                |
| PUT    | /reviews/:id            |
| PUT    | /reviews/save-draft/:id |
| PUT    | /reviews/publish/:id    |
| PUT    | /reviews/unpublish/:id  |
| GET    | /reviews                |
| GET    | /reviews/:ideaId        |

### Examples

#### Create review

```
curl --header "Content-Type: application/json" --request POST --data '{"ideaId":"some-id"}' http://localhost:3000/reviews
```

#### Save draft

```
curl --header "Content-Type: application/json" --request PUT --data '{"content":"This is an draft", "scores":{ "control":5, "entry":4, "need":3, "time":2, "scale":1 }}' http://localhost:3000/reviews/save-draft/id
```
