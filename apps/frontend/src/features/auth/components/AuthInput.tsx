import type { LucideIcon } from "lucide-react";
import type { InputHTMLAttributes } from "react";

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
}

export const AuthInput = ({ label, icon: Icon, ...props }: AuthInputProps) => {
  return (
    <div className="space-y-2.5">
      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group">
        <Icon className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500 transition-colors group-focus-within:text-blue-400" />
        <input 
          {...props}
          className="w-full bg-neutral-950/50 border border-neutral-800/80 rounded-xl py-3 pl-10 pr-4 text-sm text-neutral-200 placeholder:text-neutral-600 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 outline-none transition-all shadow-inner"
        />
      </div>
    </div>
  );
};