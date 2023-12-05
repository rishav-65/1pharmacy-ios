import { Actionsheet, useDisclose } from "native-base";
import { TouchableHighlight } from "react-native";

const BottomActionSheet = (props: any) => {
    const { isOpen, onOpen, onClose } = useDisclose();
    const {SheetContent} = props;
    return (<>
        <TouchableHighlight style={{
            paddingHorizontal: 2,
            paddingVertical: 1,
            borderRadius: 30
        }} underlayColor="#EFEFEF" onPress={onOpen}>{props.handle}</TouchableHighlight>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content style={props.actionSheetStyle}>
                <SheetContent isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
            </Actionsheet.Content>
        </Actionsheet>
    </>);
}

export default BottomActionSheet;