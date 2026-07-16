import { useEffect, useState } from "react"


type TWindowSize = {
    width: number,
    height: number;
}
export const useWindowSize = () => {

    const [windowSize, setWindowSize] = useState<TWindowSize>({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])

    return [windowSize.width, windowSize.height];

}