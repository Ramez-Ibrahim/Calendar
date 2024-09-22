# Calendar Web App - CS50x Final Project

#### Video Demo: https://youtu.be/q_TlSbrFK08

## Introduction

For my CS50x final project, I created a calendar web app inspired by Google Calendar. This project not only incorporates all the key concepts I learned during the course but also serves as a functional tool that I plan to use beyond the course. It allowed me to apply a broad range of technical skills, from user authentication to responsive design and error handling, making it a fitting conclusion to the CS50x curriculum.

## Project Overview

The web app is structured around eight main pages, each serving a specific purpose in the user experience:

- **Login**
- **Sign Up**
- **Apology**
- **Index**
- **New Password**
- **New Username**
- **Profile**
- **Layout**

These pages work together to create a seamless and intuitive user experience, with a focus on simplicity and functionality.

### Login Page

The first point of interaction for users is the **Login** page. This page contains fields for a username and password. Users who already have an account can simply enter their credentials and proceed to the main calendar. However, if a user is visiting for the first time, they will need to create an account by navigating to the **Sign Up** page.

Ensuring security was a key part of this project, and the login system validates the user credentials against the database before granting access. Invalid login attempts are handled gracefully, redirecting the user to the **Apology** page, where they receive a friendly error message.

### Sign Up Page

The **Sign Up** page allows new users to register by filling in three fields: username, password, and password confirmation. The system requires the password to be entered twice for validation purposes, ensuring that users do not accidentally mistype their password. Usernames must be unique, and if a chosen username has already been taken, the user is redirected to the **Apology** page, where a clear error message explains the issue. Once the sign-up process is complete, the user is redirected back to the **Login** page.

### Apology Page

The **Apology** page serves as a user-friendly error handler. Rather than confusing users with generic error messages, the app gently guides them with a cat-themed visual and custom error messages. This page is inspired by the **finance** problem set in CS50x, where user-friendly error handling was introduced. For example, if a username is already taken, the apology page might display "USERNAME ALREADY TAKEN" in a friendly manner. This page helps maintain a positive user experience, even when things go wrong.

### Index Page (Calendar)

The **Index** page is where users will spend most of their time. It functions as the main calendar interface and displays the current month with today’s date highlighted. Above the calendar, there are four key buttons:

- **Today**: Instantly takes the user back to the current day, no matter how far they’ve navigated.
- **Forward**: Allows the user to view upcoming months.
- **Backward**: Allows the user to view previous months.
- **Profile**: Redirects the user to their profile page.

Users can create one event per day, which consists of a title and a color. Once saved, the event appears on the calendar with its corresponding color, giving users a simple visual cue. If a user needs to delete an event, they can click on it and remove it with ease. This design was chosen for its simplicity and ease of use, as the goal was to create a practical tool that users would feel comfortable using daily.

### Profile Page

The **Profile** page offers users access to their account information. Here, users can see their current username and have the option to log out or update their username or password. These actions redirect the user to either the **New Username** or **New Password** pages, depending on their choice.

### New Username Page

If a user chooses to change their username, they are taken to the **New Username** page, where they can input a new username. Usernames are unique in the system, meaning that no two users can have the same one. If the entered username is already in use, the user is redirected to the **Apology** page, where an appropriate error message is displayed. Once a valid username is entered, the change is saved, and the user is redirected back to the **Profile** page.

### New Password Page

The **New Password** page is designed with security in mind. Users must first enter their current password to verify their identity before changing it. They must then input their new password twice to ensure there are no typing errors. This double-entry system ensures that users lock in their new password with confidence, while the current password check protects against unauthorized changes. After the password is successfully changed, the user is redirected to the **Profile** page.

### Layout Page

Although the **Layout** page is not visible to users, it plays a critical role in the design and functionality of the website. This page serves as a template for all other pages, ensuring that the site has a consistent and professional appearance. By using a layout page, I was able to save a significant amount of development time while also maintaining a cohesive design across the entire application.

## Conclusion

This calendar web app was a challenging and rewarding project that allowed me to integrate all the knowledge I acquired throughout CS50x. From creating a secure login system to building a fully functional calendar with event management, this project represents the culmination of my efforts in the course.

I would like to express my gratitude to David Malan and the entire CS50x team for providing such an incredible learning opportunity. This project is just the beginning, as I plan to continue refining and using this calendar web app for years to come.
