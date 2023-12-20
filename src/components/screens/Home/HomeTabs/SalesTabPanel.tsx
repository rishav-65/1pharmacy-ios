import { Sales } from "@EntityHandlers";
import { useIsFocused } from "@react-navigation/native";

const SalesTabPanel = () => {

    const isFocused = useIsFocused();

    return <Sales isFocused={isFocused} bottomTabsMounted />
}

export default SalesTabPanel;