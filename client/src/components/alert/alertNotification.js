
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notify = () => {
  const notify = (type) => {
    switch (type) {
      case 'success':
        toast.success('Show Success');
        break;
      case 'warning':
        toast.warning('Show Warning');
        break;
      case 'error':
        toast.error('Show Error');
        break;
      default:
        toast('example');
        break;
    }
  };

  return (
    <div>
      <button onClick={() => notify('default')}>blabla</button>
      <button onClick={() => notify('success')}>Show Success</button>
      <button onClick={() => notify('warning')}>Show Warning</button>
      <button onClick={() => notify('error')}>Show Error</button>
      <button onClick={() => notify('default')}>blabla</button>

      <ToastContainer
        position="top-right"
        closeOnClick={true}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
        autoClose={5000}
        draggable={true}
        closeButton={<p>Close</p>}
        icon={{
            success: <i className="fas fa-check-circle"></i>,
            warning: "⚠️",
            error: "❌",
            default: "ℹ️"
          }}
      />
    </div>
  );
};

export default Notify;
