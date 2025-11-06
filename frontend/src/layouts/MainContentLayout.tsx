function MainContentLayout({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full h-full md:p-2 p-4 pb-4 ${className || ''} max-w-4xl mx-auto`}>
        {children}
    </div>
  );
}
export default MainContentLayout;