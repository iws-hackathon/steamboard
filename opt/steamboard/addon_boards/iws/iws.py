#!/usr/bin/env python3

import logging
L = logging.getLogger(__name__)

from time import sleep
import RPi.GPIO as GPIO
import os

_max_valve_runtime = 4

_p_valve_open = 4
_p_valve_close = 24
_p_valve_opened = 18
_p_valve_closed = 17
_p_moisture_detected = 20
_p_darkness_detected = 21

def set_pins():
    GPIO.cleanup()
    GPIO.setmode(GPIO.BCM)
    pins = {
        _p_valve_open: GPIO.OUT,
        _p_valve_close: GPIO.OUT,
        _p_valve_opened: GPIO.IN,
        _p_valve_closed: GPIO.IN,
        _p_darkness_detected: GPIO.IN,
        _p_moisture_detected: GPIO.IN,
        }

    pud = {
        _p_valve_opened: GPIO.PUD_UP,
        _p_valve_closed: GPIO.PUD_UP,
        _p_darkness_detected: GPIO.PUD_DOWN,
        _p_moisture_detected: GPIO.PUD_UP,
    }
    for pin in list(pins.keys()):
        try:
            GPIO.setup(pin, pins[pin], pull_up_down=pud[pin])
        except KeyError:
            GPIO.setup(pin, pins[pin])

#--------------------
# Valve
#
def valve_is_open():
    return GPIO.input(_p_valve_opened) and (not GPIO.input(_p_valve_closed))

def valve_is_closed():
    return (not GPIO.input(_p_valve_opened)) and GPIO.input(_p_valve_closed)

def is_valve_open():
    if valve_is_open():
        return 'Valve is open'
    return 'Valve is closed'

def stop_valve():
    GPIO.output(_p_valve_open, GPIO.LOW)
    GPIO.output(_p_valve_close, GPIO.LOW)

def open_valve():
    stop_valve()
    polls = _max_valve_runtime / _poll_sleep
    GPIO.output(_p_valve_open, GPIO.HIGH)
    poll_count = 0
    while ( not valve_is_open() and (poll_count < polls) ):
        poll_count += 1
        sleep(_poll_sleep)
    stop_valve()

def close_valve():
    stop_valve()
    polls = _max_valve_runtime / _poll_sleep
    GPIO.output(_p_valve_close, GPIO.HIGH)
    poll_count = 0
    while ( not valve_is_closed() and (poll_count < polls) ):
        poll_count += 1
        sleep(_poll_sleep)
    stop_valve()

#--------------------
# Light sensor
#

def it_is_dark():
    return GPIO.input(_p_darkness_detected)

def is_it_dark():
    if GPIO.input(_p_darkness_detected):
       return "It's dark"
    return "It's not dark"

#--------------------
# Moisture sensor
#

def it_is_moist():
    return GPIO.input(_p_moisture_detected)

def is_it_moist():
    if GPIO.input(_p_moisture_detected):
       return "It's moist"
    return "It's not moist"

#--------------------
# Demo
#

def demo():
    set_pins()
    c = 0
    open_valve()
    while True:
        c += 1
        if c >= _max_demo_secs:
            break

        if c == 8:
            close_valve()

        print(is_valve_open())
        print(is_it_dark())
        print(is_it_moist())
        print('--------')
        sleep(1)

_max_demo_secs = 60
_poll_sleep = 0.2

try:
    demo()
except KeyboardInterrupt: pass

GPIO.cleanup()
