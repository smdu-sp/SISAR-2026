/** @format */

'use client';

import * as React from 'react';
import * as Form from '@radix-ui/react-form';

interface IFormGenericProps extends React.HTMLAttributes<HTMLFormElement> {
    children: React.ReactNode;
}

export function FormGeneric({ children, ...rest }: IFormGenericProps) {

    return (
        <Form.Root {...rest}>
            {children}
        </Form.Root>
    )

}
