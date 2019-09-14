### Create idea

```
curl --data "" http://localhost:3000/ideas
```

### Save draft

```
curl --header "Content-Type: application/json" --request PUT --data '{"title":"This is an draft"}' http://localhost:3000/ideas/save-draft/id
```

### Update idea

```
curl --header "Content-Type: application/json" --request PUT --data '{"title":"This is an updated title"}' http://localhost:3000/ideas/id
curl --header "Content-Type: application/json" --request PUT --data '{"description":"This is an updated description"}' http://localhost:3000/ideas/id
```

### Publish idea

```
curl --header "Content-Type: application/json" --request PUT http://localhost:3000/ideas/publish/id
```

### Unpublish idea

```
curl --header "Content-Type: application/json" --request PUT http://localhost:3000/ideas/unpublish/id
```

### Delete idea

```
curl --header "Content-Type: application/json" --request DELETE http://localhost:3000/ideas/id
```
