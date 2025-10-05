function MainContentLayout({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`w-full h-full p-2 ${className || ''} max-w-5xl mx-auto`}>
        {children}
    </div>
  );
}
export default MainContentLayout;