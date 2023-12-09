# BruinRun
Final project for UCLA CS174A Fall 2023

# Theme
Our final project is a video game that reflects the experience of walking through Bruinwalk, having to dodge starship delivery robots and awkwardly avoid people handing out flyers for their clubs. It is modeled after the genre of mobile run games such as Temple Run or Subway Surfer. Players attempt to make it through every level, each represting a scenic UCLA location, while evading pesky flyerers and starship robots.

# How to Operate
Press these keys on your keyboard to perform actions in the game.
- Restart: **`z`**
- Begin Run: **`q`**
- Move Left: **`a`**
- Move Right: **`d`**
- Jump: **`space`**

# Gameplay Overview 
The Bruinwalk game contains three scenes: Ackerman, Kerckhoff, and Janss, each separated by a blockade of red posters. The goal of the game is to reach the end of each scene without colliding with a starship bot or person flyering. The bots move horizontally on the walkway, and the flyer people approach the player from the side. If the player colllides with either enemy, they are given a flyer and lose the game. The game can be restarted using 'z'. 
Press enter to move past the start screen and see Bruinwalk. To start running, press 'q'. The player will run until the end of a scene is reached. The player can be moved left and right using the 'a' and 'd' keys, respectively. The player can jump over starships using the space bar, and can land on starships without losing the game. 
There is a scene graph in the lower left corner that displays the locations of the enemies and of the player on Bruinwalk. 
The game is won by making it through all three levels while avoiding a deadly collision. 


# Enemies 
### Flyer Person
Flyer persons spawn on the sides of the scene. Similar to what they do on actual Bruinwalk, once the player is within a certain range of them, they will walk out into the player's path, turning to them and attempting to hand them a flyer. These distance these enemies walk out is random, resulting in unpredictable gameplay. These enemies can not be jumped over and must be laterally avoided. Collision with a flyer person will result in the getting recruited to a club and losing the game. 
### Starship Robot
Starship delivery robots spawn randomly around the scene and will drive back and forth across the width of the scene, also very similar to what happens in real life. These enemies can be jumped over and landed on. If a player runs into a starship, their movement is frozen and they will quickly be approached by a flyerperson, resulting in them getting recruited to a club and losing the game.

# Advanced Features
### Collision detection:
Collision detection was required in our project to keep track of when players collided with an enemy. Our implementation used the bounding box technique. Additionally, we were able to optimize this technique for our specific project where the player's movement was predictable(they will always run forward). Thus, we only needed to apply the bounding box technique for enemies that were within a certain z-range of the player. It was also necessary for us to depict what kind of collision was occurring. Players can run into an enemy, resulting in a game ending collision, or they can jump over and potentially land on some of the enemies, resulting in a collision but one where the game is not ended. 

### Scene Graph:
When the player reaches a new level, they are stationary until pressing ['q']. However, regardless of if the player is stationary or running, enemies are moving around in front of them. In order to help the player plan the best time to start their heroic run, we implemented a scene graph, viewable in the bottom left of the screen, that gives a clear view of all of the enemies that are present in their current level. 

### Simple Physics:
As mentioned earlier, the player has the ability to jump, [“space”], to avoid the smaller enemies. Subsequently, the player can jump on top of these enemies, landing on them and eventually falling off. Along with collision detection, this involved the simulation of gravity.

### Bump Mapping:
To make the scene more realistic, we implemented bump mapping on walkway that the player traverses. 

# Development Team
Jake Ekoniak \
Elizabeth Manka \
Osbert Sudjana \
Emma Lee
