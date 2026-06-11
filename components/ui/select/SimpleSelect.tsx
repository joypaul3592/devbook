// "use client";

// import { useState, useEffect, useRef, useId } from "react";
// import { CaretDownOutlineIcon, CheckIcon } from "@/components/icons/Icons";
// import { cn } from "@/lib/utils";

// type Option = {
//   value: string;
//   label: string;
// };

// interface SimpleSelectProps {
//   options: Option[];
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   className?: string;
// }

// const SimpleSelect = ({ options, value, onChange, placeholder, className }: SimpleSelectProps) => {
//   const [isSelectOpen, setIsSelectOpen] = useState(false);
//   const selectRef = useRef<HTMLDivElement | null>(null);

//   // Generate a unique ID for this instance
//   const selectId = useId();

//   // Close dropdown if clicked outside
//   useEffect(() => {
//     const handleOutsideClick = (e: MouseEvent) => {
//       if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
//         setIsSelectOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => {
//       document.removeEventListener("mousedown", handleOutsideClick);
//     };
//   }, []);

//   // Toggle the dropdown open/close
//   const toggleDropdown = () => {
//     setIsSelectOpen((prev) => !prev);
//   };

//   // Handle option selection
//   const handleOptionSelect = (option: Option) => {
//     onChange(option.value);
//     setIsSelectOpen(false); // Close dropdown after selection
//   };

//   return (
//     <div ref={selectRef} className="relative ">
//       <button
//         id={selectId}
//         className={cn(
//           "flex justify-between items-center w-full h-8 px-3 pr-1 border border-black/30 dark:border-white/30 text-sm capitalize cursor-pointer bg-transparent transition-colors  focus:outline-none",
//           className,
//         )}
//         onClick={toggleDropdown}
//         aria-haspopup="listbox"
//         aria-expanded={isSelectOpen}
//         aria-controls={`${selectId}-listbox`}
//       >
//         <span>{options.find((opt) => opt.value === value)?.label || value || placeholder}</span>
//         <CaretDownOutlineIcon
//           className={`size-5 transition-transform duration-300 ${isSelectOpen ? "rotate-180" : "rotate-0"}`}
//         />
//       </button>

//       <div
//         id={`${selectId}-listbox`}
//         role="listbox"
//         className={cn(
//           "absolute left-0 right-0 mt-1 border  border-black/10 dark:border-white/10 bg-white  dark:bg-[#1b1b1b] shadow-md transition-all duration-300 z-50 rounded-sm",
//           isSelectOpen ? "visible opacity-100 translate-y-0" : "invisible opacity-0 translate-y-2",
//         )}
//       >
//         <div className="max-h-52 overflow-auto sideBar2">
//           {options.map((option) => (
//             <div
//               key={option.value}
//               role="option"
//               aria-selected={value === option.value ? "true" : "false"}
//               className={cn(
//                 "pl-3 pr-2 py-2 cursor-pointer transition-colors capitalize text-sm flex items-center justify-between",
//                 value === option.value
//                   ? "dark:bg-white/7 bg-black/7  text-white"
//                   : "dark:hover:bg-white/5 hover:bg-black/5",
//               )}
//               onClick={() => handleOptionSelect(option)}
//             >
//               <span className="truncate">{option.label}</span>
//               {value === option.value && <CheckIcon className="size-5" />}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SimpleSelect;

"use client";

import { useState, useEffect, useRef, useId } from "react";
import { CaretDownOutlineIcon, CheckIcon } from "@/components/icons/Icons";
import { cn } from "@/lib/utils";

type Option = {
  value: string;
  label: string;
};

interface SimpleSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const SimpleSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  className,
  disabled = false,
}: SimpleSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectRef = useRef<HTMLDivElement>(null);

  const selectId = useId();
  const listboxId = `${selectId}-listbox`;

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div ref={selectRef} className="relative w-full">
      <button
        type="button"
        id={selectId}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={cn(
          // Layout
          "flex h-10 w-full items-center justify-between  px-3 text-sm cursor-pointer",

          // Theme
          "bg-background text-foreground",

          // Border
          "ring-1 ring-border",

          // Focus
          "focus-visible:outline-none",
          "focus-visible:ring",
          "focus-visible:ring-ring",

          // Disabled
          "disabled:cursor-not-allowed",
          "disabled:opacity-60",

          // Animation
          "transition-all duration-200",

          className,
        )}
      >
        <span className={cn("truncate text-left", !selectedOption && "text-muted-foreground")}>
          {selectedOption?.label || placeholder}
        </span>

        <CaretDownOutlineIcon
          className={cn(
            "size-5 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      <div
        id={listboxId}
        role="listbox"
        aria-labelledby={selectId}
        className={cn(
          "absolute left-0 right-0 z-50 mt-2 overflow-hidden",

          // Theme
          " text-card-foreground",

          // Border
          "ring-1 ring-border",

          // Shadow
          "shadow-lg",

          // Animation
          "origin-top transition-all duration-200",

          isOpen
            ? "visible scale-100 opacity-100"
            : "invisible scale-95 opacity-0 pointer-events-none",
        )}
      >
        <div className="max-h-60 overflow-y-auto">
          {options.length > 0 ? (
            options.map((option) => {
              const isSelected = value === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option)}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors",

                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <span className="truncate">{option.label}</span>

                  {isSelected && <CheckIcon className="size-4 shrink-0" />}
                </button>
              );
            })
          ) : (
            <div className="px-3 py-2 text-sm text-muted-foreground">No options found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimpleSelect;
