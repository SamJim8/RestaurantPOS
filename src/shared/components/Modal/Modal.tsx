import type { ReactNode } from "react";
import "./modal.css";

interface ModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
}

export function Modal(props: ModalProps) {
    const { isOpen, title, onClose, children } = props;
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose} role="presentation">
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                <div className="modal-header">
                    <h3>{title}</h3>
                    <button type="button" onClick={onClose} className="modal-close">
                        X
                    </button>
                </div>

                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}
