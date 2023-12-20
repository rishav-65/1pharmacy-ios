import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { View } from "native-base";
import { StyleSheet } from "react-native";

const backgroundIcons: IconProp[] = [
    'stethoscope',
    'hospital',
    'tablet',
    'syringe',
    'prescription-bottle-medical',
    'prescription-bottle',
    'prescription',
    'pills',
    'house-medical',
    'house-chimney',
    'file-prescription',
    'capsules',
]

const styles = StyleSheet.create({
    backgroundContainer: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        overflow: 'hidden'
    },
    backgroundIcon: {
        margin: 2,
        color: '#EAEAEA'
    }
})

const MedicBackground = ({ width, height }: { width: number, height: number }) => {
    const iconsCount = Math.round((height * width) / 256);

    return (
        <View style={{ ...styles.backgroundContainer, width, height }}>
            {
                Array.from({ length: (iconsCount - 0) / 1 + 1 }, (value, index) => 0 + index * 1).map((index) => (
                    <FontAwesomeIcon size={20} style={{ ...styles.backgroundIcon, transform: [{ rotate: `${Math.floor(Math.random() * 360)}deg` }] }} icon={backgroundIcons[Math.floor(Math.random() * 11)]} />
                ))
            }
        </View>
    );
}

export default MedicBackground;