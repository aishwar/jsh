
## Why this?

`jsh` files are designed to help reduce the verbosity of writing shell scripts and make them easy to read/write. A jsh file is in fact just shell script with some transformations applied.

Verbosity is reduced by making it easy to print out log messages at different stages and making the error handling easy.

The files are also designed to look clean by moving variable assignment into a separate YAML file.

 - YAML files are easy to read and edit.
 - YAML files allow better grouping of related variables.
 - The separation of variable assignment removes that boilerplate from the script file; this makes the script file contain just the core logic.

## How does it work?

### Configuration File

It is a standard YAML file with the following additions:

 - All top level keys get prefixed with a $. For example, a top level key called "topic" in the config file will be accessible as "$topic" in the script file.
 - Values of the form $('<command>') get replaced with the shell output for <command>

#### Example

Here is a sample config file (say config.yml).

    topic: $('echo Source Control')
    companies:
      github: 1
      bitbucket: 1
    nodejs:
      version: $('echo v10')
      creator:
        name: 'Ryan Dahl'
        github: 'https://www.github.com/ry'

This gets parsed to:

    $topic = 'Source Control'
    $companies = {
      github: 1,
      bitbucket: 1
    }
    $nodejs = {
      version: 'v10',
      creator: {
        name: 'Ryan Dahl',
        github: 'https://www.github.com/ry'
      }
    }


### Script File

Each line of the script file should contain 1 shell command. Commands that span multiple lines will not work!

#### Logging

Start a line with '##' to print that line as the log message.

This file:

    ## Ping node.js creator's github page
    ping $nodejs.creator.github
    
will execute similar to this file:

    echo Ping node.js creator's github page
    ping https://www.github.com/ry

#### Putting comments

If you want to put comments in the file, just use a single '#'.

    # This is a comment
    ## This is a log message
    do-something

#### Error handling (default error message)

Any command that fails to execute (because it printed to stderr or returned a non 0 value) will terminate execution of the script. The subsequent commands will not be executed.

    ## Switching to $topic directory
    cd $topic

    # Next Step - code will not reach here if the last command failed
    echo On to the next step

If $topic did not exist, the program will terminate and print something like 'Error on executing "cd /home/user/Source Control": "No such file or directory"'.

#### Error handling (custom error message)

Prefix a command with "#! <custom error message>". If the command failed, the custom error message will be printed.

    ## Switching to $topic directory
    cd $topic #! Could not switch to $topic!

    # Next Step - code will not reach here if the last command failed
    echo On to the next step

If $topic did not exist, the program will terminate and print 'Could not switch to /home/user/Source Control'.

#### Using the '$' as part of the shell command

When the `jsh` file encounters an element of the form '$var', it will treat is as a variable and try to replace it with the value from the configuration file. If this value does not exist, it lets the '$var' element stay and executes it as part of the shell command.

    # Print current directory
    echo $(pwd)

If there is no key "(pwd)" in the configuration file, this is exactly equivalent to the shell script:

    echo $(pwd)
