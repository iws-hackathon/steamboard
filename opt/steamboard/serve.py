#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# credit: https://raw.githubusercontent.com/BlocklyDuino/BlocklyDuino/gh-pages/arduino_web_server.py
# credits-credit: http://sheep.art.pl/Wiki%20Engine%20in%20Python%20from%20Scratch

__script_name__ = 'serve.py'
__version__ = '1.0.0'

import logging
L = logging.getLogger(__name__)

import argparse
import sys
import os
import datetime

from pycnic.core import WSGI, Handler
import http.server
import xmlrpc.server
import urllib.request, urllib.parse, urllib.error
import itertools
import logging
import platform
import os
import re
from optparse import OptionParser

# Local imports without install
import inspect
bin_file = inspect.stack()[0][1]
while os.path.islink(bin_file):
    bin_file = os.path.join(os.path.dirname(bin_file), os.readlink(bin_file))
proj_folder = os.path.abspath(os.path.join(os.path.dirname(bin_file), '..'))
sys.path.insert(0, os.path.join(proj_folder, 'src'))

API_PORT = 1655
STATIC_PORT = 8080
BIND_ADDRESS = '127.0.0.1'
API_PREFIX = '/board'

class RESTHandler(Handler):
    def get(self):
        return {
            "GET": "works"
            }

    def post(self):
        ff = self.request.data.get("timeout")
        response = {
            "you POST-ed a timeout of:": "%s" % ff
            }
        return response

class app(WSGI):
    routes = [
        (API_PREFIX, RESTHandler()),
        ]

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_HEAD(self):
        '''Send response headers'''
        if self.path != '/':
            return http.server.SimpleHTTPRequestHandler.do_HEAD(self)
        self.send_response(200)
        self.send_header('content-type', 'text/html;charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()

    def do_GET(self):
        if self.path.startswith(API_PREFIX):
            # fetch the response
            proxy_response = urllib.request.urlopen(
                'http://%s:%d%s' % (BIND_ADDRESS, API_PORT, self.path)
                )

            # send status code from backend
            self.send_response(proxy_response.getcode())

            # send headers from backend
            for (header, value) in proxy_response.getheaders():
                self.send_header(header, value)
            self.end_headers()

            # send response body
            self.copyfile(proxy_response, self.wfile)

        elif self.path != '/':
            return http.server.SimpleHTTPRequestHandler.do_GET(self)
        else:
            self.send_response(302)
            self.send_header('Location', 'index.html')
            self.end_headers()

    def do_POST(self):
        if self.path.startswith(API_PREFIX):
            length = int(self.headers.get('content-length'))
            if length > 0:
                proxy_response = urllib.request.urlopen(
                    'http://%s:%d%s' % (BIND_ADDRESS, API_PORT, self.path),
                    data=self.rfile.read(length)
                    )

                self.send_response(proxy_response.getcode())
                self.send_header('Access-Control-Allow-Origin', '*')
                for (header, value) in proxy_response.getheaders():
                    if header.lower() == 'transfer-encoding': continue
                    else:
                        self.send_header(header, value)
                self.end_headers()
                self.copyfile(proxy_response, self.wfile)

                return

        self.send_response(400)
        self.end_headers()

def do_work( args, exit_string ):
    exit_string = 'success'

    try:
        print('STEAMBOARD can be accessed at http://%s:%d/' % (
            BIND_ADDRESS,
            STATIC_PORT,
            ))
        server = http.server.HTTPServer((BIND_ADDRESS, STATIC_PORT), Handler)
        print('-------')
        server.pages = {}
        server.serve_forever()
        pass
    except KeyboardInterrupt:
        L.critical('Aborting...')
        exit_string = 'cancelled by user'

    except:
        L.critical('Unexpected error: %s' % (
            sys.exc_info()[0]))
        exit_string = 'error'
        raise

    return exit_string

###############################################################################

if __name__ == '__main__':

    parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
    parser.add_argument('--port', type=int, default=STATIC_PORT, help='Port to serve blockly on')
    parser.add_argument('--address', default=BIND_ADDRESS, help='Address to serve blockly on')
    parser.add_argument('--log', default='CRITICAL', choices=['DEBUG','INFO','WARNING','ERROR','CRITICAL'], help='Logging level')
    parser.add_argument('--log_file', default=None, help='Path to logfile')

    # get and check options
    args = None
    if len(sys.argv) == 1:
        args = parser.parse_args()
    elif(sys.argv[1] == '-v' or
         sys.argv[1] == '--v' or
         sys.argv[1] == '-version' or
         sys.argv[1] == '--version'):
        print(('%s: version: %s' % (__script_name__, __version__)))
        sys.exit(0)
    elif(sys.argv[1] == '-h' or
         sys.argv[1] == '--h' or
         sys.argv[1] == '-help' or
         sys.argv[1] == '--help'):
        parser.print_help()
        sys.exit(0)
    else:
        args = parser.parse_args()

    log_format = '[%(asctime)s %(name)s] %(message)s'
    if args.log_file is not None:
        log_file_path = os.path.abspath(args.log_file)
        logging.basicConfig(
            format=log_format,
            datefmt='%I:%M:%S',
            filename=log_file_path,
            filemode='w',
            level=getattr(logging, args.log.upper()))
    else:
        logging.basicConfig(
            format=log_format,
            datefmt='%I:%M:%S',
            level=getattr(logging, args.log.upper()))

    L.critical('server is starting %s (v%s)' % (__script_name__, __version__))
    L.critical('server-args: %s' % ' '.join(sys.argv[1:]))
    L.critical("Today is {:%b, %d %Y}".format(datetime.datetime.now()))

    exit_string = do_work(args, 'success')

    L.critical('Exit status: "%s"' % exit_string)

    if exit_string == 'error': sys.exit(1)
