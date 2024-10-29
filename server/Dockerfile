FROM python:3.12.7

COPY . ./

RUN pip3 install -r /requirements.txt
CMD fastapi dev src/main.py