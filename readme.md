# SHOOTING GAME

# What is the Game about

There will be multiple moving objects flying around the screen, the player can shoot them and build-up their score.

# Technology Employes

1. HTML5
2. CSS
3. Java Script

# Layout of the game
Here is a hand drawn picture of the proposed pages

1. Initial landing page :  provides basic instruction regarding the rules of the game - setting user expectation regarding output - PLAY BUTTON that takes the player to the game arena

2. Game Arena - where players play the game and manipulate their score

![image](https://user-images.githubusercontent.com/119079394/209360150-48915a67-3cfb-493f-8f35-fe4a9156d98a.png)

3. End page - how the page would look after the game is over
![image](https://user-images.githubusercontent.com/119079394/209360653-132eb0dd-779d-439c-868c-0733145f0dc3.png)

# Code Info
1. Create a class of objects which shall move across the canvas area, in-and-out through a repeated animation loop
2. Repeated animation loop can be created with the help of requestAnimationFrame(callback) & timestamp
3. The objects could be turned into an array and be filtered
4. Objects leaving the canvas area can be push() 'ed out of the Array and .filter 'ed
5. Objects could be spread accross the whole canvas: with the help of Array literal spread operator [... object]
6. Shooting can be done by using cursor.eventListener 
7. Coilision can be targeted with the help of x, y, height and width values
8. Upon coilision the object disapears and the score increases
