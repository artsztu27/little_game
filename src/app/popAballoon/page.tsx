import Game from "@/app/popAballoon/Game";
import "@/app/styles/popAballoon.css";

export default function PopAballoon() {
    return (
        <div className="game-p flex content-center justify-center items-center mt-20 flex-col">
            <Game />
        </div>
    );
}
