import toast from "react-hot-toast";

export function Toast(type: any, message: any) {

    if (type === "success") {
        toast.success(message, {
            style: {
            //   border: '1px solid #713200',
              padding: '8px',
              color: 'white',
              fontSize: "0.8rem",
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
            //   border: '1px solid #713200',
                padding: '8px',
                color: 'white',
                fontSize: "0.8rem",
                backgroundColor: "#eb3b3b"
            },
            iconTheme: {
                primary: 'white',
                secondary: '#eb3b3b',
            },
        });
    }
}