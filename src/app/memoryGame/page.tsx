"use client";
import { useState, useEffect } from "react";

const board = [
    "🤖",
    "👽",
    "👻",
    "🤡",
    "🐧",
    "🦚",
    "😄",
    "🚀",
    "👨‍🦰",
    "😂",
    "😩",
    "👀",
    "😛",
    "👿",
    "🍐",
    "👨‍🦲",
    "🧑‍🦱",
    "🙇‍♀️",
];

export default function MemoryGame() {
    const [boardData, setBoardData] = useState<string[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedCards, setMatchedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);

    useEffect(() => {
        if (matchedCards.length == 25) {
            setGameOver(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [moves]);

    const initialize = () => {
        shuffle();
        setGameOver(false);
        setFlippedCards([]);
        setMatchedCards([]);
        setMoves(0);
    };

    useEffect(() => {
        initialize();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const shuffle = () => {
        const shuffledCards = [...board, ...board]
            .sort(() => Math.random() - 0.5)
            .map((v) => v);
        setBoardData(shuffledCards);
    };

    const updateActiveCards = (i: number) => {
        if (!flippedCards.includes(i)) {
            if (flippedCards.length == 1) {
                const firstIdx = flippedCards[0];
                const secondIdx = i;
                if (boardData[firstIdx] == boardData[secondIdx]) {
                    setMatchedCards((prev) => [...prev, firstIdx, secondIdx]);
                }

                setFlippedCards([...flippedCards, i]);
            } else if (flippedCards.length == 2) {
                setFlippedCards([i]);
            } else {
                setFlippedCards([...flippedCards, i]);
            }

            setMoves((v) => v + 1);
        }
    };

    return (
        <div className="container-m mx-auto px-4 bg-slate-400">
            <div className="menu">
                <p>{`Moves - ${moves}`}</p>
            </div>

            <div className="board">
                {boardData.map((data, i) => {
                    const flipped = flippedCards.includes(i) ? true : false;
                    const matched = matchedCards.includes(i) ? true : false;
                    return (
                        <div
                            onClick={() => {
                                updateActiveCards(i);
                            }}
                            key={i}
                            className={`card ${
                                flipped || matched ? "active" : ""
                            } ${matched ? "matched" : ""} ${
                                gameOver ? "gameover" : ""
                            }`}>
                            <div className="card-front">{data}</div>
                            <div className="card-back"></div>
                        </div>
                    );
                })}
            </div>
            <div className="menu">
                <p>{`GameOver - ${gameOver}`}</p>
                <button onClick={() => initialize()} className="reset-btn">
                    Reset
                </button>
            </div>
        </div>
    );
}
