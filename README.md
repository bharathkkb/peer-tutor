# Peer Tutor

Peer tutor is an app which allows classmates to connect with each other and help each other advance in their academics.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

```
docker
docker-compose
```

## Installing
#### Running the backend API server
Clone this repo
dev branch is for dev will have the latest bits

stg branch is for staging

prd branch is for production deployment

```
cd peer-tutor-api
docker-compose -f deploy-api.yml up --d
```
This will get all the dependencies, build the system and run the server
The endpoint will be http://localhost:5000/test/api

To see the API documentation please go to
http://localhost:5000/test/api/ui/

To stop the API server
```
cd peer-tutor-api
docker-compose -f deploy-api.yml down
```
P.S This server will be ephemeral i.e data inserted into mongodb will lost when you run docker-compose -f deploy-api.yml down
For production we have persistent docker volumes and replica sets
## Running the tests
First launch the test server by following instructions to run the backend API server

```
cd peer-tutor-api
pytest -q test_api.py --url=http://localhost:5000
```

<!--
### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system -->

## Built With

* [Swagger](https://swagger.io/) - API Framework
* [Connexion](https://github.com/zalando/connexion) - Scaffolding Framework
* [Flask](http://flask.pocoo.org/) - Python web micro framework
<!--
## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags).

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project. -->

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* We sincerely thank Weiwei Cao, our advisor, for all the guidance and help.
