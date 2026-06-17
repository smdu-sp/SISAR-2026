/** @format */

'use client';

import React, { useState } from 'react';
import { FormGeneric } from '@/components/ui/formGeneric';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Função utilitária para combinar classes Tailwind

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

import { Input } from '@/components/ui/input';

export function FormImportacao() {
    const [selectedFileType, setSelectedFileType] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        } else {
            setSelectedFile(null);
        }
    };

    const handleCancel = () => {
        console.log('Ação de Cancelar');
        // Adicione sua lógica de cancelamento aqui
    };

    const handleSave = () => {
        console.log('Ação de Salvar');
        // Adicione a lógica de salvamento aqui
        if (selectedFileType && selectedFile) {
            console.log(`Tipo de arquivo selecionado: ${selectedFileType}, Arquivo: ${selectedFile.name}`);
            alert('Importação simulada realizada com sucesso!'); // Feedback temporário
        } else {
            alert('Por favor, selecione o tipo de arquivo e carregue um arquivo.');
        }
    };

    // Classes de borda e efeito de foco/invalidação, consolidadas para reutilização
    const commonBorderFocusStyles =
        "border-input focus-visible:border-ring focus-visible:ring-ring/50 " +
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border";

    return (
        <FormGeneric
            className={cn(
                "w-full max-w-3xl",
                "min-h-[400px]",
                "flex flex-col p-6 gap-6",
                "bg-white rounded-xl shadow-lg",
                commonBorderFocusStyles,
                "mt-8"
            )}
        >
            <label htmlFor="select-file-type" className="text-lg font-semibold mb-2">Tipo de arquivo</label>
            <Select
                value={selectedFileType}
                onValueChange={setSelectedFileType}
            >
                <SelectTrigger
                    id="select-file-type"
                    className={cn(
                        "w-full h-[50px] bg-white border border-gray-300 rounded-md px-3 py-2",
                        "placeholder:text-muted-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                >
                    <SelectValue placeholder="Selecione o tipo de distribuição" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Tipos de Distribuição</SelectLabel>
                        <SelectItem value="distribuicao">Distribuição</SelectItem>


                    </SelectGroup>
                    <SelectSeparator />
                    <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
            </Select>

            <label htmlFor="file-upload" className="text-lg font-semibold mb-2 mt-4">Carregar Arquivo</label>
            <Input
                id="file-upload"
                className={cn(
                    "w-full h-[50px] bg-white border border-gray-300 rounded-md px-3 py-2",
                )}
                type="file"
                onChange={handleFileChange}
            />
            {selectedFile && <p className="text-sm text-muted-foreground">Arquivo selecionado: {selectedFile.name}</p>}

            <div className="flex justify-center gap-2 mt-auto sm:justify-end">
                <Button
                    variant={'destructive'}
                    className="rounded-md px-4 py-2 h-auto"
                    onClick={handleCancel}
                >
                    Cancelar
                </Button>
                <Button
                    className="rounded-md px-4 py-2 h-auto"
                    onClick={handleSave}
                >
                    Salvar
                </Button>
            </div>
        </FormGeneric>
    );
}