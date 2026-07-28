interface AlertProps {
  type: 'error' | 'success';
  message: string;
}

const styles = {
  error: 'bg-error-50 border border-error-200 text-error-700',
  success: 'bg-success-50 border border-success-200 text-success-700',
};

export const Alert = ({ type, message }: AlertProps) => (
  <div className={`${styles[type]} px-4 py-3 rounded-lg mb-6 text-sm`}>
    {message}
  </div>
);