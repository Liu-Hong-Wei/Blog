function MainContentLayout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {

  return (
    <div className={`h-full w-full p-4 pb-4 md:p-2 ${className || ''} mx-auto max-w-4xl`}>
      {children}
    </div>
  );
}
export default MainContentLayout;
