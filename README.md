# Rojo Explorer

This extension provides an "explorer" that allows you to view any instances that rojo is managing, this extension also provides intellisense and auto-completion for any rojo-managed instances.

Github: https://github.com/Meqolo/rojo-explorer

## Overview

* [Getting Started](#getting-started)
* [Setup](#setup)
* [Features](#features)
* [Known Issues](#known-issues)

## Getting Started

Welcome to Rojo Explorer! Whether you are new or experienced to development, this extension should massively simplify your workload.

## Setup

This extension is easy to setup. To begin with, please ensure that the latest version (6.x) of [Rojo](https://github.com/rojo-rbx/rojo) is installed on your system.

When you use rojo to develop with this plugin, ensure that a Rojo server has been launched with the command `rojo serve`. Once this is done you need to launch the extension by pressing F1 and then running the command `Rojo: Open Explorer`. An input prompt will then be given to you, asking for the address of the server, if it is the default address you can press enter and it will automatically open.

You can access the explorer by going into the VSCode Explorer menu, at the bottom of the screen it will then show a "Rojo Explorer" tab, allowing you to view all the Rojo-managed instances in your workspace (provided you have ran the `Rojo: Open Explorer` command)

## Features

Rojo Explorer has many features that are designed to aid developers in their workflow, and the transition from Roblox Studio to a third-party IDE. Rojo Explorer comes with path autocompletion for any instances that are managed by Rojo, an "explorer" view that allows you to see any instances managed by Rojo and will also allow you to open any scripts.

To open a script that is shown in the Explorer, simply click it and it will open inside of the default editor you set in Rojo.

## Known Issues

This extension has some known flaws that may impact workflow, these issues will be listed below:

*Explorer and intellisense does not update when a Rojo-managed instance is changed*
You can get around this by simply running the `Rojo: Open Explorer` command again. This is planned to be implemented in the future.

*Events, properties and functions do not autofill*
This is planned to be implemented in the future, however there will have to be significant changes in the code inorder to implement this.