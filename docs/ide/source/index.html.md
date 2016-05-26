---
title: CPyth | IDE documentation

language_tabs:
  - javascript: JavaScript
  - html: HTML5


toc_footers:
  - <a href='scratchos.github.io/CPyth'>CPyth IDE and programming language</a>
  - <a href='https://github.com/tripit/slate'>Documentation Powered by Slate</a>

search: true
---
# Introduction

This documentation is intended for people wishing to develop the CPyth <abbr title="Integrated Development Environment">IDE</abbr> and the code behind it.  The IDE's JavaScript code is mainly in one large object, `cpyth`, with only the initialisation function call elsewhere, within `window.onload`.

This documentation is to try to make up for the lack of commenting inside the code so hopefully people reading the code can try to work out how it works.

<aside class="notice">Note: all line numbers etc. are valid as of commit <a href=https://github.com/ScratchOs/CPyth/commit/466de98954f7aac0d8fa6e3f1521566e2a9054bb>466de98</a></aside>


# CPyth object

## vars

Variable storage for variables used across all of CPyth.

```javascript
cpyth.vars.<variable>;
```

# IDE HTML
