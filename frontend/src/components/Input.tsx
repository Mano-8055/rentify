import { memo, forwardRef, useState, useEffect, type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ChangeEvent } from 'react';

const ERROR_ICON = (
  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const UPLOAD_ICON = (
  <svg className="w-8 h-8 text-text-tertiary group-hover:text-green-400 transition-colors mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

interface BaseInputProps {
  label?: string;
  error?: string;
  hint?: string;
  className?: string;
  id?: string;
  required?: boolean;
}

interface InputProps extends BaseInputProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'required'> {}

const Input = memo(forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  className = '',
  id,
  required,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
          {required && <span className="text-error-light ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`input ${error ? 'input-error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={`${error ? errorId : ''} ${hint ? hintId : ''}`.trim() || undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="form-error" role="alert">
          {ERROR_ICON}
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="form-hint">{hint}</p>
      )}
    </div>
  );
}));

Input.displayName = 'Input';

interface TextareaProps extends BaseInputProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'required'> {
  rows?: number;
}

const Textarea = memo(forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  hint,
  className = '',
  id,
  rows = 3,
  required,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
          {required && <span className="text-error-light ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={inputId}
        rows={rows}
        className={`input resize-none ${error ? 'input-error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={`${error ? errorId : ''} ${hint ? hintId : ''}`.trim() || undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="form-error" role="alert">
          {ERROR_ICON}
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="form-hint">{hint}</p>
      )}
    </div>
  );
}));

Textarea.displayName = 'Textarea';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends BaseInputProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'required'> {
  options?: SelectOption[];
  placeholder?: string;
}

const Select = memo(forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  hint,
  options = [],
  placeholder,
  className = '',
  id,
  required,
  ...props
}, ref) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
  const errorId = `${selectId}-error`;
  const hintId = `${selectId}-hint`;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={selectId} className="label">
          {label}
          {required && <span className="text-error-light ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={`input appearance-none ${error ? 'input-error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={`${error ? errorId : ''} ${hint ? hintId : ''}`.trim() || undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={errorId} className="form-error" role="alert">
          {ERROR_ICON}
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="form-hint">{hint}</p>
      )}
    </div>
  );
}));

Select.displayName = 'Select';

interface FileUploadProps extends BaseInputProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
}

const FileUpload = memo(forwardRef<HTMLInputElement, FileUploadProps>(({
  label,
  error,
  hint,
  accept = 'image/*',
  multiple = false,
  maxFiles = 5,
  onChange,
  className = '',
  id,
  children,
  required,
  ...props
}, ref) => {
  const uploadId = id || 'file-upload';
  const errorId = `${uploadId}-error`;
  const hintId = `${uploadId}-hint`;
  const [previews, setPreviews] = useState<string[]>([]);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []).slice(0, maxFiles);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
    onChange?.(event);
  }

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={uploadId} className="label">
          {label}
          {required && <span className="text-error-light ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <label
        className="flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed border-border-default hover:border-green-500/30 cursor-pointer transition-all hover:bg-green-500/3 group"
      >
        {children || (
          <>
            {UPLOAD_ICON}
            <span className="text-sm text-text-tertiary group-hover:text-text-secondary transition-colors">
              Click to upload {multiple ? `images (max ${maxFiles})` : 'image'}
            </span>
          </>
        )}
        <input
          ref={ref}
          id={uploadId}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={`${error ? errorId : ''} ${hint ? hintId : ''}`.trim() || undefined}
          {...props}
        />
      </label>
      {previews.length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap" role="list" aria-label="Image previews">
          {previews.map((src, i) => (
            <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border-subtle" role="listitem">
              <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      )}
      {error && (
        <p id={errorId} className="form-error" role="alert">
          {ERROR_ICON}
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="form-hint">{hint}</p>
      )}
    </div>
  );
}));

FileUpload.displayName = 'FileUpload';

interface CheckboxProps extends BaseInputProps {
  className?: string;
  id?: string;
}

const Checkbox = memo(forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  className = '',
  id,
  required,
  ...props
}, ref) => {
  const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <input
        ref={ref}
        type="checkbox"
        id={checkboxId}
        className="w-4 h-4 mt-0.5 rounded border-border-default text-green-500 focus:ring-2 focus:ring-green-500/20 focus:ring-offset-2 focus:ring-offset-background-primary"
        {...props}
      />
      {label && (
        <label htmlFor={checkboxId} className="text-sm text-text-secondary cursor-pointer leading-relaxed">
          {label}
          {required && <span className="text-error-light ml-1" aria-hidden="true">*</span>}
        </label>
      )}
    </div>
  );
}));

Checkbox.displayName = 'Checkbox';

export { Input, Textarea, Select, FileUpload, Checkbox };