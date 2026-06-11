// "use client";

// import { cn } from "@/lib/utils";
// import { Loader2Icon, CircleXIcon } from "@/components/icons/Icons";
// import {
//   useState,
//   forwardRef,
//   useRef,
//   type ReactNode,
//   type ChangeEvent,
//   type TextareaHTMLAttributes,
//   useEffect,
//   useCallback,
//   useImperativeHandle,
//   useId,
// } from "react";

// export type TextareaSize = "sm" | "md" | "lg";
// export type TextareaVariant = "default" | "filled" | "outline" | "ghost";

// export interface TextareaProps extends Omit<
//   TextareaHTMLAttributes<HTMLTextAreaElement>,
//   "onChange"
// > {
//   label?: ReactNode;
//   helperText?: ReactNode;
//   error?: ReactNode;
//   fullWidth?: boolean;
//   startIcon?: ReactNode;
//   endIcon?: ReactNode;
//   onValueChange?: (value: string) => void;
//   onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
//   requiredSign?: boolean;
//   minRows?: number;
//   maxRows?: number;
//   autoResize?: boolean;
//   maxLength?: number;
//   showCount?: boolean;
//   clearable?: boolean;
//   loading?: boolean;
//   size?: TextareaSize;
//   variant?: TextareaVariant;
// }

// const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
//   (
//     {
//       className,
//       label,
//       helperText,
//       error,
//       fullWidth = false,
//       startIcon,
//       endIcon,
//       onValueChange,
//       onChange,
//       value,
//       defaultValue,
//       requiredSign = false,
//       required = false,
//       minRows = 3,
//       maxRows = 10,
//       autoResize = false,
//       maxLength,
//       showCount = false,
//       clearable = false,
//       loading = false,
//       size = "md",
//       variant = "default",
//       id,
//       disabled,
//       ...props
//     },
//     ref,
//   ) => {
//     // State for controlled/uncontrolled value
//     const [internalValue, setInternalValue] = useState<string>(
//       (value as string) || (defaultValue as string) || "",
//     );
//     const isControlled = value !== undefined;
//     const currentValue = isControlled ? (value as string) : internalValue;
//     const innerRef = useRef<HTMLTextAreaElement | null>(null);

//     // Combine refs
//     useImperativeHandle(ref, () => innerRef.current!);

//     // Unique IDs for accessibility
//     const uniqueId = useId();
//     const inputId = id || `textarea-${uniqueId}`;
//     const descriptionId = `${inputId}-description`;
//     const errorId = `${inputId}-error`;

//     // Auto-resize logic
//     const adjustHeight = useCallback(() => {
//       const element = innerRef.current;
//       if (!element || !autoResize) return;

//       element.style.height = "auto";
//       const lineHeight = parseInt(getComputedStyle(element).lineHeight) || 20;
//       const minHeight = minRows * lineHeight + (size === "sm" ? 12 : size === "md" ? 18 : 24); // approx padding
//       const maxHeight = maxRows * lineHeight + (size === "sm" ? 12 : size === "md" ? 18 : 24);

//       const newHeight = Math.max(minHeight, Math.min(element.scrollHeight, maxHeight));
//       element.style.height = `${newHeight}px`;
//     }, [autoResize, minRows, maxRows, size]);

//     // Effect to adjust height controlled value changes
//     useEffect(() => {
//       adjustHeight();
//     }, [currentValue, adjustHeight]);

//     // Handle change
//     const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
//       const newValue = e.target.value;
//       if (!isControlled) {
//         setInternalValue(newValue);
//       }
//       onChange?.(e);
//       onValueChange?.(newValue);
//     };

//     // Handle clear
//     const handleClear = () => {
//       if (!isControlled) {
//         setInternalValue("");
//       }
//       onValueChange?.("");
//       if (innerRef.current) {
//         innerRef.current.value = "";
//         innerRef.current.focus();
//       }
//     };

//     // Styles
//     const sizeClasses = {
//       sm: "px-2.5 py-1.5 text-xs min-h-[60px]",
//       md: "px-3 py-2 text-sm min-h-[80px]",
//       lg: "px-4 py-3 text-base min-h-[100px]",
//     };

//     const variantClasses = {
//       default: "border-black/30 dark:border-white/30 bg-transparent ring-offset-background",
//       filled:
//         "border-transparent bg-muted/50 hover:bg-muted/70 focus:bg-background focus:border-primary",
//       outline:
//         "border-2 border-input bg-transparent hover:border-accent-foreground/20 focus:border-primary",
//       ghost: "border-transparent bg-transparent hover:bg-muted/50 focus:bg-background shadow-none",
//     };

//     // Character count
//     const charCount = currentValue.length;
//     const isOverLimit = maxLength && charCount > maxLength;

//     return (
//       <div className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "w-auto", className)}>
//         {/* Label */}
//         {label && (
//           <label
//             htmlFor={inputId}
//             className="text-sm font-medium dark:font-normal text-black/80 dark:text-white/80 cursor-pointer"
//           >
//             {label}
//             {(required || requiredSign) && <span className="text-red-500 ml-1">*</span>}
//           </label>
//         )}

