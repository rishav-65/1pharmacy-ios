import { StyleSheet } from "react-native";
import ToastBaseStyle from "./commonStyle";
import { ToastProfileType } from "./types";

const styles = StyleSheet.create({
    errorToast: {
        backgroundColor: '#fb3640',
    },
    successToast: {
        backgroundColor: '#f0d500'
    },
});

const ToastBaseProfiles: { [key: string]: ToastProfileType } = {
    success: {
        title: 'You have been successfully Logged In!',
        containerStyle: { ...ToastBaseStyle.toast, ...styles.successToast },
        titleStyle: ToastBaseStyle.toastText
    },
    error: {
        title: 'Something went wrong.',
        containerStyle: { ...ToastBaseStyle.toast, ...styles.errorToast },
        titleStyle: ToastBaseStyle.toastText
    }
}

export default ToastBaseProfiles