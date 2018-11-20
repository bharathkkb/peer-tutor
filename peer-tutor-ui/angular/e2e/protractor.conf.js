// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const
{
  SpecReporter
} = require('jasmine-spec-reporter');
const
{
  JUnitXmlReporter
} = require('jasmine-reporters');
var HtmlReporter = require('protractor-beautiful-reporter');
exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  capabilities:
  {
    'browserName': 'chrome',
    'chromeOptions':
    {
      'args': ['--headless']
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine2',
  jasmineNodeOpts:
  {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function () {}
  },
  onPrepare()
  {
    require('ts-node').register(
    {
      project: require('path').join(__dirname, './tsconfig.e2e.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter(
    {
      spec:
      {
        displayStacktrace: true
      }
    }));

    const junitReporter = new JUnitXmlReporter(
    {
      savePath: './e2e-test-results',
      consolidateAll: false
    });
    jasmine.getEnv().addReporter(junitReporter);
    jasmine.getEnv().addReporter(new HtmlReporter(
    {
      baseDirectory: './e2e-test-results/e2e-html-result',
      screenshotsSubfolder: 'images',
      jsonsSubfolder: 'jsons',
      docTitle: 'Peer-Tutor UI BB E2E Tests',
      docName: 'index.html'
    }).getJasmine2Reporter());
  }
};
