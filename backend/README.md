# Backend(Python Server)

A python based server to fetch stock data based on Investment Strategies.

## Prerequisites

* Linux, Mac, or Windows machine
* Python
* Flask web framework



## Running the Application

The Flask application is ran with a localhost server (IP address 127.0.0.1:5000).

Flask first needs to be told how to import the application, by setting the ```FLASK_APP``` environmental variable:

```
$ export FLASK_APP=stock-suggestion-server.py
```

On Microsoft Windows, use ```set``` instead of ```export``` in the command above.

You can now run the application with the following command:

```
$ flask run

```

## API Details

```
POST /getData

```

Form data:

| Field          | Description                                                       | Optional   |
| -------------- | ----------------------------------------------------------------- | ---------- |
| `Strategies`   | One or two strategies as array ["Strategy 1","Strategy 2"]        | no         |
| `Amount`       | Investment Amount                                                 | no         |

