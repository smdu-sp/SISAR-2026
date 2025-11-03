'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { InputSearchUnidades } from './inputSearchUnidades';

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    SelectSeparator,
} from '@/components/ui/select';

export function MenuUnidades() {

    const [status, setStatus] = useState('')

    return (
        <div className='w-full h-auto py-2 flex flex-col items-center justify-start gap-2 px-4 sm:flex-row sm:justify-start sm:h-[60px]'>
            <div className='flex isolate -space-x-px'>
                <Button
                    className={cn(
                        "rounded-l-md rounded-r-none",
                        "h-[40px] w-10",
                        "text-white"
                    )}
                >
                    <RotateCw size={18} />
                </Button>
                <Button
                    variant={'destructive'}
                    className={cn(
                        "rounded-r-md rounded-l-none",
                        "h-[40px] w-10"
                    )}
                >
                    <X size={18} />
                </Button>
            </div>
            <Select
                value={status}
                onValueChange={setStatus}
            >
                <SelectTrigger
                    id="select-file-type"
                    className={cn(
                        "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border rounded-md shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]",
                        "w-full h-[40px] px-3 py-2 text-sm",
                        "sm:w-[120px]",
                        "rounded-l-none"
                    )}
                >
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value='todos'>todos</SelectItem>
                            <SelectItem value='ativos'>ativos</SelectItem>
                            <SelectItem value='inativos'>inativos</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </SelectContent>
            </Select>
            <InputSearchUnidades
                className={cn(
                    "flex-1",
                    "w-full",
                    "rounded-l-none",
                    "sm:max-w-xs md:max-w-md lg:max-w-xl"
                )}
            />
        </div>
    );
}