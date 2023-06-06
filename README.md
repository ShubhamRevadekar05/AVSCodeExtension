# avscodeextension

AVSCODEEXTENSION is a general purpose Visual Studio Code extension which contains useful utilities.

## Installation

Just download the ".vsix" file located in the "build" directory of this repository and install it in VS Code.

## Features

This extension currently contains the following sub-extensions.

### ONEDOESCOMPILE

This sub-extension has two commands:

Command **Run Code**: Runs the code online.

Command **Select Language**. Lets you pick from 46 languages, like C, C++, Python, Java, Javascript, etc, even database languages like MySQL, PostgreSQL, MongoDB, etc.

### Runner

This sub-extension has two commands:

Command **Run Command**: Lets you choose a command to run.

Command **Show Commands Mapping**: Opens a window to add or remove commands. Developers can add dynamic commands for file names. e.g., "gcc {{file}}" in the command will be replaced with the file name while running, like "gcc abc.c".

### Plagiarism-Checker

This sub-extension contains one command:

Command **Plagiarism Checker**: Opens a window that takes input text from the user and displays its plagiarism score.

### PDF Viewer

This sub-extension can display pdf files directly in VSCode.

## Requirements

Visual Studio Code version ^1.78.0.

**Enjoy!**
