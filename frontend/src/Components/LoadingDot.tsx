const LoadingDot = () => (
    <>
        <div className="flex space-x-2 mx-auto">
            <span className="sr-only">Loading...</span>
            <div className="w-3 h-3 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 bg-gray-500 dark:bg-gray-300 rounded-full animate-bounce"></div>
        </div>
    </>
);
export default LoadingDot;
