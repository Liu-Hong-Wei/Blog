function ContainerLayout({ 
    children,
    className
}: { 
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`${className || ''} w-full p-6 bg-white rounded-lg shadow-2xs`}>
            {children}
        </div>
    );
}

export default ContainerLayout;