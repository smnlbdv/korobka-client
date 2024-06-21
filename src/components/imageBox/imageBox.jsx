import keycon from "keycon";
import { useRef, useState } from "react";
import Moveable from "react-moveable";

keycon.setGlobal();

const ImageBox = ({ src }) => {
    const textRef = useRef(null);
    const [isActive, setIsActive] = useState(false);

    return (
        <>
            <img
                src={src}
                alt=""
                onMouseEnter={() => setIsActive(true)}
                onClick={() => setIsActive(!isActive)}
                ref={textRef}
            />
            <Moveable
                target={isActive && textRef}
                scalable={isActive}
                keepRatio={true}
                draggable={true}
                snappable={true}
                bounds={{left: 0, top: 0, bottom: 0, right: 0, position: "css" }}
                onScaleStart={e => {
                    e.setFixedDirection([0, 0]);
                }}
                onClick={() => {
                    setIsActive(true);
                }}
                onDragStart={() => {
                    setIsActive(true);
                }}
                onDrag={e => {
                    e.target.style.transform = e.transform;
                }}
                onBeforeScale={e => {
                    if (keycon.global.shiftKey) {
                        e.setFixedDirection([-1, -1]);
                    } else {
                        e.setFixedDirection([0, 0]);
                    }
                }}
                onScale={e => {
                    e.target.style.transform = e.drag.transform;
                }}
            />
        </>
    );
};

export default ImageBox;