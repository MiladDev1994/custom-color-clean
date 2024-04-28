import toast from "react-hot-toast";

type TostType = "success" | "error"
export function Toast(type: TostType, message: any) {

    const publicStyle = {
        padding: '8px',
        color: 'white',
        fontSize: "0.8rem",
        backgroundColor: "#00aa44"
    }

    if (type === "success") {
        toast.success(message, {
            style: {
                ...publicStyle,
                backgroundColor: "#00aa44"
            },
            iconTheme: {
              primary: 'white',
              secondary: '#00aa44',
            },
        });
    } else if (type === "error") {
        toast.error(message, {
            style: {
                ...publicStyle,
                backgroundColor: "#eb3b3b"
            },
            iconTheme: {
                primary: 'white',
                secondary: '#eb3b3b',
            },
        });
    }
}