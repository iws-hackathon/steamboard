FROM resin/rpi-raspbian:jessie

# Enable systemd
ENV INITSYSTEM on

RUN apt-get update \
  && apt-get dist-upgrade \
  && apt-get install -y \
    python3 \
    python3-pip \
  && rm -rf /var/lib/apt/lists/* 

RUN 

# copy current directory into /app
COPY . /app

# run python script when container lands on device
CMD ['python', '/app/hello.py']

