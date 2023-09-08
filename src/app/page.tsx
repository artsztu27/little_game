"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    return (
        <>
            <div className="container mx-auto px-4 flex content-center justify-center items-center flex-col	">
                <Image
                    src="/images/welcome-1041_256.gif"
                    alt="Welcome..."
                    width="300"
                    height="500"
                />
                <h1>Select a little game</h1>
                <div className="flex content-center justify-center items-center flex-row px-5 bt-game">
                    <button onClick={() => router.push("/memoryGame")}>
                        Memory Game
                    </button>

                    <button onClick={() => router.push("/ticTacToe")}>
                        Tic-tac-toe
                    </button>

                    <button onClick={() => router.push("/popAballoon")}>
                        Whac a Mole
                    </button>
                </div>
            </div>
        </>
    );
}
