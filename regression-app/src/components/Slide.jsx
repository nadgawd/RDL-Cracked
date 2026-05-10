const Slide = ({ children }) => {
    return (
        <div className="flex flex-col h-screen w-full bg-white text-black snap-start justify-center items-center px-16 border-b border-gray-300 relative">
            <div className="w-full max-w-5xl prose prose-lg prose-gray">
                {children}
            </div>
        </div>
    );
};

export default Slide;
