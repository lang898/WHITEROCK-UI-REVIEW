import React, { useId } from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  hint?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, error, hint, className = '', ...props },
  ref,
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const messageId = `${inputId}-message`;

  return (
    <label className={`wr-field input-field ${className}`.trim()} htmlFor={inputId}>
      <span>{label}</span>
      <input
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={error || hint ? messageId : undefined}
        {...props}
      />
      {(error || hint) && (
        <small id={messageId} className={error ? 'wr-field__error' : 'wr-field__hint'}>
          {error || hint}
        </small>
      )}
    </label>
  );
});
