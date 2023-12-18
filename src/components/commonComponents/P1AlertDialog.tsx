import { AlertDialog, Button } from "native-base";
import { useRef, useState } from "react";

const P1AlertDialog = ({ isOpen, toggleOpen, heading, body, buttons }: { isOpen: boolean, toggleOpen: any, heading: string, body: string, buttons: any[] }) => {

    const cancelRef = useRef(null);

    const dialogButtons = [
        {
            label: 'Cancel',
            variant: 'unstyled',
            action: toggleOpen,
            ref: cancelRef
        },
        ...buttons
    ]

    return (
        <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={toggleOpen}>
            <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>{heading}</AlertDialog.Header>
                {
                    body
                    && <AlertDialog.Body>
                        {body}
                    </AlertDialog.Body>
                }
                <AlertDialog.Footer>
                    <Button.Group>
                        {
                            dialogButtons.map((button: any, index: number) => (
                                <Button key={index} variant={button.variant} style={button.style} onPress={button.action} ref={button.ref}>
                                    {button.label}
                                </Button>
                            ))
                        }
                    </Button.Group>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog>
    );
}

export default P1AlertDialog;