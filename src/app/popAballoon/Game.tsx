"use client";
import React, {
    Fragment,
    MutableRefObject,
    useEffect,
    useRef,
    useState,
} from "react";
import gsap from "gsap";

const TIME_LIMIT = 30000;
const MOLE_SCORE = 100;
const NUMBER_OF_MOLES = 5;
const POINTS_MULTIPLIER = 0.9;
const TIME_MULTIPLIER = 1.25;

const generateMoles = (amount: number) =>
    new Array(amount).fill(0).map(() => ({
        speed: gsap.utils.random(0.5, 1),
        delay: gsap.utils.random(0.5, 4),
        points: MOLE_SCORE,
    }));

const usePersistentState = (key: string = "", initialValue: number) => {
    const localStorageVal = globalThis.window?.localStorage.getItem(key);
    const [state, setState] = useState(
        localStorageVal ? JSON.parse(localStorageVal.toString()) : initialValue
    );
    useEffect(() => {
        globalThis.window?.localStorage.setItem(key, state);
    }, [key, state]);
    return [state, setState];
};

const Moles = ({ children }: { children: JSX.Element[] }) => (
    <div className="moles">{children}</div>
);

type MoleType = {
    onWhack: (point: number) => void;
    points: number;
    delay: number;
    speed: number;
    pointsMin?: number;
};
const Mole = ({ onWhack, points, delay, speed, pointsMin = 10 }: MoleType) => {
    const [whacked, setWhacked] = useState(false);
    const bobRef = useRef<any>(null);
    const pointsRef = useRef<number>(points);
    const buttonRef = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        gsap.set(buttonRef.current, {
            yPercent: 100,
            display: "block",
        });
        bobRef.current = gsap.to(buttonRef.current, {
            yPercent: 0,
            duration: speed,
            yoyo: true,
            repeat: -1,
            delay: delay,
            repeatDelay: delay,
            onRepeat: () => {
                pointsRef.current = Math.floor(
                    Math.max(pointsRef.current * POINTS_MULTIPLIER, pointsMin)
                );
            },
        });
        return () => {
            if (bobRef.current) bobRef.current?.kill();
        };
    }, [pointsMin, delay, speed]);

    useEffect(() => {
        if (whacked) {
            pointsRef.current = points;
            bobRef!.current!.pause();
            gsap.to(buttonRef.current, {
                yPercent: 100,
                duration: 0.1,
                onComplete: () => {
                    gsap.delayedCall(gsap.utils.random(1, 3), () => {
                        setWhacked(false);
                        bobRef.current
                            .restart()
                            .timeScale(
                                bobRef.current.timeScale() * TIME_MULTIPLIER
                            );
                    });
                },
            });
        }
    }, [points, whacked]);

    const whack = () => {
        setWhacked(true);
        onWhack(pointsRef.current);
    };
    return (
        <div className="mole-hole">
            <button className="mole" ref={buttonRef} onClick={whack}>
                <span className="sr-only">Whack</span>
            </button>
        </div>
    );
};

const Score = ({ value }: { value: number }) => (
    <div className="info-text">{`Score: ${value}`}</div>
);

type TimerType = {
    time: number;
    interval?: number;
    onEnd: () => void;
};
const Timer = ({ time, interval = 1000, onEnd }: TimerType) => {
    const [internalTime, setInternalTime] = useState<number>(time);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(
        time as unknown as ReturnType<typeof setTimeout>
    );
    const timeRef = useRef<number>(time);
    useEffect(() => {
        if (internalTime === 0 && onEnd) {
            onEnd();
        }
    }, [internalTime, onEnd]);
    useEffect(() => {
        timerRef.current = setInterval(
            () => setInternalTime((timeRef.current -= interval)),
            interval
        );
        return () => {
            clearInterval(timerRef.current);
        };
    }, [interval]);
    return <div className="info-text">{`Time: ${internalTime / 1000}s`}</div>;
};

const Game = () => {
    const [playing, setPlaying] = useState(false);
    const [finished, setFinished] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = usePersistentState("whac-a-mole-hi", 0);
    const [newHighScore, setNewHighScore] = useState(false);
    const [moles, setMoles] = useState(generateMoles(NUMBER_OF_MOLES));

    const onWhack = (points: number) => {
        setScore(score + points);
    };

    const endGame = () => {
        setPlaying(false);
        setFinished(true);
        if (score > highScore) {
            setHighScore(score);
            setNewHighScore(true);
        }
    };

    const startGame = () => {
        setScore(0);
        setPlaying(true);
        setFinished(false);
        setNewHighScore(false);
    };

    return (
        <Fragment>
            {!playing && !finished && (
                <Fragment>
                    <h1>Whac a Mole</h1>
                    <button onClick={startGame}>Start Game</button>
                </Fragment>
            )}
            {playing && (
                <Fragment>
                    <button className="mt-20 end-game" onClick={endGame}>
                        End Game
                    </button>
                    <div className="info mt-20">
                        <Score value={score} />
                        <Timer time={TIME_LIMIT} onEnd={endGame} />
                    </div>
                    <Moles>
                        {moles.map((item, index) => (
                            <Mole
                                key={index}
                                onWhack={onWhack}
                                points={item.points}
                                delay={item.delay}
                                speed={item.speed}
                            />
                        ))}
                    </Moles>
                </Fragment>
            )}
            {finished && (
                <Fragment>
                    {newHighScore && (
                        <div className="info-text">NEW High Score!</div>
                    )}
                    <Score value={score} />
                    <button onClick={startGame}>Play Again</button>
                </Fragment>
            )}
        </Fragment>
    );
};

export default Game;
