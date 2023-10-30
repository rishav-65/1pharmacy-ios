import ToastBaseProfiles from "./common";
import ToastBaseStyle from "./commonStyle";

const getCustomToastProfile = ({ title, description, template }: { title: string, description?: string, template: string }) => {
    return { ...ToastBaseProfiles[template], title, description }
}

const ToastProfiles = {
    ...ToastBaseProfiles
}

export { ToastProfiles, ToastBaseStyle, getCustomToastProfile }