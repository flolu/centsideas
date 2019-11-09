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