//         <div className="relative group">
//           {/* Start Icon */}
//           {startIcon && (
//             <div className="absolute left-3 top-3 text-muted-foreground pointer-events-none z-10 font-bold">
//               {startIcon}
//             </div>
//           )}

//           {/* Textarea */}
//           <textarea
//             id={inputId}
//             ref={innerRef}
//             className={cn(
//               "flex w-full rounded-md border  text-sm ring-offset-background dark:placeholder:text-white/70 placeholder:text-black/70 focus-visible:outline-none focus:border-black/50 dark:focus:border-white/40 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
//               sizeClasses[size],
//               variantClasses[variant],
//               startIcon && "pl-9",
//               (endIcon || clearable || loading) && "pr-9",
//               error && "border-red-500 focus-visible:ring-red-500",
//               !autoResize && "resize-y",
//               autoResize && "resize-none overflow-hidden",
//             )}
//             value={currentValue}
//             onChange={handleChange}
//             maxLength={maxLength}
//             disabled={disabled || loading}
//             aria-invalid={!!error}
//             aria-describedby={error ? errorId : helperText ? descriptionId : undefined}
//             rows={minRows}
//             {...props}
//           />

//           {/* End Actions (Icon / Clear / Loading) */}
//           <div className="absolute right-3 top-3 flex items-center gap-2 text-black/50 dark:text-white/50">
//             {loading ? (
//               <Loader2Icon className="animate-spin h-4 w-4 text-black/50 dark:text-white/50" />
//             ) : clearable && currentValue && !disabled ? (
//               <button
//                 type="button"
//                 onClick={handleClear}
//                 className="hover:text-black/50 hover:dark:text-white/50 transition-colors focus:outline-none"
//                 aria-label="Clear text"
//               >
//                 <CircleXIcon className="h-4 w-4" />
//               </button>
//             ) : endIcon ? (
//               <div className="pointer-events-none">{endIcon}</div>
//             ) : null}
//           </div>
//         </div>

//         {/* Footer: Helper Text / Error + Counter */}
//         <div className="flex items-start justify-between gap-2">
//           <div className="flex-1">
//             {error ? (
//               <p
//                 id={errorId}
//                 className="text-xs font-medium text-red-500 flex items-center gap-1 mt-0.5"
//               >
//                 {error}
//               </p>
//             ) : helperText ? (
//               <p id={descriptionId} className="text-xs text-black/50 dark:text-white/50 mt-0.5">
//                 {helperText}
//               </p>
//             ) : null}
//           </div>

//           {showCount && (
//             <p
//               className={cn(
//                 "text-xs text-black/50 dark:text-white/50 tabular-nums whitespace-nowrap mt-0.5",
//                 isOverLimit && "text-red-500 font-medium",
//               )}
//             >
//               {charCount} {maxLength && `/ ${maxLength}`}
//             </p>
//           )}
//         </div>
//       </div>
//     );
//   },
// );

// Textarea.displayName = "Textarea";

// export { Textarea };

"use client";

import { cn } from "@/lib/utils";
import { Loader2Icon, CircleXIcon } from "@/components/icons/Icons";
import {
  useState,
  forwardRef,
  useRef,
  type ReactNode,
  type ChangeEvent,
  type TextareaHTMLAttributes,
  useEffect,
  useCallback,
  useImperativeHandle,
  useId,
} from "react";

export type TextareaSize = "sm" | "md" | "lg";
export type TextareaVariant = "default" | "filled" | "outline" | "ghost";

