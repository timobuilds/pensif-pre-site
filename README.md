# Pensif Pre-Site

**Context is currency.**

A 3D interactive galaxy visualization built with Three.js, displayed inside a folder-shaped viewport.

## Features

- Interactive 3D galaxy with orbit controls
- Zoom-in animation on load
- Spring-back camera behavior
- Responsive canvas with custom shaders

## Tech Stack

- Vanilla HTML, CSS, JavaScript
- [Three.js](https://threejs.org/) (r150)
- ES Modules

## Running Locally

1. Serve the project with a local HTTP server (required for ES modules):

   ```bash
   python3 -m http.server 8080
   ```

2. Open [http://localhost:8080](http://localhost:8080) in your browser.

## Project Structure

```
├── index.html      # Entry point
├── main.js         # Three.js setup, render loop, galaxy init
├── main.css        # Styles
├── animations/    # Camera animations (zoom, spring)
├── config/        # View configuration
├── objects/       # Galaxy object
├── scene/         # Render pipeline
├── shaders/       # Custom shaders
└── resources/     # Assets
```
