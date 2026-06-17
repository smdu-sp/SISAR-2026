/** @format */

import React from 'react';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IInputSearchUnidades extends React.HTMLAttributes<HTMLInputElement> {

}

export function InputSearchUnidades({ ...rest }: IInputSearchUnidades) {
    return (
        <div className={cn(
            'flex items-center gap-2',
            'border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground h-[40px] w-[82%] min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
            'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        )}>
            <Search size={16} className="text-muted-foreground shrink-0" />
            <Input
                className={cn(
                    "flex-1",
                    "appearance-none",
                    "bg-transparent",
                    "border-none",
                    "focus-visible:outline-none focus-visible:ring-0",
                    "shadow-none",
                    "px-0 py-0 h-auto",
                    "placeholder:text-muted-foreground",
                    "text-foreground"
                )}
                placeholder="Buscar..."
                type="text"
            />
        </div>
    );
}