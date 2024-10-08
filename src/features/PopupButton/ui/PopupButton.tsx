import { ReactNode, useEffect, useRef, useState } from "react";
import * as cls from "./PopupButton.module.scss";
import { compareClasses as cmcl } from "shared/lib/classNames";
import { Text } from "shared/ui/Text/ui/Text";
import { ModalWindow } from "features/ModalWindow/ui/ModalWindow";

interface PopupButtonProps {
    children: ReactNode;
    className?: string;
    contentWrapperClassName?: string;
    button: ReactNode;
    openToHor?: "left" | "right";
    openToVert?: "top" | "bottom";
    hideTime?: number;
}

export const PopupButton = (props: PopupButtonProps) => {
    const {
        className,
        contentWrapperClassName,
        children,
        button,
        openToHor = "right",
        openToVert = "bottom",
        hideTime = 0,
        ...otherProps
    } = props;
    const [isOpen, setIsOpen] = useState(false);
    const eventRef = useRef();
    const open = () => {
        const eventFunc = (e: MouseEvent) => {
            close();
            e.stopPropagation();
        };
        window.addEventListener("click", eventFunc);
        window.addEventListener("keyup", eventFunc);
        setIsOpen(true);
        if (hideTime)
            setTimeout(() => {
                close();
            }, hideTime);
    };
    const close = () => {
        window.removeEventListener("click", eventRef.current);
        window.removeEventListener("keyup", eventRef.current);
        eventRef.current = null;
        setIsOpen(false);
    };

    const toggle = () => (isOpen ? close() : open());

    const onButtonClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        toggle();
        e.stopPropagation();
    };

    const onContentClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
        e.stopPropagation();
    };

    return (
        <div className={cmcl(cls.PopupButton, {}, [className])} {...otherProps}>
            <span className={cls.button} onClick={onButtonClick}>
                {button}
            </span>

            <div
                style={{
                    opacity: isOpen ? 1 : 0,
                    zIndex: isOpen ? 100 : -100,
                    left: openToHor === "left" ? "auto" : "0",
                    right: openToHor === "right" ? "auto" : "0",
                    top: openToVert === "top" ? "auto" : "calc(100% + 5px)",
                    bottom:
                        openToVert === "bottom" ? "auto" : "calc(100% + 5px)",
                }}
                className={cmcl(cls.content, {}, [contentWrapperClassName])}
                onClick={onContentClick}
            >
                {children}
            </div>
        </div>
    );
};
