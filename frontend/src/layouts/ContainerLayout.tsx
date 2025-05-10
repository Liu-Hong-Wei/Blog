function ContainerLayout({ 
    children,
    className
}: { 
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`${className || ''} w-full p-4 bg-white rounded-md hover:shadow-sm duration-150 ease-in`}>
            {children}
        </div>
    );
}

export default ContainerLayout;