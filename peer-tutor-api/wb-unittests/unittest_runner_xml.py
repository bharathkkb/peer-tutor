import os
import unittest
import xmlrunner
import HtmlTestRunner

if __name__ == '__main__':
    test_loader = unittest.TestLoader()
    package_tests = test_loader.discover(
        start_dir="./", pattern='*_testing.py')
    testRunner = xmlrunner.XMLTestRunner(output='test-reports')
    testRunner.run(package_tests)
