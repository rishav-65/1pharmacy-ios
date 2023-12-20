import { Purchases } from "@EntityHandlers";
import { useIsFocused } from "@react-navigation/native";

const PurchasesTabPanel = () => {
    const isFocused = useIsFocused();

    return <Purchases isFocused={isFocused} bottomTabsMounted />
}

export default PurchasesTabPanel;