export interface TextareaProps extends Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "onChange"
> {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onValueChange?: (value: string) => void;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  requiredSign?: boolean;
  minRows?: number;
  maxRows?: number;
  autoResize?: boolean;
  maxLength?: number;
  showCount?: boolean;
  clearable?: boolean;
  loading?: boolean;
  size?: TextareaSize;
  variant?: TextareaVariant;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      fullWidth = false,
      startIcon,
      endIcon,
      onValueChange,
      onChange,
      value,
      defaultValue,
      requiredSign = false,
      required = false,
      minRows = 3,
      maxRows = 10,
      autoResize = false,
      maxLength,
      showCount = false,
      clearable = false,
      loading = false,
      size = "md",
      variant = "default",
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    // -----------------------------
    // Controlled / Uncontrolled
    // -----------------------------
    const isControlled = value !== undefined;

    const [internalValue, setInternalValue] = useState((defaultValue as string) || "");

    const currentValue = isControlled ? String(value ?? "") : internalValue;

    // -----------------------------
    // Refs
    // -----------------------------
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useImperativeHandle(ref, () => textareaRef.current as HTMLTextAreaElement);

    // -----------------------------
    // Accessibility IDs
    // -----------------------------
    const generatedId = useId();

    const textareaId = id || `textarea-${generatedId}`;

    const helperId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;
    const counterId = `${textareaId}-counter`;

    const describedBy = [
      helperText && !error ? helperId : null,
      error ? errorId : null,
      showCount ? counterId : null,
    ]
      .filter(Boolean)
      .join(" ");

    // -----------------------------
    // Auto Resize
    // -----------------------------
    const adjustHeight = useCallback(() => {
      if (!autoResize || !textareaRef.current) return;

      const element = textareaRef.current;

      element.style.height = "auto";

      const computed = getComputedStyle(element);

      const lineHeight = parseFloat(computed.lineHeight) || 24;

      const paddingTop = parseFloat(computed.paddingTop) || 0;

      const paddingBottom = parseFloat(computed.paddingBottom) || 0;

      const minHeight = minRows * lineHeight + paddingTop + paddingBottom;

      const maxHeight = maxRows * lineHeight + paddingTop + paddingBottom;

      const nextHeight = Math.min(Math.max(element.scrollHeight, minHeight), maxHeight);

      element.style.height = `${nextHeight}px`;
    }, [autoResize, minRows, maxRows]);

    useEffect(() => {
      adjustHeight();
    }, [currentValue, adjustHeight]);

    // -----------------------------
    // Change Handler
    // -----------------------------
    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      const nextValue = e.target.value;

      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onChange?.(e);
      onValueChange?.(nextValue);
    };

    // -----------------------------
    // Clear Handler
    // -----------------------------
    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }

      onValueChange?.("");

      textareaRef.current?.focus();
    };

    // -----------------------------
    // Character Count
    // -----------------------------
    const characterCount = currentValue.length;

    const isOverLimit = typeof maxLength === "number" && characterCount > maxLength;

    // -----------------------------
    // Size Variants
    // -----------------------------
    const sizeClasses = {
      sm: "min-h-[72px] px-3 py-2 text-xs",
      md: "min-h-[96px] px-3 py-2 text-sm",
      lg: "min-h-[120px] px-4 py-3 text-base",
    };

    // -----------------------------
    // Visual Variants
    // -----------------------------
    const variantClasses = {
      default: "bg-background ring-1 ring-border",

      filled: "bg-muted ring-1 ring-transparent",

      outline: "bg-background ring-2 ring-border",

      ghost: "bg-transparent ring-0",
    };

    const textareaClasses = cn(
      // Layout
      "flex w-full rounded-md",

      // Typography
      "text-foreground",
      "placeholder:text-muted-foreground",

      // Animation
      "transition-all duration-200",

      // Variant
      variantClasses[variant],

      // Size
      sizeClasses[size],

      // Focus
      "focus-visible:outline-none",
      "focus-visible:ring",
      "focus-visible:ring-ring",

      // Disabled
      "disabled:cursor-not-allowed",
      "disabled:opacity-60",

      // Resize
      autoResize ? "resize-none overflow-hidden" : "resize-y",

      // Icons
      startIcon && "pl-10",

      (endIcon || clearable || loading) && "pr-10",

      // Error
      error && "ring-danger focus-visible:ring-danger/30",
    );

    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth && "w-full", className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className="cursor-pointer text-sm font-medium text-foreground"
          >
            {label}

            {(required || requiredSign) && (
              <span aria-hidden="true" className="ml-1 text-danger">
                *
              </span>
            )}
          </label>
        )}

        {/* Field */}
        <div className="relative">
          {/* Start Icon */}
          {startIcon && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-3 z-10 text-muted-foreground"
            >
              {startIcon}
            </div>
          )}

          {/* Textarea */}
          <textarea
            id={textareaId}
            ref={textareaRef}
            className={textareaClasses}
            value={currentValue}
            onChange={handleChange}
            rows={minRows}
            maxLength={maxLength}
            disabled={disabled || loading}
            required={required}
            aria-required={required}
            aria-invalid={!!error}
            aria-busy={loading}
            aria-describedby={describedBy.length > 0 ? describedBy : undefined}
            {...props}
          />

          {/* Right Actions */}
          <div className="absolute right-3 top-3 flex items-center gap-2">
            {loading ? (
              <Loader2Icon
                aria-hidden="true"
                className="h-4 w-4 animate-spin text-muted-foreground"
              />
            ) : clearable && currentValue && !disabled ? (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear textarea"
                className={cn(
                  "rounded-sm text-muted-foreground",
                  "transition-colors",
                  "hover:text-foreground",
                  "focus-visible:outline-none",
                  "focus-visible:ring",
                  "focus-visible:ring-ring",
                )}
              >
                <CircleXIcon className="h-4 w-4" />
              </button>
            ) : endIcon ? (
              <div aria-hidden="true" className="text-muted-foreground">
                {endIcon}
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {error ? (
              <p id={errorId} role="alert" className="mt-0.5 text-xs font-medium text-danger">
                {error}
              </p>
            ) : helperText ? (
              <p id={helperId} className="mt-0.5 text-xs text-muted-foreground">
                {helperText}
              </p>
            ) : null}
          </div>

          {showCount && (
            <p
              id={counterId}
              aria-live="polite"
              className={cn(
                "mt-0.5 whitespace-nowrap text-xs tabular-nums text-muted-foreground",
                isOverLimit && "font-medium text-danger",
              )}
            >
              {characterCount}
              {maxLength && ` / ${maxLength}`}
            </p>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
