function ContainerLayout({
    children,
    className
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`${className || ''} w-full p-4 rounded-md shadow-xs hover:shadow-sm ease-in`}>
            {children}
        </div>
    );
}

export default ContainerLayout;