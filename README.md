# Peer Tutor

Peer tutor is an app which allows classmates to connect with each other and help each other advance in their academics.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

```
Python3
pip
virtualenv
```

### Installing
## Running the backend API server
Clone this repo
dev branch is for dev will have the latest bits
stg branch is for staging
prd branch is for production deployment

Activate virtualenv
```
cd peer-tutor-api/
source peer-tutor-api/bin/activate
```
Install dependencies
p.s you may need to switch pip with pip3 depending on your configuration
```
pip install -r requirements.txt
```
Run the server
-t flag launches the simulated testing dev env
optional -p flag will let you run the server in a different port (ex. python3 server.py -t -p 5001)
```
python3 server.py -t

```

## Running the tests

```
cd peer-tutor-api/
pytest
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
