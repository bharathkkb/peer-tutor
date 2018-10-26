
from flask import render_template
import connexion
from flask_cors import CORS
import argparse

global dbType


def parseArgs():
    parser = argparse.ArgumentParser(description='TestBed API.')
    parser.add_argument("-p", default=5000,
                        help="Specify port number", action="store")
    parser.add_argument("-t", action="store_true",
                        help="Launch API and run tests")
    return parser.parse_args()


if __name__ == '__main__':
    args = parseArgs()

    if(args.t is True):
        app = connexion.App(__name__, specification_dir='./',
                            arguments={'is_testing': '/test'})
        dbType = "testing_db"
    else:
        app = connexion.App(__name__, specification_dir='./',
                            arguments={'is_testing': ''}, swagger_ui=False)
        dbType = "prd_db"
    CORS(app.app)
    app.add_api('swagger.yaml')
    app.run(host='0.0.0.0', port=args.p, debug=True)


@app.route('/')
def home():
    return render_template('home.html')
