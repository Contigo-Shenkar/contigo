import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notify = () => {
  const notify = (type) => {
    switch (type) {
      case "success":
        toast.success("Show Success");
        break;
      case "warning":
        toast.warning("Show Warning");
        break;
      case "error":
        toast.error("Show Error");
        break;
      default:
        toast("example");
        break;
    }
  };

  return (
    <div>
      <button onClick={() => notify("default")}>blabla</button>
      <button onClick={() => notify("success")}>Show Success</button>
      <button onClick={() => notify("warning")}>Show Warning</button>
      <button onClick={() => notify("error")}>Show Error</button>
      <button onClick={() => notify("default")}>blabla</button>
    </div>
  );
};

export default Notify;
