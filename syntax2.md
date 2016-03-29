# Syntax

CPyth is an object orientated programming language written in JavaScript.  It can compile to JavaScript and can be interpreted in the CPyth Online IDE.
Each program starts with the header files, then defines the functions and variables and then executes code on them.

## Header Files

These define additional functions that the program needs access to on top of the default ones in the language.  The structure of header files is `include <lib|local> <name>`.  If lib is used then it looks for a library in the IDE and if local is used then if looks for the included file relative to the working directory of the file that is including it.  The headers can be put through out the file but they cannot be used until they are included.

## Function Definitions and Variables

All the functions are defined in this section of the program.  They can be spread out through the code, like the variables but they cannot be used until they have been defined, you cannot call them before their definition.
The code to define a function is:
```
define func <name> => [<arg>,<arg>,<...>]|<void> in:
  <code>
end = <return>
```
Each function has a name and then is called by that name with either arguments or `void` indicating that it takes no arguments.  If the function returns a value, end must be set to equal the variable holding that value.  No operations can be done there.  To define a variable is quite like defining a function: `define <datatype> <name> => <value>|<void>`.  The variable has to have a set data type, that can be changed through a built in function but it must be the same as that of the data that the variable holds.  The name of the variable is what it is accessed through and you can set it to either a value or void, indicating that it has no value.  Any function or variable defined inside an object is specific to that object and does not leak into the global scope.

## Calling Functions and Variables

There are two ways of calling functions.  The first one is `[<arg>,<arg>,<...>] => <name>` This pushes the list of arguments into the function with the specified name.  The second way is like `call [<arg>,<arg>,<...>] => <name>`.  This method must be used for user defined functions and can be used for built in functions.  To get the return value of a function you must contain the function call in brackets `()`.  An example is `([<arg>,<arg>,<...>] => <name>)` would output the return value of the function.  To get the value of variables you type `<name>` and to assign a value to a variable you use `<value> => <name>`.  All functions are objects so by getting them you can get the code inside the function.

## Data Types

* str: a list of characters, enclosed between speech marks `""`.
* char: one character, enclosed between `''`.
* bool: a value that is either `true` or `false`.
* int: a number that can be any length, positive or negative but cannot have decimal places.  It can be positive or negative.  Any decimal places in it will produce an error or if specified in the header files round the number down.  
* float: a number that can contain decimals and can be any length, positive or negative.
* array: a sequence of values enclosed between square brackets `[]` and separated by commas `,`.  The value of it is accessed `<id> => [<value>,<value>,<...>]` where id is the index of the item that you want to find starting with 0.
* dict: an associative array, defined as `[<name>:<value>,<name>:<value>,<...>]` and accessed as `<name> => [<name>:<value>,<name>:<value>,<...>]`.
* obj: an object is a data type that can contain other functions and variables.  They can be used to prevent data leaking into the global scope or can be used to represent tree like information.  They are surrounded with curly braces `{}`, each viewable piece of code from outside the object is written as `<name>:<code>`.  To access the functions in objects you can use `[<arg>,<arg>,<...>] => <obj>.<name>` and to get the value of that you surround it in brackets.  To get the value of a variable in the object you use `<obj>.<name>` and brackets are not needed to get the value.

## Commands

Commands are sections of code that can be executed, for example a function definition, an input or a variable assignment.  Each command is separated by a semicolon `;`.  This has to be put after every command.

## Loops

Loops such as the for and while loop are defined as:
```
[<var>,<start>,<end>,<step>] => for in:
  <code>
 end
 ```
The while loop is:
```
[cond] => while in:
  <code>
end
```

## Conditions

Conditions are lines of code that evaluate to a Boolean value.  They are surrounded in brackets `()` and are stored in Boolean variables.  The operators in them are `<`,`>`,`==`,`!=`,`<=`,`>=`,`&&`,`||`,`!` meaning less than, greater than, equal to, not equal to, less than or equal to, greater than or equal to, and, or, not.  The first six compare data types other than Boolean and the last three compare Boolean values.  The values that are compared can either be in variables or not.  Brackets can be used in the conditions like `(1 <= 2) || (true != false)` which would return true.

## Maths

There are several maths commands that can be used.  Maths statements have to be surrounded by brackets `()` to use them.  There are the basic maths commands such as add, divide and power.  They use the correct order of operations and can be used like `<value><command><value>` for example `(1+2*(5.3/4)) => a;` which would set a to 3.65.  

## Comments

Single line comments are placed after `#` and multi-line comments are placed between `###` like `### multi line comment ###`.  The single line comments make everything on the line after it a comment.

## Example Program

```
# Get two user inputted floats, multiply them together and output the result.
define float inp1 => void;
define float inp2 => void;
["number 1"] => print;
[inp1] => input;
["multiplied by"] => print;
[inp2] => input;
[([inp1] => str) + "multiplied by" + ([inp2] => str) "=" ([(inp1*inp2)] => str)] => print
```