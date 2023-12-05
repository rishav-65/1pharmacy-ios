import { ScrollView } from "native-base";

const HorizontalScrollableSection = (props: any) => {
    return ( 
        <ScrollView style={props.containerStyle} horizontal={true} showsHorizontalScrollIndicator={false}>
            {props.children}
        </ScrollView>
     );
}
 
export default HorizontalScrollableSection;