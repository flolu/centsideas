# 👥 Users Service

## API

### Endpoints

> All those endpoints are only accessible through the `gateway` service

| Method | Endpoint                              |
| ------ | ------------------------------------- |
| POST   | /users/login                          |
| POST   | /users/confirm-sign-up?token=XXX      |
| POST   | /users/authenticate?token=XXX         |
| PUT    | /users/:id                            |
| PUT    | /users/confirm-email-change?token=XXX |

### Examples

#### Login

```
curl --header "Content-Type: application/json" --request PUT --data '{"email":"example@email.com"}' http://localhost:3000/users/login
```

#### Update user

```
curl --header "Content-Type: application/json" --request PUT --data '{"username":"new_username"}' http://localhost:3000/users/id
```
