import { useEffect, useState } from "react";

export function useDinoGame() {
  const [dinoY, setDinoY] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [obstacleX, setObstacleX] = useState(100);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const gravity = 0.7;

  const jump = () => {
    if (dinoY === 0 && !gameOver) {
      setVelocity(12);
    }
  };

  const reset = () => {
    setDinoY(0);
    setVelocity(0);
    setObstacleX(100);
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // Dino physics
      setDinoY((prev) => {
        let next = prev + velocity;
        let newVelocity = velocity - gravity;

        if (next <= 0) {
          next = 0;
          newVelocity = 0;
        }

        setVelocity(newVelocity);
        return next;
      });

      // Move obstacle
      setObstacleX((prev) => {
        if (prev < -10) {
          setScore((s) => s + 1);
          return 100 + Math.random() * 30;
        }
        return prev - 5;
      });

      // Collision
      if (obstacleX < 20 && obstacleX > 5 && dinoY < 35) {
        setGameOver(true);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [velocity, obstacleX, dinoY]);

  return { dinoY, obstacleX, jump, gameOver, reset, score };
}
