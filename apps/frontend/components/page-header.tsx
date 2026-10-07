/** @format */

interface PageHeaderProps {
	/** Descrição curta da página. O título fica só na barra superior (breadcrumbs). */
	subtitle?: string;
}

export function PageHeader({ subtitle }: PageHeaderProps) {
	if (!subtitle) return null;
	return <p className='order-first text-sm text-muted-foreground'>{subtitle}</p>;
}
