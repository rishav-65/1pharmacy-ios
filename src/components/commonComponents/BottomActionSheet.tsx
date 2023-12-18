import { Actionsheet, useDisclose, useKeyboardBottomInset } from "native-base";
import { TouchableHighlight } from "react-native";

const BottomActionSheet = (props: any) => {
    const { isOpen, onOpen, onClose } = useDisclose();
    
    const { SheetContent } = props;

    const bottomInset = useKeyboardBottomInset();

    const openSheet = () => {
        (props.beforeOpen || (()=>{}))();

        onOpen();

        (props.afterOpen || (()=>{}))();
    }

    return (<>
        <TouchableHighlight style={{
            paddingHorizontal: 2,
            paddingVertical: 1,
            borderRadius: 30,
            ...(props.handleContainerStyle || {})
        }} underlayColor="#EFEFEF" onPress={openSheet}>{props.handle}</TouchableHighlight>
        <Actionsheet isOpen={isOpen} onClose={onClose} bottom={(bottomInset > 0) ? bottomInset + 130 : bottomInset}>
            <Actionsheet.Content style={props.actionSheetStyle}>
                {
                    isOpen
                    && <SheetContent isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
                }
            </Actionsheet.Content>
        </Actionsheet>
    </>);
}

export default BottomActionSheet;