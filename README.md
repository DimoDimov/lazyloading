# Technical Test - Big Form Performance

This test is designed to test a candidate's ability to understand 
Angular UI rendering, model binding, event binding and how to optimise 
it to improve UI performance.

## Installation and Setup

This app has been built with **Node v6.5** for some server-side ES6 
compatibility. Feel free to implement an ES6 compiler to support an 
older version of Node JS!

*NOTE: All client-side JavaScript is ES5*

### Setup

- Run `npm install` to install project dependencies
- Run `npm start` to start the Big Form app running on 
http://localhost:5001 (configurable in `./config.env`)

## The Problem

We have a large, completely dynamic, JSON-driven form, with large numbers of fields, and complex dependency logic, 
affecting other fields. The form is unresponsive and slow.

## Big Form

This application presents a large, complex form. The real world form has 
less fields, but more complex bindings and logic.

To simulate the UI delays Big Form has lots of fields, with some simple 
bindings (when changing a list/select entry, dependent fields' visibility is 
toggled).

## Variants

Variants are three "flavours" of the form - each field supports one or 
more variants. When changing variant, some fields hide, other show.

## Timings

There are two key timings demonstrated on Big Form:

**Variant Operation**

A variant operation is when a variant is changed - only fields supporting 
that variant are shown.

**Warning!** The first time you choose a variant the delay is abnormally 
long - it may look like it has frozen - expect a few seconds delay.

**Dependency Operation**

A dependency operation is when a select list is changed - other, 
dependent fields are shown/hidden.

## Your Submission and Our Expectations

We would like this application returned back to us as a ZIP archive. 
Your submission should show visible performance improvements in both
timings.

**Please do NOT change:**
- The number of fields displayed
- The layout
- The behaviours (changing select lists and variants)

This app has been built badly in some areas, to give you something to fix!

### Your Baseline

    We will use this instance: https://bigform.priipcloud.com to compare 
your applications performance against.

### Additional optimisation suggestions

We don't expect you to fully optimise the entire form, there are a couple of 
quick wins we would expect you to achieve within a couple of hours.

Here, you can provide further details on how this Big Form app should 
be changed to improve performance further.

**Thank you for your time!**
