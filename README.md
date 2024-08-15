# Language Speed Train - A "Hello, Galaxy" for React Native/Expo

## To Install & Run

Requirements:

- node and git installed
- iOS Simulator running, Android Simulator running, or connected device

In a new folder, run the following commands from terminal

- git clone https://github.com/remarcotte/LanguageSpeedTrain.git .
- npm install

If running on a connected device...

- if device is Android, type "npx expo run:android --device"
- if device is iOS, type "npx expo run:ios --device"

If running on a simulator...

- if running Android simulator, type "a"
- if running iOS simulator, type "i"

## Not a "Hello, World"

While "Hello, World"s are common to describe features in software development. They aren't always useful in seeing how features may be integrated into a larger application. Language Speed Train is a "Hello, Galaxy" for React Native/Expo - an integration of many features into a robust app.

## Purpose

This code base was the result of:

1. Seeing how effective ChatGPT would be in creating a robust app. - The results were decidedly mixed though leaning towards disappointing. A write-up of the results is being written. Link to the article will be included when complete.
2. Creating an app with some basic useful functionality.
3. Creating a template for different features/practices in React Native/Expo.

## The Application

The application is a timed flashcard system. Given a deck of cards, the goal is to improve accuracy and speed through repeated game playing.

Users may add their own decks directly in the app. The app runs completely on device. There is no communication for ads, sending usage data, or anything else.

## Features Used

The following language features were used in creating the app:

- Async storage
- Custom splash page - always show
- SQLite database for deck and statistics storage
- CSV loading/parsing of new decks
- Timer
- Simple line charts
- Themed visual components
- Dropdown picker
- Light/dark mode theming
- Swipeable lists
- Toast
- Integrated error handling and logging
- Customize screen headers
- useState, useEffect, useRef, useCallback
- Custom navigation between text input fields
- File read
- Initialize on app start

This list may not be exhaustive - other features may have been included.

Should I need to use these features in the future, I have the option rely on this code as a reference/template for feature use.

## Evolving

This code base will continue to evolve. Additional functionality may be added for the app's sake or to use different language features.

In the future, the galaxy may be expanded by adding uses of:

- API use
- Interationalization
- Accessibility
- Centralizing error messages
- Use of context
- and more

Features under consideration for adding are:

- better upload issue reporting
- smarter response checking (case insensitivity, support multiple correct responses, recognize misspellings)
