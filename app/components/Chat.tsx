import React from 'react';

const ChatInterface = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b p-4 flex items-center">
          <button className="mr-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-xl font-semibold">Marketing</h1>
          <button className="ml-auto">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </header>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* User message */}
          <div className="flex justify-end">
            <div className="bg-blue-500 text-white rounded-lg py-2 px-4 max-w-xs">
              Describe the strategy for the business, the basic steps.
            </div>
          </div>

          {/* Bot message */}
          <div className="flex justify-start">
            <div className="bg-white border rounded-lg py-2 px-4 max-w-xs">
              Okay, one minute. Determine the goals and objectives of the business, research the market and identify your niche, develop a unique selling proposition (USP) for your product or service. Then create a team of experts to do the development and develop a marketing and promotion strategy for your product.
            </div>
          </div>
        </div>

        {/* Input area */}
        <div className="bg-white border-t p-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Ask anything..."
              className="flex-1 border rounded-full py-2 px-4 mr-2"
            />
            <button className="bg-blue-500 text-white rounded-full p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Right panel (desktop only) */}
      <div className="hidden lg:block w-1/4 bg-white border-l p-4">
        <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
        <p>This panel can contain related information, settings, or other content relevant to the chat.</p>
      </div>
    </div>
  );
};

export default ChatInterface;