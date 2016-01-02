#CPyth

##Introduction
CPyth is a new language based off python and c and it is written in javascript.  It is designed to have strict typing and data types from c, yet still be readable.  Also there is increased suport for graphics, as it suports dom manipulation of the page it is running in and the ability to interact with canvs graphics. It should be interpratable, run line by line by the parser, yet also have the option to compile it to javascript so it can be run without the parser.  There will be some limitations to the convrsion to javascript, though as not every command can accept a callback and javascript data types are unspecified, a variable can contain anything.  The immediate parsing in a interpreter is the first item to be concentrated on and only when that is done should work start on the compiler.

##Structure
Each command is comprised of 1 word and this describes what it is going to do.  Every command will return a value, if it is calculating something that could be anything if not then it will be either true or false, depending on the excecution of the word.  If the word excecutes correctly it will return either the result, or if the is no result true.  If the word excecutes incorrectly it will return false.

Each word has to have arguments parsed to it.  They are contained in square brackets [] and are comma seperated values.  This is the same structure as a list.  All the arguments to the word will have assumed data types as defined by the function.  If the arguments provided are not the correct type or the wrong number of arguments is provided then the function will report an error and return false.  If no arguments are required then the square brackets should be empty.

In order to use the result from a function curley braces {} should be used.  The first pair will run if it returns a value, or true and the second pair will run if it returns false.  They are optional, you cn have either no pairs, 1 pair or two pairs.  To run a command only on false a preceding pair is required.  The output from the function will be accesable in the variable \out.


##Data Types
Word: this is the basic excecuteable function

Str: text, enclosed in either double of single quotes `""` or `''`

Int: number, no special formatting

List: a 0 indexed array of values, surounded with square brackets `[]` and the values are seperated by commas

Code: a string that can be excecuted, surounded by curley brace `{}`

Bool: either a true/false value or a statement comparing two or more data types

Var: a single word with no spaces or restricted characters, starts with `\`


##Example program:
```javascript
/*This defines two variables, a and b from user input and then prints them. It then prints whether a>b or not*/
new[int,a,\inp]{print["a="+\out]}{print[error]}
new[int,b,\inp]{print["b="+\out]}{print[error]}
if[\a > \b]{print[\a+">"+\b]}{print[\a+"!>"+\b]}
```
