import React from "react";
import GreetingSummaryCard from "./GreetingSummaryCard";
import HorizontalDescriptionListCard from "./HorizontalDescriptionListCard";
import SectionDescriptionListCard from "./SectionDescriptionListCard";
import VerticalDescriptionListCard from "./VerticalDescriptionListCard";
import DescItemCard from "./DescItemCard";
import ValueTitleBox from "./ValueTitleBox";
import ImageDetailsCard from "./ImageDetailsCard";
import DescActionsCard from "./DescActionsCard";
import KeyValDescCard from "./KeyValueDescCard";

const CardsIndex: {[key: string]: React.FC<any>} = {
    card_1: GreetingSummaryCard,
    card_2: HorizontalDescriptionListCard,
    card_3: SectionDescriptionListCard,
    card_4: VerticalDescriptionListCard,
    card_5: DescItemCard,
    card_6: ValueTitleBox,
    card_7: ImageDetailsCard,
    card_8: DescActionsCard,
    card_9: KeyValDescCard
};

const getCardByIndex = (cardId: string): React.FC => {
    if(!!CardsIndex[cardId]){
        return(CardsIndex[cardId])
    } else {
        return (()=>(<></>))
    }
}

export {getCardByIndex};

export default CardsIndex;