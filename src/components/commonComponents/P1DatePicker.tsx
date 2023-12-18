import P1Styles from "@P1StyleSheet"
import moment from "moment"
import { Text, View } from "native-base"
import { useState } from "react"
import { StyleSheet, TouchableHighlight } from "react-native"
import DatePicker from "react-native-date-picker"

const styles = StyleSheet.create({
    datePickerField: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        ...P1Styles.shadow
    },
    datePickerText: {
        fontSize: 17
    }
})

const P1DatePicker = ({ children, onConfirm, inputStyle, value, format, mode }: any) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <TouchableHighlight underlayColor="#EFEFEF" onPress={() => setOpen(true)}>
                {
                    children
                    || <View style={{ ...styles.datePickerField, ...(inputStyle || {}) }}>
                        <Text style={styles.datePickerText}>
                            {
                                moment.unix(value).format(
                                    format
                                        ? format
                                        : (
                                            (mode === 'date')
                                                ? 'D MMMM YYYY'
                                                : (
                                                    (mode === 'time')
                                                        ? 'hh:mm A'
                                                        : 'D MMMM YYYY | hh:mm A'
                                                )
                                        )
                                )
                            }
                        </Text>
                    </View>
                }
            </TouchableHighlight>
            <DatePicker
                modal
                mode={mode || 'datetime'}
                open={open}
                date={new Date(value * 1000)}
                onConfirm={(date: any) => {
                    setOpen(false);
                    
                    (onConfirm || (() => { }))(date.getTime() / 1000);
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
        </>
    )
}

export default P1DatePicker;