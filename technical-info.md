#Technical Documentation

Parity is a number puzzles game written in JavaScript. This document is to provide the technical documentation for how each of it's components can interact with each other

##Core
This game is run by a core engine which contains the mediator and potentially some subscriptions to other components

##Modules
Each of the separate components is this game is distributed as a *module* and has it's own namespace. These are the following modules that currently exist

- LoaderModule
- ControlModule
- CookieDataModule
- GameModule

###LoaderModule
The ControlModule is going to handle input from the user.

**Subscribed**:

- loader_load_modules

**Published**:

- loader_loading_complete

###ControlModule
The ControlModule is going to handle input from the user.

**Subscribed**: (none)

**Published**:

- controls_key_enter
- controls_key_space
- controls_key_left
- controls_key_up
- controls_key_right
- controls_key_down

###CookieDataModule
The CookieDataModule handles saving and loading the game's progress by means of cookies.

**Subscribed**:

- cookie_data_save
- cookie_data_load

**Published**:

- cookie_data_save_complete

###GameModule