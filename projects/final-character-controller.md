---
title: "Final Character Controller"
subtitle: "3D physics-based character movement and locomotor system developed for games in Unity."
visibility: "public"
category: "games"
tech_stack: ["C# / Unity"]
status: "Released"
github_url: "https://github.com/PoltorProgrammer/FinalCharacterController"
demo_url: ""
hidden: false
---

# Final Character Controller (Unity & C#)

A highly responsive, robust, and mathematically sound 3D physics-based character controller built in C# for the Unity game engine.

## Overview

Default game engines movement components often feel floaty, suffer from slope-slipping, or fail to handle complex physics-based colliders accurately. **Final Character Controller** provides game developers with a polished locomotor movement script that handles running, jumping, slope management, and momentum-based friction smoothly.

## Key Features

- **Physics-Based Locomotion** — Uses Unity's `Rigidbody` system directly instead of simple translate calls, ensuring accurate interaction with moving platforms, gravity fields, and external forces.
- **Slope-Sliding Correction** — Custom algorithms that prevent characters from bouncing down slopes or slipping slowly when stationary on inclined surfaces.
- **Buffer-Based Input System** — Implements input buffering (e.g. allowing jump inputs a few milliseconds before hitting the ground) to make movements feel responsive and satisfying.
- **Modular Design** — Separates input collection, movement calculations, and animation triggers into distinct, clean C# components.

## Script Structure & Setup

```
├── CharacterController.cs   # Main locomotion logic and state handling
├── InputManager.cs          # Aggregates keyboard, mouse, and controller inputs
├── SlopeHandler.cs          # Calculates slope angles and raycasts physical surfaces
└── AnimationConnector.cs    # Links physical speeds to Unity Animator variables
```

> [!TIP]
> This character controller can be dropped directly into any new Unity 3D project to serve as the baseline movement script, getting you from a blank screen to a running protagonist in seconds.
