# -ScratchOs / ComputerBackup15

import re
import os
import time
from datetime import datetime
import sys

unwhitespace = re.compile(r"^(\s|\*)+",re.MULTILINE)
uncomment = re.compile(r"(^|\*\/)[\w\W]*?(\/\*|$)")
header = "<!DOCTYPE html><html docs><head><title>{title}</title><meta name='viewport' content='width=device-width'><meta charset='utf-8'><script src='../javascript/docs.js'></script><link href='../stylesheets/dark-docs.css' rel='stylesheet' type='text/css' id='theme'></head><body><div class='list'><h2>Documentation Topics</h2><form onsubmit='return false;'><input id='search' autocomplete='off' placeholder='Search'></form><div id='results'>{topics}</div></div><div class='desc'>"
end = "</div></body></html>"

def tokeniser(docs):
    docs = uncomment.sub("",docs)
    docs = unwhitespace.sub("",docs)
    quote = False
    tokens = []
    line = ""
    for j in range(0,len(docs)):
        if docs[j] == '"':
            if quote:
                quote = False
            else:
                quote = True
        elif (docs[j] == " " or docs[j] == "\n") and quote == False:
            if not line == "" or line == "\n":
                tokens.append(line)
                line = ""
        else:
            line += docs[j]
    if not line == "" or line == "\n":
        tokens.append(line)
    return tokens

def parser(tokens):
    tokens = tokeniser(tokens)
    if len(tokens) > 0:
        if tokens[0] == "@docs":
            filename = ""
            for j in range(0,len(tokens)):
                data =  ""
                if tokens[j] == "@title":
                    data = "<h1>" + tokens[j+1] + "</h1>"
                    j+=1
                elif tokens[j] == "@name":
                    data = "<h2>" + tokens[j+1] + "</h2>"
                    j+=1
                elif tokens[j] == "@description":
                    data = "<div class='description'>"
                elif tokens[j] == "@end":
                    data = "</div>"
                elif tokens[j] == "@code":
                    data = "<div class='code'>"
                elif tokens[j] == "@desc":
                    data = "<div class='description'>" + tokens[j+1] + "</div>"
                    j+=1
                elif tokens[j] == "@text":
                    data = "<p>" + tokens[j+1] + "</p>"
                    j+=1
                elif tokens[j] == "@parameters":
                    data = "<div class='parameters'>"
                elif tokens[j] == "@param":
                    data = "<div class=" + tokens[j+2] + "><p class='type'>" + tokens[j+1] + ": </p><p class='desc'>" + tokens[j+3] + "</p></div>"
                    j+=3
                elif tokens[j] == "@default":
                    data = "<div class='defaults'>"
                elif tokens[j] == "@def":
                    data = "<div class='default'><p>" + tokens[j+1] + ": </p><p class='desc'>" + tokens[j+3] + "</p></div>"
                    j+=3
                elif tokens[j] == "@return":
                    data = "<div class='return " + tokens[j+1] + "'><p class='type'>" + tokens[j+1] + "</p><p>" + tokens[j+2] + "</p></div>"
                    j+=2
                if tokens[j] == "@breakpoint":
                    filename = tokens[j+1]
                    j+=1
                    
                if not filename in files and not filename == "":
                    files.append(filename)
                if j == 0 or tokens[j-1] == "@breakpoint":
                    openfile = open("docs/" + filename + ".html",'w')
                    if tokens.count("@title") > 0:
                        if tokens.index("@title") > j:
                            for k in range(j,len(tokens)):
                                if tokens[k] == "@title":
                                    insert = header.format(title=tokens[k+1], topics="{topics}")
                                    break
                        else:
                            insert = header.format(title=filename)
                    else:
                        insert = header.format(title=filename)
                    openfile.write(insert + data)
                    openfile.close()
                else:
                    openfile = open("docs/" + filename + ".html",'a')
                    openfile.write(data)
                    openfile.close()

def generate():
    if not os.path.exists('docs'):
        os.makedirs('docs')
    for dirpath, dirnames, file in os.walk('.'):
        for name in file:
            if not (os.path.join(dirpath, name).startswith(r".\.sass")
                    or os.path.join(dirpath, name).startswith(r".\.git")
                    or os.path.join(dirpath, name).startswith(r".\fonts")
                    or os.path.join(dirpath, name).startswith(r".\docs")):
                with open(os.path.join(dirpath, name), 'r') as code:
                    parser(code.read())
    prettyfiles = []
    for j in range(0,len(files)):
        prettyfiles.append("".join(["<p data-value='",files[j],"'><a href='",files[j],".html","'> ",files[j],"</a></p>"]))
    for j in range(0,len(files)):
        openfile = open("docs/" + files[j] + ".html",'r')
        data = openfile.read().format(topics=''.join(map(str, prettyfiles)))
        openfile.close()
        openfile = open("docs/" + files[j] + ".html",'w')
        openfile.write(data)
        openfile.write(end)
        openfile.close()

while True:
    t0 = time.clock()
    files = []
    generate()
    sys.stdout.write("\r" + ''.join(["Generated at: ",str(datetime.now().time())," in ",str(round(time.clock() - t0,1)), " seconds"]))
    time.sleep(3)
