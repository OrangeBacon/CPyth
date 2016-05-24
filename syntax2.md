# Syntax

CPyth is an object orientated programming language written in JavaScript.  It can compile to JavaScript and can be interpreted in the CPyth Online IDE.
Each program starts with the header files, then defines the functions and variables and then executes code on them.

## Header Files

These define additional functions that the program needs access to on top of the default ones in the language.  The structure of header files is `include <lib|local> <name>`.  If lib is used then it looks for a library in the IDE and if local is used then if looks for the included file relative to the working directory of the file that is including it.  The headers can be put through out the file but they cannot be used until they are included.

## Function Definitions and Variables

All the functions are defined in this section of the program.  They can be spread out through the code, like the variables but they cannot be used until they have been defined, you cannot call them before their definition.
The code to define a function is:
```JavaScript
define func <name> => [<arg>,<arg>,<...>]|<void> in {
  <code>
} = <return>;
```
Each function has a name and then is called by that name with either arguments or `void` indicating that it takes no arguments.  If the function returns a value, end must be set to equal the variable holding that value.  This is still within the same scope as the inside of the function.  To define a variable is like defining a function: `define <datatype> <name> => <value>|<void>`.  The variable has to have a set data type, that can be changed through a built in function but it must be the same as that of the data that the variable holds.  The name of the variable is what it is accessed through and you can set it to either a value or void, indicating that it has no value. 

## Calling Functions and Variables

There are two ways of calling functions.  The first one is `<name>[<arg>,<arg>,<...>]` This pushes the list of arguments into the function with the specified name.  The second way is ` [<arg>,<name>,<arg>,<...>]`.  This method can be used for any function but would most commonly be used in maths expressions like `[1,/,2]` rather than `/[1,2]`.  This method requires the function to take at least two arguments.  To get the return value of a function you must contain the function call in brackets `()`.  An example is `(<name>[<arg>,<arg>,<...>])` would output the return value of the function.  If you do not use the brackets it will interpret the function as an unevaluated input if it is an input to a function.  If the function is not an input then it will run the function and not record the output.  To get the value of variables you type `<name>` and to assign a value to a variable you use `<name> <= <value>`.  All functions are objects so by getting them you can get the code inside the function.

## Data Types

* str: a list of characters, enclosed between speech marks `""`.
* char: one character, enclosed between `''`.
* bool: a value that is either `true` or `false`.
* int: a number that can be any length, positive or negative but cannot have decimal places.  It can be positive or negative.  Any decimal places in it will produce an error or if specified in the header files round the number down.  
* float: a number that can contain decimals and can be any length, positive or negative.
* array: a sequence of values enclosed between square brackets `[]` and separated by commas `,`.  The value of it is accessed `<id> <= array` where id is the index of the item that you want to find starting with 0.
* dict: an associative array, defined as `[<name>:<value>,<name>:<value>,<...>]` and accessed as `<name> <= dict`.
* obj: an object is a data type that can contain other functions and variables.  They can be used to prevent data leaking into the global scope or can be used to represent tree like information.  They are surrounded with curly braces `{}`, each viewable piece of code from outside the object is written as `<name>=><code>`.  To access the functions in objects you can use `<obj><name>[<arg>,<arg>,<...>]` and to get the value of that you surround it in brackets.  To get the value of a variable in the object you use `<name> <= <obj>` and brackets are not needed to get the value.
* uneval: unevaluated expression or function, more information below.

## Commands

Commands are sections of code that can be executed, for example a function definition, an input or a variable assignment.  Each command is separated by a semicolon `;`.  This has to be put after every command.

## Loops

Loops such as the for and while loop are defined as:
```JavaScript
for[<var>,<start>,<end>,<step>] {
  <code>
};
 ```
The while loop is:
```JavaScript
while[cond] {
  <code>
};
```

## Conditions

Conditions are lines of code that evaluate to a Boolean value.  They are surrounded in brackets `()` and are stored in Boolean variables.  The operators in them are `<`,`>`,`==`,`!=`,`<=`,`>=`,`&&`,`||`,`!` meaning less than, greater than, equal to, not equal to, less than or equal to, greater than or equal to, and, or, not.  The first six compare data types other than Boolean and the last three compare Boolean values.  The values that are compared can either be in variables or not.  Brackets can be used in the conditions like `(1 <= 2) || (true != false)` which would return true.

## Comments

Single line comments are placed after `#` and multi-line comments are placed between `###` like `### multi line comment ###`.  The single line comments make everything on the line after it a comment.

## Builtin Functions

* Assignment Operator: `=>` This is used for the first assignment of a variable, it sets the variable on the left to an instance of the value on the right. This makes the variable have all of the methods attatched to the value you are setting it to. 
* Value Operator: `<=` Pushes a value on the right into a variable on the left, depending on the input on the right it will format the value.  It is used to get values out of obj, arr and dicts data types.
* Return Operator: `()` Evaluates the content and returns it.  Maths expressions do not need to have their inputs surounded in brackets.

## Unevaluated Inputs

Unevaluated inputs are where the input is not calculated.  This means that you can run the input multiple times with different values. This could be used, for example for maping a function over a list.  To use an unevaluated input, use the function or expression without the brackets surounding it.  To use an unevaluated input, `call <name> with [<inp>:<value>,<inp>:<value>]` or you can call it without the input `call <name>`.  Unevaluated inputs can only be used when calling a function or inside a function that you are writing that has an unevaluated input as one of its inputs.

## Example Programs

```JavaScript
# Get two user input floats, multiply them together and output the result.
define float inp1 => void;
define float inp2 => void;
inp1 <= input["number 1"];
inp2 <= input["multiplied by"];
define str string => [str[inp1],+,"*",str[inp2],"=",str[[inp1,*,inp2]]];
print[str];
```
```JavaScript
# Print all integers between 0 and a user input number.
define int inp => input["Integer greater than 0"];
if[inp > 0] {
  error["Int not entered or input not greater than 0"];
  quit[];
} else {
  for[define int i => void,0,inp,1] {
    print[i];
  };
};
```
```JavaScript
# Turtle graphics: squares
define func square => [x,y,size] {
  penUp[];
  goto[x,y];
  for(define i int,0,4,1){
    move[size];
	turnRight[90];
  };
};
# draws a square of size 50 at x=45,y=22
[45,square,22,50];
```
```JavaScript
###
Example of using objects
###
print[
  {
    name => "cpyth",
    type => "programing language"
  }
];
```
