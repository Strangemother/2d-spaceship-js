A minimal viable product for 2D ship flight

+ A div
+ In a vectored 'space'

inputs move the div. This is a space ship.

Inputs from the keyboard or controller applied velocity and direction to the ship.

Animation frames are the standard animation clock, moving a Div per tick.

In the first iteration the ship will wrap around the a single grid space. In future iteration there are many grid spaces.

---

The ship will be a simple class, receiving ticks per step.
The velocity is persistent similar to a zero friction space
The rotation governs the forward direction
power is applied when input to _forward_



