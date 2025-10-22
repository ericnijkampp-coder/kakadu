#!/usr/bin/env python3
"""
Simple HTTP Server for KANSIMO.NL Static Site

This script starts a simple HTTP server to serve the static files in the current directory.
It can be configured to use a specific port and directory.

Usage:
    python server.py [port] [directory]

    - port: Optional. The port number to run the server on (default: 8000)
    - directory: Optional. The directory to serve files from (default: current directory)

Example:
    python server.py 8080 ./public
"""

import http.server
import socketserver
import os
import sys

def run_server(port=8000, directory='.'):
    """Run the HTTP server on the specified port and directory."""
    
    # Change to the specified directory
    os.chdir(directory)
    
    # Create handler with directory specified
    handler = http.server.SimpleHTTPRequestHandler
    
    # Create server with the handler
    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"Serving at http://localhost:{port}")
        print(f"Serving directory: {os.path.abspath(directory)}")
        print("Press Ctrl+C to stop the server")
        
        try:
            # Start the server
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == "__main__":
    # Get port from command line arguments or use default
    port = 8000
    directory = '.'
    
    # Parse command line arguments
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"Invalid port number: {sys.argv[1]}")
            print("Using default port 8000")
    
    # Parse directory argument
    if len(sys.argv) > 2:
        directory = sys.argv[2]
        if not os.path.isdir(directory):
            print(f"Warning: Directory '{directory}' does not exist or is not a directory")
            print("Using current directory instead")
            directory = '.'
    
    # Run the server
    run_server(port, directory)