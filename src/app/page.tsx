import Image from "next/image";

export default function Home() {
    return (
        <>
            <div className="container mx-auto px-4 flex content-center justify-center items-center	">
                <Image
                    src="/images/welcome-1041_256.gif"
                    alt="Welcome..."
                    width="300"
                    height="500"
                />
            </div>
        </>
    );
}
