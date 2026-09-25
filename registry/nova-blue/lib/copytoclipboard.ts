import { toast } from "react-hot-toast";

function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(
      () => {
        console.log('Text copied to clipboard');
        toast.success('Copied to clipboard!', {
          position: 'top-right',
        });
      },
      (err) => {
        console.error('Could not copy text: ', err);
        toast.error('Failed to copy text!', {
          position: 'top-right',
        });
      }
    );
  } else {
    console.warn('Clipboard API not supported');
  }
}

export { copyToClipboard };
