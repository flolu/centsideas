# 👥 Users Service

## API

### Endpoints

> All those endpoints are only accessible through the `gateway` service

| Method | Endpoint                    |
| ------ | --------------------------- |
| POST   | /users/login                |
| POST   | /users/confirm-sign-up      |
| POST   | /users/authenticate         |
| PUT    | /users/:id                  |
| PUT    | /users/confirm-email-change |

### Examples

#### Login

```
curl --header "Content-Type: application/json" --request POST --data '{"email":"example@email.com"}' http://localhost:3000/users/login
```

#### Confirm sign up

```
curl -H "authorization: TOKEN" http://localhost:3000/users/confirm-sign-up --request POST
```

#### Update user

```
curl -H "Content-Type: application/json" -H "authorization: TOKEN" --request PUT --data '{"username":"new_username", "email":"new@email.com"}' http://localhost:3000/users/id
```
