# quizparov-2

Quizparov 2 is an experimental chess openings trainer. It's based on the three pillars of mastering any art: repetition, repetition, and more repetition. It's designed to be easy to use, requiring no setup regarding which lines to practice - you can basically just start picking moves and the system will quiz you to assess whether you can remember which move to play in each position. Any wrong choice is severely punished, requiring the player to start over from move one, as a way to reinforce memorization.

Quizparov 2 utilizes [Lichess API](https://lichess.org/api) for fetching data about the statistics of possible moves, as well as the [vue3-chessboard](https://github.com/qwerty084/vue3-chessboard) component for representing the chess board. It's written in typescript using Vue framework.

Todo:  
1. [ ] Language setting  
2. [ ] Display name of opening  
3. [ ] Visual representation of lines  
4. [ ] Backend service for handling user accounts and storing repertoires  
5. [ ] Setting for number of moves considered by opponent  
6. [ ] Setting for maximum depth  
7. [ ] Option to select multiple moves in a position  

